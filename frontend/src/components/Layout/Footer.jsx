import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { identifyUser } from '../../services/omnisend'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaCreditCard, FaLock, FaTruck, FaUndo } from 'react-icons/fa'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      identifyUser(email, { source: 'footer_newsletter' });
      toast.success('Thanks for subscribing!')
      setEmail('')
    }
  }

  return (
    <footer className="bg-dark-950 text-white font-sans border-t border-dark-900">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-white text-dark-950 rounded-lg flex items-center justify-center font-bold text-xl font-display">
                N
              </div>
              <span className="ml-3 text-2xl font-bold font-display tracking-tight">NEXORA</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              Elevating your shopping experience with premium products, secure transactions, and world-class support.
            </p>
            <div className="text-gray-400 space-y-3 mb-8 text-sm">
              <p className="flex items-center gap-2"><span className="opacity-70">📍</span> Pune, Maharashtra 411001</p>
              <p className="flex items-center gap-2"><span className="opacity-70">📞</span> +91 7218603915</p>
              <p className="flex items-center gap-2"><span className="opacity-70">✉️</span> gavhanegs18@gmail.com</p>
            </div>
            <div className="flex space-x-4">
              {[
                { icon: <FaFacebookF />, href: "#", color: "hover:bg-[#1877F2]" },
                { icon: <FaTwitter />, href: "#", color: "hover:bg-[#1DA1F2]" },
                { icon: <FaInstagram />, href: "#", color: "hover:bg-[#E4405F]" },
                { icon: <FaLinkedinIn />, href: "#", color: "hover:bg-[#0A66C2]" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className={`w-10 h-10 bg-dark-900 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold font-display mb-6">Explore</h3>
            <ul className="space-y-4 text-gray-400">
              {['Home', 'Products', 'Categories', 'Deals', 'New Arrivals', 'Subscription Plans'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-primary-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold font-display mb-6">Support</h3>
            <ul className="space-y-4 text-gray-400">
              {[
                { label: 'Contact Us', path: '/contact' },
                { label: 'About Us', path: '/about' },
                { label: 'Find a Store', path: '/locations' },
                { label: 'FAQ', path: '/faq' },
                { label: 'Shipping Info', path: '/shipping-info' },
                { label: 'Returns', path: '/returns' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="hover:text-primary-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold font-display mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm">Subscribe to get 10% off your first seamless order.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 bg-dark-900 border border-dark-800 rounded-lg focus:outline-none focus:border-primary-500 text-white transition-colors"
                required
              />
              <button type="submit" className="w-full bg-white text-dark-950 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Trust & Copyright */}
      <div className="border-t border-dark-900 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 divide-x divide-dark-800 text-sm text-gray-400">
              <span className="flex items-center gap-2"><FaLock size={12} /> Secure Payment</span>
              <span className="flex items-center gap-2 pl-6"><FaTruck size={12} /> Fast Delivery</span>
              <span className="flex items-center gap-2 pl-6"><FaUndo size={12} /> Easy Returns</span>
            </div>
            <div className="flex gap-3">
              {['UPI', 'Visa', 'Mastercard'].map((pay) => (
                <span key={pay} className="bg-dark-900 px-3 py-1 rounded text-xs text-gray-400 font-mono border border-dark-800">{pay}</span>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-dark-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2025 NEXORA. Designed & Built in India 🇮🇳</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
