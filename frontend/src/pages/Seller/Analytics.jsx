import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import api from '../../services/api'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts'

const SellerAnalytics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/seller/analytics?period=${period}`)
      setData(response.data.data)
    } catch (error) {
      console.error('Fetch analytics error:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="spinner h-8 w-8 text-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Analytics - NEXORA Seller</title></Helmet>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${data?.salesData?.reduce((acc, curr) => acc + curr.sales, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">
              {data?.salesData?.reduce((acc, curr) => acc + curr.orders, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600">Items Sold</p>
            <p className="text-2xl font-bold text-gray-900">
              {data?.salesData?.reduce((acc, curr) => acc + curr.quantity, 0)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-6">Revenue Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#4F46E5"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    name="Revenue ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-6">Top Selling Products</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {data?.topProducts?.map((product, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.totalQuantity} sold</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${product.totalSales.toLocaleString()}
                  </span>
                </div>
              ))}
              {(!data?.topProducts || data.topProducts.length === 0) && (
                <p className="text-center text-gray-500 py-4">No sales data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SellerAnalytics