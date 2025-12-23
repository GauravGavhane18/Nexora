import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const Categories = () => {
  const categories = [
    { 
      id: 1, 
      name: 'Electronics', 
      slug: 'electronics', 
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop', 
      count: 245, 
      description: 'Latest gadgets and tech devices',
      products: [
        { id: 101, name: 'iPhone 15 Pro', price: 999.99, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop' },
        { id: 102, name: 'MacBook Air M2', price: 1199.99, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop' },
        { id: 103, name: 'iPad Pro 12.9"', price: 799.99, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop' },
        { id: 104, name: 'Samsung Galaxy S24', price: 899.99, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop' },
        { id: 105, name: 'Dell XPS 13', price: 1099.99, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' }
      ]
    },
    { 
      id: 2, 
      name: 'Food & Grocery', 
      slug: 'food-grocery', 
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop', 
      count: 1250, 
      description: 'Fresh food and daily essentials',
      products: [
        { id: 201, name: 'Organic Bananas (2 lbs)', price: 3.99, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop' },
        { id: 202, name: 'Whole Grain Bread', price: 4.49, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop' },
        { id: 203, name: 'Greek Yogurt (32 oz)', price: 5.99, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop' },
        { id: 204, name: 'Organic Eggs (12 count)', price: 6.99, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop' },
        { id: 205, name: 'Almond Milk (64 oz)', price: 4.99, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop' }
      ]
    },
    { 
      id: 3, 
      name: 'Fashion & Clothing', 
      slug: 'fashion-clothing', 
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', 
      count: 890, 
      description: 'Trendy clothes and accessories',
      products: [
        { id: 301, name: 'Nike Air Max 270', price: 149.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop' },
        { id: 302, name: 'Levi\'s 501 Jeans', price: 89.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop' },
        { id: 303, name: 'Adidas Hoodie', price: 79.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop' },
        { id: 304, name: 'Ray-Ban Sunglasses', price: 199.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop' },
        { id: 305, name: 'Leather Jacket', price: 299.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop' }
      ]
    },
    { 
      id: 4, 
      name: 'Home & Garden', 
      slug: 'home-garden', 
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', 
      count: 567, 
      description: 'Furniture and home decor',
      products: [
        { id: 401, name: 'Ergonomic Office Chair', price: 299.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop' },
        { id: 402, name: 'Standing Desk', price: 399.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop' },
        { id: 403, name: 'LED Floor Lamp', price: 129.99, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
        { id: 404, name: 'Throw Pillows Set', price: 49.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop' },
        { id: 405, name: 'Indoor Plant Collection', price: 89.99, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop' }
      ]
    },
    { 
      id: 5, 
      name: 'Sports & Fitness', 
      slug: 'sports-fitness', 
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 
      count: 423, 
      description: 'Workout gear and sports equipment',
      products: [
        { id: 501, name: 'Adjustable Dumbbells', price: 199.99, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop' },
        { id: 502, name: 'Yoga Mat Premium', price: 39.99, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop' },
        { id: 503, name: 'Resistance Bands Set', price: 29.99, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop' },
        { id: 504, name: 'Protein Shaker Bottle', price: 19.99, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop' },
        { id: 505, name: 'Fitness Tracker Watch', price: 149.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' }
      ]
    },
    { 
      id: 6, 
      name: 'Books & Media', 
      slug: 'books-media', 
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop', 
      count: 789, 
      description: 'Books, movies, and digital content',
      products: [
        { id: 601, name: 'The Psychology of Money', price: 16.99, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop' },
        { id: 602, name: 'Atomic Habits', price: 18.99, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop' },
        { id: 603, name: 'Kindle Paperwhite', price: 139.99, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop' },
        { id: 604, name: 'Bluetooth Headphones', price: 79.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
        { id: 605, name: 'Notebook Set', price: 24.99, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop' }
      ]
    }
  ]

  return (
    <>
      <Helmet>
        <title>Categories - NEXORA</title>
        <meta name="description" content="Browse all product categories" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
            <p className="text-xl text-gray-600">Find exactly what you're looking for</p>
          </div>

          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Category Header */}
                <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h2 className="text-4xl font-bold mb-2">{category.name}</h2>
                      <p className="text-xl mb-4">{category.description}</p>
                      <p className="text-lg">{category.count} products available</p>
                    </div>
                  </div>
                </div>

                {/* Featured Products */}
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Featured Products</h3>
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      View All <span className="ml-1">→</span>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {category.products.map((product) => (
                      <div key={product.id} className="group cursor-pointer">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-blue-600 font-bold">${product.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Why Shop Our Categories?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-4xl font-bold mb-2">4,000+</p>
                <p className="text-blue-100">Total Products</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">6</p>
                <p className="text-blue-100">Main Categories</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">24/7</p>
                <p className="text-blue-100">Customer Support</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">Free</p>
                <p className="text-blue-100">Shipping $50+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Categories