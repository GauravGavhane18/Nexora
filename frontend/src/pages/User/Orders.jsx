import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock,
  FiEye,
  FiDownload,
  FiSearch,
  FiFilter
} from 'react-icons/fi'

const UserOrders = () => {
  const { user } = useSelector((state) => state.auth)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  // Mock orders data
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-001',
        orderNumber: '#NEXORA-001',
        date: '2024-01-15',
        status: 'delivered',
        total: 89.99,
        items: [
          { name: 'Wireless Headphones', quantity: 1, price: 79.99, image: '/api/placeholder/60/60' },
          { name: 'Phone Case', quantity: 1, price: 10.00, image: '/api/placeholder/60/60' }
        ],
        shippingAddress: '123 Main St, City, State 12345',
        trackingNumber: 'TRK123456789'
      },
      {
        id: 'ORD-002',
        orderNumber: '#NEXORA-002',
        date: '2024-01-10',
        status: 'shipped',
        total: 156.50,
        items: [
          { name: 'Laptop Stand', quantity: 1, price: 45.00, image: '/api/placeholder/60/60' },
          { name: 'Wireless Mouse', quantity: 2, price: 55.75, image: '/api/placeholder/60/60' }
        ],
        shippingAddress: '123 Main St, City, State 12345',
        trackingNumber: 'TRK987654321'
      },
      {
        id: 'ORD-003',
        orderNumber: '#NEXORA-003',
        date: '2024-01-05',
        status: 'processing',
        total: 45.00,
        items: [
          { name: 'USB Cable', quantity: 3, price: 15.00, image: '/api/placeholder/60/60' }
        ],
        shippingAddress: '123 Main St, City, State 12345',
        trackingNumber: null
      },
      {
        id: 'ORD-004',
        orderNumber: '#NEXORA-004',
        date: '2023-12-28',
        status: 'cancelled',
        total: 199.99,
        items: [
          { name: 'Bluetooth Speaker', quantity: 1, price: 199.99, image: '/api/placeholder/60/60' }
        ],
        shippingAddress: '123 Main St, City, State 12345',
        trackingNumber: null
      }
    ]
    
    setTimeout(() => {
      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />
      case 'shipped':
        return <FiTruck className="w-5 h-5 text-blue-500" />
      case 'processing':
        return <FiClock className="w-5 h-5 text-yellow-500" />
      case 'cancelled':
        return <FiPackage className="w-5 h-5 text-red-500" />
      default:
        return <FiClock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'shipped':
        return 'text-blue-600 bg-blue-100'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>My Orders - NEXORA</title>
        <meta name="description" content="View and track your orders" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-2 text-gray-600">
              Track and manage your order history
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <div className="relative">
                  <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-select pl-10"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : "You haven't placed any orders yet"
                  }
                </p>
                <Link
                  to="/products"
                  className="btn btn-primary"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                          <p className="text-sm text-gray-500">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center space-x-3">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ${(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-gray-600">
                        {order.trackingNumber && (
                          <p>Tracking: <span className="font-medium">{order.trackingNumber}</span></p>
                        )}
                        <p>Ship to: {order.shippingAddress}</p>
                      </div>
                      <div className="mt-3 sm:mt-0 flex space-x-3">
                        <button className="btn btn-secondary btn-sm">
                          <FiEye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        {order.status === 'delivered' && (
                          <button className="btn btn-secondary btn-sm">
                            <FiDownload className="w-4 h-4 mr-2" />
                            Invoice
                          </button>
                        )}
                        {order.trackingNumber && (
                          <button className="btn btn-primary btn-sm">
                            <FiTruck className="w-4 h-4 mr-2" />
                            Track Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default UserOrders