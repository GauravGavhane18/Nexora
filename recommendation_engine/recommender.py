import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from database import get_database
from bson import ObjectId

class RecommendationEngine:
    def __init__(self):
        self.db = get_database()
        self.products_df = None
        self.interactions_df = None
        self.tfidf_matrix = None
        self.tfidf_vectorizer = None
        self.product_indices = None
        
    def load_data(self):
        """Loads products and interactions from MongoDB into Pandas DataFrames"""
        # Load Products
        products_cursor = self.db.products.find(
            {"isActive": True, "status": "published"}, 
            {"_id": 1, "name": 1, "description": 1, "tags": 1, "category": 1, "images": 1, "basePrice": 1, "ratings": 1, "slug": 1}
        )
        products = list(products_cursor)
        if not products:
            print("No products found.")
            return

        for p in products:
            p['_id'] = str(p['_id'])
            # Combine text features
            tags = " ".join(p.get('tags', []))
            p['combined_features'] = f"{p.get('name', '')} {p.get('description', '')} {tags}"
            
        self.products_df = pd.DataFrame(products)
        self.products_df.set_index('_id', inplace=True)
        
        # TF-IDF Setup
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(self.products_df['combined_features'].fillna(''))
        
        # Load Interactions
        # We look at both UserInteraction (new) and UserActivity (old) if needed.
        # For now, let's assume we populate UserInteraction or just read UserInteraction.
        interactions_cursor = self.db.userinteractions.find()
        interactions = list(interactions_cursor)
        
        if interactions:
            for i in interactions:
                i['_id'] = str(i['_id'])
                i['userId'] = str(i['userId'])
                i['productId'] = str(i['productId'])
            self.interactions_df = pd.DataFrame(interactions)
        else:
            self.interactions_df = pd.DataFrame(columns=['userId', 'productId', 'action', 'timestamp'])
            
        print(f"Loaded {len(self.products_df)} products and {len(self.interactions_df)} interactions.")

    def get_content_based_recommendations(self, product_id, top_n=5):
        """Recommends products similar to a given product_id based on content"""
        if self.products_df is None or product_id not in self.products_df.index:
            return []

        # Find the index of the product in the TF-IDF matrix
        # Since df index is _id, we need to map it to matrix row index
        # We can reset index to get integer indices or use mapped dict
        idx_map = {pid: i for i, pid in enumerate(self.products_df.index)}
        if product_id not in idx_map:
            return []
            
        idx = idx_map[product_id]
        
        # Calculate cosine similarity for this product vs all others
        cosine_sim = cosine_similarity(self.tfidf_matrix[idx:idx+1], self.tfidf_matrix).flatten()
        
        # Get top N indices
        related_indices = cosine_sim.argsort()[-(top_n+1):-1][::-1]
        
        recommendations = []
        for i in related_indices:
            rec_id = self.products_df.index[i]
            if rec_id == product_id: continue
            
            product = self.products_df.loc[rec_id]
            recommendations.append({
                "product_id": rec_id,
                "name": product['name'],
                "price": product['basePrice'],
                "image": product['images'][0]['url'] if product['images'] else None,
                "slug": product.get('slug'),
                "reason": f"Similar to {self.products_df.loc[product_id]['name']}",
                "score": float(cosine_sim[i])
            })
            
        return recommendations

    def get_collaborative_recommendations(self, user_id, top_n=5):
        """
        Simple item-based collaborative filtering based on user history.
        If user viewed A and B, and current user viewed A, recommend B.
        """
        if self.interactions_df is None or self.interactions_df.empty:
            return []
            
        # Get products user has interacted with
        user_history = self.interactions_df[self.interactions_df['userId'] == user_id]
        if user_history.empty:
            return []

        interacted_products = user_history['productId'].unique()
        
        # Find other users who interacted with these products
        similar_users = self.interactions_df[self.interactions_df['productId'].isin(interacted_products)]['userId'].unique()
        
        # Find what ELSE these users interacted with
        recs = self.interactions_df[
            (self.interactions_df['userId'].isin(similar_users)) & 
            (~self.interactions_df['productId'].isin(interacted_products))
        ]
        
        # Count frequency (popularity among similar users)
        rec_counts = recs['productId'].value_counts()
        
        recommendations = []
        for pid, count in rec_counts.head(top_n).items():
            if pid not in self.products_df.index: continue
            product = self.products_df.loc[pid]
            recommendations.append({
                "product_id": pid,
                "name": product['name'],
                "price": product['basePrice'],
                "image": product['images'][0]['url'] if product['images'] else None,
                "slug": product.get('slug'),
                "reason": "Users with similar taste bought this",
                "score": float(count) # Normalize later if needed
            })
            
        return recommendations

    def get_popular_products(self, top_n=5):
        """Fallback to popular products"""
        if self.products_df is None: return []
        
        # Using ratings info from product itself if interactions not enough
        # Convert ratings.average to numeric just in case
        # self.products_df['rating_val'] = pd.to_numeric(self.products_df['ratings'].apply(lambda x: x.get('average', 0)))
        
        # Simple sorting by salesCount if available in DF? 
        # I didn't load salesCount, let's assume high rating is good enough proxy for now
        # Actually I didn't load salesCount. Let's rely on average rating.
        
        # Safe access to nested ratings
        def get_avg_rating(row):
            try:
                return row['ratings'].get('average', 0)
            except:
                return 0
                
        self.products_df['avg_rating'] = self.products_df.apply(get_avg_rating, axis=1)
        popular = self.products_df.sort_values('avg_rating', ascending=False).head(top_n)
        
        recs = []
        for pid, row in popular.iterrows():
            recs.append({
                "product_id": pid,
                "name": row['name'],
                "price": row['basePrice'],
                "image": row['images'][0]['url'] if row['images'] else None,
                "slug": row.get('slug'),
                "reason": "Highly rated by our community",
                "score": 1.0
            })
        return recs

    def recommend_for_user(self, user_id, top_n=5):
        """Hybrid Recommendation Logic"""
        # Ensure data is loaded (could be improved with periodic refresh)
        if self.products_df is None:
            self.load_data()
            
        # 1. Collaborative (Strong signal)
        collab_recs = self.get_collaborative_recommendations(user_id, top_n=top_n)
        
        # 2. If not enough collab, mix with popular
        if len(collab_recs) < top_n:
            pop_recs = self.get_popular_products(top_n = top_n - len(collab_recs))
            collab_recs.extend(pop_recs)
            
        return collab_recs[:top_n]

    def recommend_similar_products(self, product_id, top_n=5):
        if self.products_df is None:
            self.load_data()
        return self.get_content_based_recommendations(product_id, top_n)

engine = RecommendationEngine()
