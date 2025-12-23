import { Helmet } from 'react-helmet-async'

const AdminAnalytics = () => {
  return (
    <>
      <Helmet><title>Analytics - NEXORA Admin</title></Helmet>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">$125,430</p>
            <p className="text-sm text-green-600">+18% from last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">2,456</p>
            <p className="text-sm text-green-600">+12% from last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-900">$51.07</p>
            <p className="text-sm text-green-600">+5% from last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900">3.2%</p>
            <p className="text-sm text-red-600">-0.3% from last month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
            <div className="space-y-4">
              {['Premium Wireless Headphones', 'Smart Fitness Watch', 'Mechanical Gaming Keyboard', 'Noise Cancelling Earbuds'].map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-700">{product}</span>
                  <span className="font-medium">{Math.floor(Math.random() * 100) + 50} sold</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
            <div className="space-y-4">
              {[
                { source: 'Direct', percent: 35 },
                { source: 'Organic Search', percent: 28 },
                { source: 'Social Media', percent: 22 },
                { source: 'Referral', percent: 15 }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.source}</span>
                    <span>{item.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminAnalytics