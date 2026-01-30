import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import { toggleTheme } from '../../redux/slices/themeSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHome, FaShoppingBag, FaGavel, FaTags, FaFire, FaStar, FaSearch, FaUser, FaSignOutAlt, FaBars, FaTimes, FaHeart, FaShoppingCart, FaMoon, FaSun, FaCrown, FaMapMarkedAlt } from 'react-icons/fa'

const ModernHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const { isDark } = useSelector((state) => state.theme)

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)
  const wishlistCount = wishlistItems.length

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowSearch(false)
    }
  }

  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Shop', path: '/products', icon: <FaShoppingBag /> },
    { name: 'New', path: '/new-arrivals', icon: <FaStar /> },
    { name: 'Plans', path: '/subscription-plans', icon: <FaCrown /> },
    { name: 'Auctions', path: '/auctions', icon: <FaGavel /> },
    { name: 'Stores', path: '/locations', icon: <FaMapMarkedAlt /> },
    { name: 'Deals', path: '/deals', icon: <FaFire /> },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${scrolled
        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100'
        : 'bg-white'
        } dark:bg-dark-950 dark:border-dark-800`}
    >
      {/* Top Bar - Sleek Dark */}
      <div className="bg-dark-950 text-white text-xs py-2.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-gray-300">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-primary-400 font-bold">Premium:</span> Free shipping on orders over ₹999
          </motion.p>
          <div className="hidden md:flex items-center space-x-6 font-medium">
            <a href="tel:+917218603915" className="hover:text-white transition-colors">Support</a>
            <Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Text Based, Minimal */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-dark-900 text-white rounded flex items-center justify-center font-bold text-xl font-display">N</div>
            <span className="text-2xl font-bold font-display tracking-tight text-dark-900 dark:text-white">NEXORA</span>
          </Link>

          {/* Desktop Navigation - Clean */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-dark-900 dark:hover:text-white transition-colors group flex items-center gap-2"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions - Icons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
            >
              <FaSearch size={18} />
            </button>

            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
            >
              {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            <Link to="/wishlist" className="relative p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
              <FaHeart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-950"></span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
              <FaShoppingCart size={18} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Profile Menu */}
            <div className="hidden md:ml-4 md:flex items-center gap-3 pl-4 border-l border-gray-200">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard" className="text-sm font-semibold text-dark-900 hover:text-primary-600 hidden lg:block">
                    {user?.firstName}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    title="Logout"
                  >
                    <FaSignOutAlt size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-dark-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-600 transition-colors shadow-sm">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 ml-2 text-dark-900"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-white dark:bg-dark-950 border-t border-gray-100 dark:border-dark-800"
            >
              <form onSubmit={handleSearch} className="py-4 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all font-sans"
                  autoFocus
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 dark:border-dark-800 overflow-hidden bg-white dark:bg-dark-950"
            >
              <nav className="flex flex-col py-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg mx-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-gray-400">{link.icon}</span>
                    <span className="font-medium text-dark-900">{link.name}</span>
                  </Link>
                ))}

                <div className="border-t border-gray-100 mt-4 pt-4 px-6 flex flex-col gap-3">
                  {!isAuthenticated ? (
                    <>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-3 border border-gray-200 rounded-lg font-semibold">Log In</Link>
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-3 bg-dark-900 text-white rounded-lg font-semibold">Sign Up</Link>
                    </>
                  ) : (
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-medium">
                      <FaSignOutAlt /> Logout
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default ModernHeader
