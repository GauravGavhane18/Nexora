import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import toast from 'react-hot-toast'
import api from '../services/api'
import { motion } from 'framer-motion'
import AnimatedSection from '../components/AnimatedSection'

const EnhancedHome = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllProducts()
  }, [])

  const fetchAllProducts = async () => {
    try {
      const response = await api.get('/products')
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
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop', count: 245, icon: '📱' },
    { name: 'Food & Grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop', count: 1250, icon: '🛒' },
    { name: 'Fashion & Clothing', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', count: 890, icon: '👗' },
    { name: 'Home & Garden', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', count: 567, icon: '🏡' },
  ]

  const testimonials = [
    { name: 'Priya Sharma', role: 'Software Engineer, Pune', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', text: 'NEXORA has completely changed how I shop online. Amazing products at great prices with fast delivery across India!', rating: 5 },
    { name: 'Rahul Patel', role: 'Business Owner, Mumbai', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', text: 'Best online shopping experience! Quality products and excellent customer service. Highly recommended for all Indians!', rating: 5 },
    { name: 'Anjali Desai', role: 'Content Creator, Bangalore', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', text: 'The quality of products on NEXORA is unmatched. Been shopping here for 6 months and absolutely love it!', rating: 5 },
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
        <title>NEXORA - भारत का अपना E-Commerce Platform</title>
        <meta name="description" content="Discover premium products with subscription-based access on NEXORA - Made in India" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Animated Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-500 via-blue-600 to-green-600 text-white py-24 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl font-bold mb-4">
                Welcome to <span className="text-yellow-300">NEXORA</span>
              </h1>
              <p className="text-2xl mb-2">भारत का अपना E-Commerce Platform 🇮🇳</p>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                The next generation e-commerce platform with premium products and services for every Indian
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/products" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                🛍️ Explore Products
              </Link>
              <Link to="/deals" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105">
                🔥 View Hot Deals
              </Link>
            </motion.div>

            {/* Stats Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">50K+</p>
                <p className="text-sm">Happy Customers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm">Products</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">99%</p>
                <p className="text-sm">Satisfaction</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm">Support</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section with Animations */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatedSection animation="fadeUp" className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose NEXORA? 🌟
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of e-commerce with our advanced features
              </p>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '🚀', title: 'Premium Products', desc: 'Access exclusive products and services with our subscription-based model', color: 'blue' },
                { icon: '⚡', title: 'Lightning Fast Delivery', desc: 'Get instant notifications and fast delivery across all Indian cities', color: 'yellow' },
                { icon: '🛡️', title: 'Secure & Reliable', desc: 'Enterprise-grade security with advanced authentication and data protection', color: 'green' },
              ].map((feature, index) => (
                <AnimatedSection key={index} animation="scale" delay={index * 0.2}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="bg-white p-8 rounded-xl shadow-lg text-center cursor-pointer"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className={`w-20 h-20 bg-${feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-6`}
                    >
                      <span className="text-4xl">{feature.icon}</span>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products with Animations */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatedSection animation="fadeUp" className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products 🎁</h2>
              <p className="text-xl text-gray-600">Discover our most popular items</p>
            </AnimatedSection>
            
            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block rounded-full h-12 w-12 border-b-4 border-blue-600"
                />
                <p className="text-gray-600 mt-4">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product, index) => (
                  <AnimatedSection key={product._id} animation="fadeUp" delay={index * 0.1}>
                    <motion.div
                      whileHover={{ y: -10, scale: 1.03 }}
                      className="bg-white border rounded-xl shadow-md overflow-hidden group cursor-pointer"
                    >
                      <div className="relative overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          src={product.images?.[0]?.url || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">
                          ⭐ {product.ratings?.average || 4.5}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-blue-600">₹{product.basePrice}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAddToCart(product)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Add to Cart
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
            )}
            
            <AnimatedSection animation="fadeUp" delay={0.5} className="text-center mt-10">
              <Link to="/products" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105">
                View All Products →
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Categories with Hover Effects */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatedSection animation="fadeUp" className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category 📂</h2>
              <p className="text-xl text-gray-600">Browse our wide range of categories</p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <AnimatedSection key={category.name} animation="scale" delay={index * 0.1}>
                  <Link to={`/category/${category.name.toLowerCase()}`}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                        <div className="text-4xl mb-2">{category.icon}</div>
                        <h3 className="text-white text-xl font-bold">{category.name}</h3>
                        <p className="text-gray-300 text-sm">{category.count} Products</p>
                      </div>
                    </motion.div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials with Animations */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatedSection animation="fadeUp" className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say 💬</h2>
              <p className="text-xl text-gray-600">Join thousands of satisfied customers across India</p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedSection key={index} animation="fadeUp" delay={index * 0.2}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.03 }}
                    className="bg-white p-8 rounded-xl shadow-lg border-2 border-transparent hover:border-blue-500 transition-all"
                  >
                    <div className="flex text-yellow-400 mb-4 text-xl">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter with Animation */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white relative overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <AnimatedSection animation="fadeUp">
              <h2 className="text-4xl font-bold mb-4">Stay Updated 📧</h2>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Subscribe
                </motion.button>
              </form>
              <p className="text-sm mt-4 text-white/70">No spam, unsubscribe anytime.</p>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 via-blue-600 to-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <AnimatedSection animation="scale">
              <h2 className="text-5xl font-bold mb-6">
                Ready to Get Started? 🚀
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust NEXORA for their premium shopping experience
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl">
                  Start Your Journey 🇮🇳
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </>
  )
}

export default EnhancedHome
