import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import toast from 'react-hot-toast'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { FaArrowRight, FaStar, FaShoppingCart, FaShieldAlt, FaBolt, FaRocket, FaCrown, FaMapMarkedAlt, FaPlay } from 'react-icons/fa'

import api from '../services/api'
import { getHomeRecommendations } from '../services/recommendationService'
import SkeletonCard from '../components/UI/SkeletonCard'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)

  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -150])

  useEffect(() => {
    fetchAllProducts()
    if (user && (user._id || user.id)) {
      getHomeRecommendations(user._id || user.id).then(setRecommendations)
    }
  }, [user])

  const fetchAllProducts = async () => {
    try {
      const response = await api.get('/products?limit=50')
      const allProducts = response.data.data.products || []
      setFeaturedProducts(allProducts.slice(0, 8))
      setTrendingProducts(allProducts.slice(8, 12))
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.basePrice || product.price,
      image: product.images?.[0]?.url || product.image,
      quantity: 1
    }))
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img className="h-10 w-10 rounded-full object-cover" src={product.images?.[0]?.url} alt="" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Added to Cart</p>
              <p className="mt-1 text-sm text-gray-500">{product.name}</p>
            </div>
          </div>
        </div>
      </div>
    ))
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      toast.success('Welcome to the inner circle! Check your inbox.')
      setEmail('')
    }
  }

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80', count: 245, color: 'from-blue-500 to-cyan-500' },
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', count: 890, color: 'from-purple-500 to-pink-500' },
    { name: 'Home', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', count: 567, color: 'from-orange-500 to-amber-500' },
    { name: 'Grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', count: 1250, color: 'from-green-500 to-emerald-500' },
  ]

  return (
    <>
      <Helmet>
        <title>NEXORA | The Future of Shopping</title>
        <meta name="description" content="Discover premium products with subscription-based access on NEXORA." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-primary-200 selection:text-primary-900">

        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
          {/* Abstract Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary-600/20 blur-[120px] animate-blob"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-600/20 blur-[120px] animate-blob animation-delay-2000"></div>
            <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px] animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ y: y1 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-primary-300 mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                  AI-Powered Shopping Experience
                </div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1] font-display text-white">
                  More Than <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-gradient-x">Just Shopping.</span>
                </h1>

                <p className="text-xl text-slate-300 mb-10 max-w-xl leading-relaxed border-l-2 border-primary-500/50 pl-6">
                  Experience the next generation of e-commerce. Personalized by AI, curated by experts, delivered with speed.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link to="/products" className="group relative flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-50 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)]">
                    Start Exploring
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button onClick={() => {
                    const el = document.getElementById('demo-video');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }} className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-white border border-white/10 hover:bg-white/5 transition-all backdrop-blur-sm group">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                      <FaPlay size={10} className="ml-0.5" />
                    </div>
                    Watch Demo
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ y: y2 }}
                className="relative hidden lg:block"
              >
                <div className="relative z-10 w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group bg-slate-900/50 backdrop-blur-sm">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
                    alt="Hero Product"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                  />

                  {/* Floating Product Cards */}
                  <div className="absolute top-10 -right-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl flex items-center gap-4 animate-bounce-slow">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary-600">
                      <FaBolt size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold">Fast Delivery</p>
                      <p className="text-white/60 text-xs">Under 2 hours</p>
                    </div>
                  </div>

                  <div className="absolute bottom-20 -left-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl flex items-center gap-4 animate-pulse-slow">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-secondary-600">
                      <FaCrown size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold">Premium Quality</p>
                      <p className="text-white/60 text-xs">Verified Sellers</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* BRANDS TICKER */}
        <div className="bg-slate-950 border-t border-white/5 py-10 overflow-hidden">
          <div className="flex gap-20 animate-marquee whitespace-nowrap opacity-40 hover:opacity-100 transition-opacity duration-500">
            {['NIKE', 'ADIDAS', 'APPLE', 'SAMSUNG', 'SONY', 'GUCCI', 'ZARA', 'NIKE', 'ADIDAS', 'APPLE'].map((brand, i) => (
              <span key={i} className="text-4xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-wider hover:text-white transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* AI RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                <div>
                  <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Personalized For You</span>
                  <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900">AI Picks <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Just For You</span></h2>
                </div>
                <div className="hidden md:flex gap-2">
                  {/* Custom Navigation buttons could go here */}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {recommendations.map((rec, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={rec._id || rec.product_id}
                    whileHover={{ y: -10 }}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-3xl bg-slate-100 shadow-md group-hover:shadow-2xl transition-all duration-500">
                      <img
                        src={rec.image || 'https://placehold.co/400x500?text=No+Image'}
                        alt={rec.name}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x500?text=Product'; }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                        {rec.reason || 'Best Match'}
                      </div>

                      {/* Quick Add Button */}
                      <button
                        onClick={() => navigate(`/products/${rec.product_id}`)}
                        className="absolute bottom-4 right-4 bg-slate-900 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg translate-y-20 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary-600"
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{rec.name}</h3>
                    <p className="text-primary-600 font-medium">${rec.price}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FEATURED CATEGORIES - BENTO GRID */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold font-display text-slate-900 mb-12 text-center">Curated Collections</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/category/${cat.name.toLowerCase()}`}
                  className={`group relative rounded-[2rem] overflow-hidden ${idx === 0 || idx === 3 ? 'md:col-span-2' : ''} ${idx === 1 ? 'md:row-span-2' : ''}`}
                >
                  <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-20 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-40`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="text-3xl font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{cat.name}</h3>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 delay-75">
                      <span className="text-white/80">{cat.count} Items</span>
                      <span className="bg-white text-slate-900 w-10 h-10 rounded-full flex items-center justify-center"><FaArrowRight size={12} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* LIFESTYLE / VIDEO SECTION */}
        <section id="demo-video" className="py-24 bg-slate-900 text-white relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          </div>

          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/10 text-sm font-medium mb-8 backdrop-blur-sm">
              Next Level Features
            </span>
            <h2 className="text-5xl md:text-7xl font-bold font-display mb-10 leading-tight">
              Shopping Reimagined <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">For The Future</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
              {[
                { title: 'Real-Time Auctions', desc: 'Bid on exclusive items with our WebSocket powered engine.' },
                { title: 'AI Assistant', desc: 'Get 24/7 support and recommendations from our Python-based AI.' },
                { title: 'Secure Payments', desc: 'Seamless transactions with Stripe and Crypto integration.' },
              ].map((feat, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:bg-white/10 transition-colors backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER - UNIQUE DESIGN */}
        <section className="py-24 bg-white relative">
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <div className="bg-primary-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary-500/30">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-secondary-500 blur-3xl opacity-50"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-blue-500 blur-3xl opacity-50"></div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">Stay in the Loop</h2>
                <p className="text-primary-100 text-lg mb-10 max-w-lg mx-auto">Join the VIP list to get early access to drops and exclusive content.</p>

                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-8 py-5 rounded-full bg-white text-slate-900 border-none focus:ring-4 focus:ring-primary-400/50 shadow-lg placeholder:text-slate-400 outline-none"
                    required
                  />
                  <button type="submit" className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-6 rounded-full font-bold hover:bg-slate-800 transition-colors">
                    Join
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}

export default Home