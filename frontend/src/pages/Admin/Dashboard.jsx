import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const { data } = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(data.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = dashboardData ? [
    { 
      label: 'Total Users', 
      value: dashboardData.stats.users.total, 
      subtext: `${dashboardData.stats.users.sellers} sellers`,
      color: 'blue',
      icon: '👥'
    },
    { 
      label: 'Total Orders', 
      value: dashboardData.stats.orders.total, 
      subtext: `${dashboardData.stats.orders.pending} pending`,
      color: 'green',
      icon: '🛒'
    },
    { 
      label: 'Revenue', 
      value: `$${dashboardData.stats.revenue.total.toFixed(2)}`, 
      subtext: `$${dashboardData.stats.revenue.commission.toFixed(2)} commission`,
      color: 'purple',
      icon: '💰'
    },
    { 
      label: 'Products', 
      value: dashboardData.stats.products.total, 
      subtext: `${dashboardData.stats.products.pending} pending`,
      color: 'orange',
      icon: '📦'
    }
  ] : [];

  return (
    <>
      <Helmet><title>Admin Dashboard - NEXORA</title></Helmet>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {dashboardData?.recentActivities.orders.map(order => (
                <div key={order._id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.pricing.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/orders" className="text-blue-600 text-sm mt-4 inline-block hover:underline">
              View all orders →
            </Link>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
            <div className="space-y-3">
              {dashboardData?.recentActivities.users.map(user => (
                <div key={user._id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/admin/users" className="text-blue-600 text-sm mt-4 inline-block hover:underline">
              View all users →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              to="/admin/products" 
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center transition-all"
            >
              <span className="text-3xl block mb-2">📦</span>
              <p className="font-medium text-gray-900">Manage Products</p>
              <p className="text-xs text-gray-500 mt-1">Add, edit, delete</p>
            </Link>
            <Link 
              to="/admin/users" 
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center transition-all"
            >
              <span className="text-3xl block mb-2">👥</span>
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-xs text-gray-500 mt-1">View all users</p>
            </Link>
            <Link 
              to="/admin/orders" 
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center transition-all"
            >
              <span className="text-3xl block mb-2">🛒</span>
              <p className="font-medium text-gray-900">Manage Orders</p>
              <p className="text-xs text-gray-500 mt-1">Update status</p>
            </Link>
            <Link 
              to="/admin/analytics" 
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center transition-all"
            >
              <span className="text-3xl block mb-2">📊</span>
              <p className="font-medium text-gray-900">Analytics</p>
              <p className="text-xs text-gray-500 mt-1">View reports</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
