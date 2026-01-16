import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiPackage, 
  FiStar, 
  FiTrendingUp, 
  FiTrendingDown,
  FiEye,
  FiPlus,
  FiAlertTriangle
} from 'react-icons/fi'
import api from '../../services/api'

const SellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/seller/dashboard')
      setDashboardData(response.data.data)
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    { 
      label: 'Revenue (30 days)', 
      value: `$${dashboardData?.stats?.revenue?.toLocaleString() || '0'}`, 
      change: '+15%',
      icon: FiDollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Total Orders', 
      value: dashboardData?.stats?.totalOrders || '0', 
      change: `${dashboardData?.stats?.pendingOrders || 0} pending`,
      icon: FiShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Products', 
      value: dashboardData?.stats?.totalProducts || '0', 
      change: `${dashboardData?.stats?.activeProducts || 0} active`,
      icon: FiPackage,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'Commission', 
      value: `$${dashboardData?.stats?.commission?.toLocaleString() || '0'}`, 
      change: 'Platform fee',
      icon: FiTrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <>
      <Helmet><title>Seller Dashboard - NEXORA</title></Helmet>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your store today.
            </p>
          </div>
          
          {!user?.sellerProfile?.isApproved && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center">
                <FiAlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Account Pending Approval
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Your seller account is under review. You can still manage products but cannot sell until approved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const IconComponent = stat.icon
            return (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link 
                to="/seller/orders" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View all <FiEye className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {dashboardData?.recentOrders?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.user?.firstName} {order.user?.lastName} • {order.items?.length} items
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-gray-900">
                        ${order.pricing?.total?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
                <p className="text-sm text-gray-400">Orders will appear here once customers start buying</p>
              </div>
            )}
          </div>

          {/* Quick Actions & Low Stock */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  to="/seller/products/new" 
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg mr-3 group-hover:bg-blue-100">
                    <FiPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Add Product</p>
                    <p className="text-sm text-gray-600">Create a new product listing</p>
                  </div>
                </Link>
                
                <Link 
                  to="/seller/products" 
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="bg-green-50 text-green-600 p-2 rounded-lg mr-3 group-hover:bg-green-100">
                    <FiPackage className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Products</p>
                    <p className="text-sm text-gray-600">Edit your product listings</p>
                  </div>
                </Link>
                
                <Link 
                  to="/seller/analytics" 
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="bg-purple-50 text-purple-600 p-2 rounded-lg mr-3 group-hover:bg-purple-100">
                    <FiTrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">View Analytics</p>
                    <p className="text-sm text-gray-600">Track your performance</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Low Stock Alert */}
            {dashboardData?.lowStockProducts?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <FiAlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
                </div>
                <div className="space-y-3">
                  {dashboardData.lowStockProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-600">
                          {product.variants?.[0]?.name || 'Default variant'}
                        </p>
                      </div>
                      <span className="text-orange-600 font-semibold text-sm">
                        {product.variants?.[0]?.inventory?.quantity || 0} left
                      </span>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/seller/products?filter=low-stock" 
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-3 inline-block"
                >
                  Manage inventory →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SellerDashboard