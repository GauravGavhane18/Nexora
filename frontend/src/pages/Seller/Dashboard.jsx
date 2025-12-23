import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const SellerDashboard = () => {
  const stats = [
    { label: 'Total Sales', value: '$12,456', change: '+15%' },
    { label: 'Orders', value: '156', change: '+8%' },
    { label: 'Products', value: '24', change: '+2' },
    { label: 'Rating', value: '4.8', change: '+0.2' }
  ]

  return (
    <>
      <Helmet><title>Seller Dashboard - NEXORA</title></Helmet>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Seller Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-green-600">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Order #00{i}</p>
                    <p className="text-sm text-gray-600">2 items</p>
                  </div>
                  <span className="text-blue-600">$89.99</span>
                </div>
              ))}
            </div>
            <Link to="/seller/orders" className="text-blue-600 text-sm mt-4 inline-block">View all →</Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/seller/products" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                <span className="text-2xl">📦</span>
                <p className="mt-2 font-medium">My Products</p>
              </Link>
              <Link to="/seller/orders" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                <span className="text-2xl">🛒</span>
                <p className="mt-2 font-medium">Orders</p>
              </Link>
              <Link to="/seller/analytics" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                <span className="text-2xl">📊</span>
                <p className="mt-2 font-medium">Analytics</p>
              </Link>
              <Link to="/seller/profile" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                <span className="text-2xl">⚙️</span>
                <p className="mt-2 font-medium">Settings</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SellerDashboard