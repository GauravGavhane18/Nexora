import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import {
  FiDollarSign,
  FiShoppingBag,
  FiPackage,
  FiTrendingUp,
  FiEye,
  FiPlus,
  FiAlertTriangle,
  FiArrowRight
} from 'react-icons/fi'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import api from '../../services/api'

const SellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)

  // Mock data for the chart - in a real app, this would come from the API
  const chartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ]

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
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white h-32 rounded-lg shadow-sm"></div>
            ))}
          </div>
          <div className="h-96 bg-white rounded-lg shadow-sm"></div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${dashboardData?.stats?.revenue?.toLocaleString() || '0'}`,
      change: '+12.5% from last month',
      icon: FiDollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: 'up'
    },
    {
      label: 'Orders',
      value: dashboardData?.stats?.totalOrders || '0',
      change: `${dashboardData?.stats?.pendingOrders || 0} pending processing`,
      icon: FiShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'neutral'
    },
    {
      label: 'Active Products',
      value: dashboardData?.stats?.activeProducts || '0',
      change: `${dashboardData?.stats?.totalProducts || 0} total listings`,
      icon: FiPackage,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      trend: 'up'
    },
    {
      label: 'Platform Fees',
      value: `$${dashboardData?.stats?.commission?.toLocaleString() || '0'}`,
      change: 'Current billing cycle',
      icon: FiTrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      trend: 'neutral'
    }
  ]

  return (
    <>
      <Helmet><title>Seller Dashboard - NEXORA</title></Helmet>

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store's performance</p>
      </div>

      {/* Account Status Alert */}
      {!user?.sellerProfile?.isApproved && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Account Under Review</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Your seller account is currently pending approval. You can manage your inventory, but your products won't be visible to customers until approved.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const IconComponent = stat.icon
          return (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {stat.trend === 'up' ? '↗' : '−'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
              <p className="text-xs text-gray-400">{stat.change}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
            <select className="text-sm border-gray-200 rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/seller/products/new"
              className="group flex items-center p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FiPlus className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Add New Product</h3>
                <p className="text-sm text-gray-500">Create a listing</p>
              </div>
              <FiArrowRight className="ml-auto text-gray-300 group-hover:text-blue-500" />
            </Link>

            <Link
              to="/seller/products"
              className="group flex items-center p-4 rounded-xl border border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
            >
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FiPackage className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Manage Inventory</h3>
                <p className="text-sm text-gray-500">Update stocks & prices</p>
              </div>
              <FiArrowRight className="ml-auto text-gray-300 group-hover:text-indigo-500" />
            </Link>

            <Link
              to="/seller/analytics"
              className="group flex items-center p-4 rounded-xl border border-gray-100 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
            >
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FiTrendingUp className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">View Reports</h3>
                <p className="text-sm text-gray-500">Check earnings</p>
              </div>
              <FiArrowRight className="ml-auto text-gray-300 group-hover:text-purple-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link to="/seller/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
            View all orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboardData?.recentOrders?.length > 0 ? (
                dashboardData.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">#{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {order.items?.length} items including {order.items?.[0]?.product?.name || 'Product'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      ${order.pricing?.total?.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <FiShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No orders found</p>
                    <p className="text-sm">When you receive orders, they will appear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default SellerDashboard