import { Outlet, Link, useLocation } from 'react-router-dom'
import { FiGrid, FiBox, FiShoppingBag, FiBarChart2, FiLogOut, FiArrowLeft } from 'react-icons/fi'

const SellerLayout = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
  }

  const navItems = [
    { path: '/seller', label: 'Dashboard', icon: FiGrid },
    { path: '/seller/products', label: 'Products', icon: FiBox },
    { path: '/seller/orders', label: 'Orders', icon: FiShoppingBag },
    { path: '/seller/analytics', label: 'Analytics', icon: FiBarChart2 },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">S</span>
            </div>
            <h2 className="text-xl font-bold tracking-wide">Seller Center</h2>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive(item.path)}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 mr-3" />
            <span className="font-medium">Back to Shop</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SellerLayout