import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const TrackOrder = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTrackOrder = (e) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockOrderData = {
        orderNumber: trackingNumber,
        status: 'In Transit',
        estimatedDelivery: 'Dec 25, 2024',
        trackingSteps: [
          { status: 'Order Placed', date: 'Dec 20, 2024 10:30 AM', completed: true, description: 'Your order has been confirmed' },
          { status: 'Processing', date: 'Dec 20, 2024 2:15 PM', completed: true, description: 'Order is being prepared for shipment' },
          { status: 'Shipped', date: 'Dec 21, 2024 9:00 AM', completed: true, description: 'Package has left our facility' },
          { status: 'In Transit', date: 'Dec 22, 2024 11:45 AM', completed: true, description: 'Package is on the way to destination' },
          { status: 'Out for Delivery', date: 'Dec 25, 2024', completed: false, description: 'Package will be delivered today' },
          { status: 'Delivered', date: '', completed: false, description: 'Package has been delivered' }
        ],
        items: [
          { name: 'iPhone 15 Pro Max', quantity: 1, price: 1199.99 },
          { name: 'Wireless Charging Pad', quantity: 1, price: 39.99 }
        ],
        shippingAddress: '123 Main St, New York, NY 10001',
        carrier: 'FedEx',
        trackingUrl: 'https://fedex.com/track'
      }
      setOrderData(mockOrderData)
      setLoading(false)
    }, 1500)
  }

  return (
    <>
      <Helmet>
        <title>Track Your Order - NEXORA</title>
        <meta name="description" content="Track your NEXORA order status and delivery updates" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Track Your Order</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">Enter your order number to get real-time updates</p>
          </div>

          {/* Tracking Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
            <form onSubmit={handleTrackOrder} className="max-w-md mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Number / Tracking ID
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter your order number (e.g., NEX123456789)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </form>
          </div>

          {/* Order Details */}
          {orderData && (
            <div className="space-y-8">
              {/* Order Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Order #{orderData.orderNumber}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Status: <span className="font-semibold text-blue-600 dark:text-blue-400">{orderData.status}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Delivery</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{orderData.estimatedDelivery}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping Address</h3>
                    <p className="text-gray-600 dark:text-gray-400">{orderData.shippingAddress}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Carrier</h3>
                    <p className="text-gray-600 dark:text-gray-400">{orderData.carrier}</p>
                    <a href={orderData.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                      Track on {orderData.carrier} website →
                    </a>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Tracking Timeline</h2>
                <div className="space-y-6">
                  {orderData.trackingSteps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        {step.completed ? (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`font-semibold ${
                              step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {step.status}
                            </h3>
                            <p className={`text-sm ${
                              step.completed ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {step.description}
                            </p>
                          </div>
                          {step.date && (
                            <span className={`text-sm ${
                              step.completed ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {step.date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Items</h2>
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">${item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${orderData.items.reduce((total, item) => total + item.price, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need Help?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Can't find your order or having issues with tracking? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@nexora.com" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Email Support
              </a>
              <a href="tel:1-800-NEXORA" className="border border-blue-600 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors">
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TrackOrder