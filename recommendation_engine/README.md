# NEXORA Recommendation Engine

This is a standalone microservice responsible for generating product recommendations.

## Technology Stack
- **Language**: Python 3.9+
- **Framework**: FastAPI
- **Database**: MongoDB (via PyMongo/Motor)
- **ML Libraries**: Scikit-Learn (TF-IDF), Pandas, NumPy

## Architecture
- **Content-Based Filtering**: Uses product names, descriptions, and tags to find similar products (TF-IDF + Cosine Similarity).
- **Collaborative Filtering**: Uses user interaction history (views, purchases) to find "users like you".
- **Hybrid Approach**: Combines both scores for optimal results.

## API Endpoints
- `GET /recommend/home/{user_id}`: Personalized home page recommendations.
- `GET /recommend/product/{product_id}`: Similar products.
- `GET /`: Health check.

## Setup & Running
This service is automatically started by `start-dev.bat`.
To run manually:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
