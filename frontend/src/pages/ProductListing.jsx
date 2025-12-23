import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice'
import toast from 'react-hot-toast'

const ProductListing = () => {
  const dispatch = useDispatch()
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  
  const [products] = useState([
    // Electronics
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: 1199.99,
      originalPrice: 1299.99,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 2847,
      category: 'Electronics',
      inStock: true
    },
    {
      id: 2,
      name: 'MacBook Pro 16" M3',
      price: 2399.99,
      originalPrice: 2599.99,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 1234,
      category: 'Electronics',
      inStock: true
    },
    {
      id: 3,
      name: 'Samsung 65" QLED TV',
      price: 899.99,
      originalPrice: 1199.99,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 892,
      category: 'Electronics',
      inStock: true
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5 Headphones',
      price: 349.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 1567,
      category: 'Electronics',
      inStock: true
    },

    // Food & Grocery
    {
      id: 5,
      name: 'Organic Avocados (6 pack)',
      price: 8.99,
      originalPrice: 11.99,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 234,
      category: 'Food & Grocery',
      inStock: true
    },
    {
      id: 6,
      name: 'Premium Coffee Beans (2 lbs)',
      price: 24.99,
      originalPrice: 29.99,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 567,
      category: 'Food & Grocery',
      inStock: true
    },
    {
      id: 7,
      name: 'Organic Honey (32 oz)',
      price: 18.99,
      originalPrice: 22.99,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop',
      rating: 4.4,
      reviews: 345,
      category: 'Food & Grocery',
      inStock: true
    },
    {
      id: 8,
      name: 'Artisan Sourdough Bread',
      price: 6.99,
      originalPrice: 8.99,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 123,
      category: 'Food & Grocery',
      inStock: true
    },

    // Fashion & Clothing
    {
      id: 9,
      name: 'Nike Air Jordan 1 Retro',
      price: 169.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 1892,
      category: 'Fashion & Clothing',
      inStock: true
    },
    {
      id: 10,
      name: 'Levi\'s 511 Slim Jeans',
      price: 79.99,
      originalPrice: 98.99,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
      rating: 4.4,
      reviews: 756,
      category: 'Fashion & Clothing',
      inStock: true
    },
    {
      id: 11,
      name: 'Patagonia Down Jacket',
      price: 249.99,
      originalPrice: 299.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 432,
      category: 'Fashion & Clothing',
      inStock: true
    },
    {
      id: 12,
      name: 'Ray-Ban Aviator Classic',
      price: 179.99,
      originalPrice: 219.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 1023,
      category: 'Fashion & Clothing',
      inStock: true
    },

    // Home & Garden
    {
      id: 13,
      name: 'Herman Miller Aeron Chair',
      price: 1395.99,
      originalPrice: 1595.99,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 234,
      category: 'Home & Garden',
      inStock: true
    },
    {
      id: 14,
      name: 'IKEA Standing Desk',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
      rating: 4.2,
      reviews: 567,
      category: 'Home & Garden',
      inStock: true
    },
    {
      id: 15,
      name: 'Philips Hue Smart Bulbs (4-pack)',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 892,
      category: 'Home & Garden',
      inStock: true
    },
    {
      id: 16,
      name: 'Dyson V15 Detect Vacuum',
      price: 649.99,
      originalPrice: 749.99,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 1456,
      category: 'Home & Garden',
      inStock: true
    },

    // Sports & Fitness
    {
      id: 17,
      name: 'Peloton Bike+',
      price: 2495.99,
      originalPrice: 2795.99,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 3421,
      category: 'Sports & Fitness',
      inStock: true
    },
    {
      id: 18,
      name: 'Bowflex Adjustable Dumbbells',
      price: 349.99,
      originalPrice: 429.99,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 1234,
      category: 'Sports & Fitness',
      inStock: true
    },
    {
      id: 19,
      name: 'Lululemon Yoga Mat',
      price: 68.99,
      originalPrice: 88.99,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 567,
      category: 'Sports & Fitness',
      inStock: true
    },
    {
      id: 20,
      name: 'Apple Watch Series 9',
      price: 399.99,
      originalPrice: 449.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 2134,
      category: 'Sports & Fitness',
      inStock: true
    },

    // Books & Media
    {
      id: 21,
      name: 'The 7 Habits of Highly Effective People',
      price: 15.99,
      originalPrice: 19.99,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 8934,
      category: 'Books & Media',
      inStock: true
    },
    {
      id: 22,
      name: 'Kindle Oasis (32GB)',
      price: 279.99,
      originalPrice: 329.99,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
      rating: 4.4,
      reviews: 1567,
      category: 'Books & Media',
      inStock: true
    },
    {
      id: 23,
      name: 'Bose QuietComfort Earbuds',
      price: 279.99,
      originalPrice: 329.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 2341,
      category: 'Books & Media',
      inStock: true
    },
    {
      id: 24,
      name: 'Moleskine Classic Notebook Set',
      price: 39.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 456,
      category: 'Books & Media',
      inStock: true
    }
  ])

  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    inStock: false
  })

  const [sortBy, setSortBy] = useState('name')

  const categories = ['Electronics', 'Food & Grocery', 'Fashion & Clothing', 'Home & Garden', 'Sports & Fitness', 'Books & Media']

  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.inStock && !product.inStock) return false
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      if (product.price < min || product.price > max) return false
    }
    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'rating': return b.rating - a.rating
      default: return a.name.localeCompare(b.name)
    }
  })

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    }))
    toast.success(`${product.name} added to cart!`)
  }

  const isInWishlist = (id) => wishlistItems.some(item => item.id === id)

  const handleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      dispatch(removeFromWishlist(product.id))
      toast.success('Removed from wishlist')
    } else {
      dispatch(addToWishlist({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image }))
      toast.success('Added to wishlist!')
    }
  }

  return (
    <>
      <Helmet>
        <title>Products - NEXORA</title>
        <meta name="description" content="Browse our premium product collection" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Premium Products</h1>
            <p className="text-gray-600">Discover our curated collection of high-quality products</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-64 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Prices</option>
                    <option value="0-100">Under $100</option>
                    <option value="100-300">$100 - $300</option>
                    <option value="300-500">$300 - $500</option>
                    <option value="500-1000">$500+</option>
                  </select>
                </div>

                <button
                  onClick={() => setFilters({ category: '', priceRange: '', inStock: false })}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Products */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">{sortedProducts.length} products found</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                    <Link to={`/products/${product.id}`}>
                      <div className="aspect-square overflow-hidden relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        <button
                          onClick={(e) => { e.preventDefault(); handleWishlist(product); }}
                          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors ${
                            isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
                          }`}
                        >
                          ♥
                        </button>
                      </div>
                    </Link>
                    <div className="p-4">
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{product.category}</span>
                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 mt-2 mb-2 hover:text-blue-600">{product.name}</h3>
                      </Link>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</div>
                        <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">${product.price}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductListing