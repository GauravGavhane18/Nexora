import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', color: 'blue' },
    { label: 'Total Orders', value: '856', change: '+8%', color: 'green' },
    { label: 'Revenue', value: '$45,678', change: '+15%', color: 'purple' },
    { label: 'Products', value: '324', change: '+5%', color: 'orange' }
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: '$299.99', status: 'Completed' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: '$149.99', status: 'Processing' },
    { id: 'ORD-003', customer: 'Bob Wilson', amount: '$89.99', status: 'Shipped' }
  ]

  return (
    <>
      <Helmet><title>Admin Dashboard - NEXORA</title></Helmet>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-green-600">{stat.change} from last month</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <p className="text-sm text-blue-600">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/orders" className="text-blue-600 text-sm mt-4 inline-block">View all orders →</Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/products" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                <span className="text-2xl">📦</span>
                <p className="mt-2 font-medium">Products</p>
              </Link>
              <Link to="/admin/users" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                <span className="text-2xl">👥</span>
                <p className="mt-2 font-medium">Users</p>
              </Link>
              <Link to="/admin/orders" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                <span className="text-2xl">🛒</span>
                <p className="mt-2 font-medium">Orders</p>
              </Link>
              <Link to="/admin/analytics" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                <span className="text-2xl">📊</span>
                <p className="mt-2 font-medium">Analytics</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard