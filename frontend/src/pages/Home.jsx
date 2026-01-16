import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import toast from 'react-hot-toast'

import api from '../services/api'
import { getHomeRecommendations } from '../services/recommendationService'
import { useSelector } from 'react-redux'

const Home = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    fetchAllProducts()
    if (user && (user._id || user.id)) {
      getHomeRecommendations(user._id || user.id).then(setRecommendations)
    }
  }, [user])

  const fetchAllProducts = async () => {
    try {
      const response = await api.get('/products?limit=50')
      console.log('Products:', response.data)
      const allProducts = response.data.data.products || []
      setFeaturedProducts(allProducts.slice(0, 4))
      setTrendingProducts(allProducts.slice(4, 8))
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop', count: 245 },
    { name: 'Food & Grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop', count: 1250 },
    { name: 'Fashion & Clothing', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', count: 890 },
    { name: 'Home & Garden', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', count: 567 },
  ]

  const testimonials = [
    { name: 'Priya Sharma', role: 'Software Engineer, Pune', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', text: 'NEXORA has completely changed how I shop online. Amazing products at great prices with fast delivery across India!', rating: 5 },
    { name: 'Rahul Patel', role: 'Business Owner, Mumbai', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', text: 'Best online shopping experience! Quality products and excellent customer service. Highly recommended for all Indians!', rating: 5 },
    { name: 'Anjali Desai', role: 'Content Creator, Bangalore', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', text: 'The quality of products on NEXORA is unmatched. Been shopping here for 6 months and absolutely love it!', rating: 5 },
    { name: 'Vikram Singh', role: 'Student, Delhi', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', text: 'Great deals and fast shipping! Perfect for students like me. The loyalty program is amazing too!', rating: 5 },
    { name: 'Sneha Reddy', role: 'Doctor, Hyderabad', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', text: 'Trustworthy platform with genuine products. Love the easy returns and customer support!', rating: 5 },
    { name: 'Arjun Mehta', role: 'Entrepreneur, Ahmedabad', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', text: 'NEXORA is my go-to for all online shopping. Quality products, competitive prices, and reliable service!', rating: 5 },
  ]

  const brands = [
    { name: 'Apple', logo: '🍎' },
    { name: 'Samsung', logo: '📱' },
    { name: 'Sony', logo: '🎮' },
    { name: 'Microsoft', logo: '💻' },
    { name: 'Google', logo: '🔍' },
    { name: 'Amazon', logo: '📦' },
  ]

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.basePrice || product.price,
      image: product.images?.[0]?.url || product.image,
      quantity: 1
    }))
    toast.success(
      <div>
        <p className="font-semibold">{product.name} added to cart!</p>
        <Link to="/cart" className="text-blue-600 hover:underline text-sm">View Cart</Link>
      </div>,
      { duration: 3000 }
    )
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      toast.success('Thanks for subscribing! Check your email for exclusive deals.')
      setEmail('')
    }
  }

  return (
    <>
      <Helmet>
        <title>NEXORA - Advanced E-Commerce Platform</title>
        <meta name="description" content="Discover premium products with subscription-based access on NEXORA." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">NEXORA</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              The next generation e-commerce platform with subscription-based access to premium products and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Explore Products
              </Link>
              <Link to="/deals" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                View Hot Deals
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose NEXORA?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of e-commerce with our advanced features and subscription-based model.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Premium Products</h3>
                <p className="text-gray-600">
                  Access exclusive products and services with our subscription-based model.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Real-time Updates</h3>
                <p className="text-gray-600">
                  Get instant notifications about orders, inventory, and exclusive offers.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Secure & Reliable</h3>
                <p className="text-gray-600">
                  Enterprise-grade security with advanced authentication and data protection.
                </p>
              </div>
            </div>
          </div>
        </section >

        {/* Recommended for You */}
        {
          recommendations.length > 0 && (
            <section className="py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Recommended for You</h2>
                  <p className="text-xl text-gray-600">Picked just for you based on your interests</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendations.map((rec) => (
                    <div key={rec.product_id} className="bg-white border rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                      <div className="relative overflow-hidden">
                        <img src={rec.image || 'https://via.placeholder.com/300?text=No+Image'} alt={rec.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          {rec.reason}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 truncate">{rec.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-blue-600">${rec.price}</span>
                          <Link
                            to={`/products/${rec.product_id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        }

        {/* Featured Products Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-xl text-gray-600">Discover our most popular items</p>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <div key={product._id} className="bg-white border rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                    <div className="relative overflow-hidden">
                      <img src={product.images?.[0]?.url || '/api/placeholder/300/300'} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">
                        ⭐ {product.ratings?.average || 4.5}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">${product.basePrice}</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center mt-10">
              <Link to="/products" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                View All Products →
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-xl text-gray-600">Browse our wide range of categories</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link key={category.name} to={`/category/${category.name.toLowerCase()}`} className="group relative rounded-xl overflow-hidden shadow-lg">
                  <img src={category.image} alt={category.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white text-xl font-bold">{category.name}</h3>
                    <p className="text-gray-300 text-sm">{category.count} Products</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/categories" className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors">
                Browse All Categories →
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Products Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">🔥 Trending Now</h2>
              <p className="text-xl text-gray-600">Don't miss out on these hot items</p>
            </div>
            {trendingProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No trending products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingProducts.map((product) => (
                  <div key={product._id} className="bg-white border rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                    <div className="relative overflow-hidden">
                      <img src={product.images?.[0]?.url || '/api/placeholder/300/300'} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                      {product.comparePrice && (
                        <div className="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold text-white bg-red-500">
                          SALE
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">
                        ⭐ {product.ratings?.average || 4.5}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-blue-600">₹{product.basePrice}</span>
                        {product.comparePrice && (
                          <>
                            <span className="text-sm text-gray-500 line-through">₹{product.comparePrice}</span>
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                              -{Math.round((1 - product.basePrice / product.comparePrice) * 100)}%
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="text-xl text-gray-600">Join thousands of satisfied customers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex text-yellow-400 mb-4">
                    {'★'.repeat(testimonial.rating)}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">Trusted by Top Brands</h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {brands.map((brand, index) => (
                <div key={index} className="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  <span className="text-4xl mb-2">{brand.logo}</span>
                  <span className="text-sm font-medium">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get 10% off your first order plus exclusive deals!
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <button type="submit" className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                Subscribe
              </button>
            </form>
            <p className="text-sm mt-4 text-white/70">No spam, unsubscribe anytime.</p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-blue-400">50K+</p>
                <p className="text-gray-400 mt-2">Happy Customers</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-green-400">10K+</p>
                <p className="text-gray-400 mt-2">Products</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-yellow-400">99%</p>
                <p className="text-gray-400 mt-2">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-400">24/7</p>
                <p className="text-gray-400 mt-2">Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust NEXORA for their premium shopping experience.
            </p>
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block">
              Start Your Journey
            </Link>
          </div>
        </section>
      </div >
    </>
  )
}

export default Home