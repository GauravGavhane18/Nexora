import { Helmet } from 'react-helmet-async'

const SellerAnalytics = () => {
  return (
    <>
      <Helmet><title>Analytics - NEXORA Seller</title></Helmet>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sales Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">$12,456</p>
            <p className="text-sm text-green-600">+15% from last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-sm text-green-600">+8% from last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-900">$79.85</p>
            <p className="text-sm text-green-600">+5% from last month</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {[
              { name: 'Premium Wireless Headphones', sales: 128, revenue: '$38,399' },
              { name: 'Smart Fitness Watch', sales: 89, revenue: '$17,799' },
              { name: 'Portable Bluetooth Speaker', sales: 234, revenue: '$18,717' }
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b">
                <span className="font-medium">{product.name}</span>
                <div className="text-right">
                  <p className="font-medium">{product.revenue}</p>
                  <p className="text-sm text-gray-500">{product.sales} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SellerAnalytics