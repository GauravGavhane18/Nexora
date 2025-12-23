import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const Payments = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })

  const [paypalEmail, setPaypalEmail] = useState('')
  const [cryptoWallet, setCryptoWallet] = useState('')

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, American Express' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Pay with your PayPal account' },
    { id: 'apple', name: 'Apple Pay', icon: '🍎', description: 'Quick and secure payment' },
    { id: 'google', name: 'Google Pay', icon: '🔍', description: 'Pay with Google' },
    { id: 'crypto', name: 'Cryptocurrency', icon: '₿', description: 'Bitcoin, Ethereum, USDT' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', description: 'Direct bank transfer' },
  ]

  const handleCardSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success('Payment method added successfully!')
      setCardData({ number: '', expiry: '', cvv: '', name: '' })
      setLoading(false)
    }, 2000)
  }

  const handlePayPalConnect = () => {
    setLoading(true)
    setTimeout(() => {
      toast.success('PayPal account connected!')
      setPaypalEmail('')
      setLoading(false)
    }, 1500)
  }

  const handleCryptoConnect = () => {
    setLoading(true)
    setTimeout(() => {
      toast.success('Crypto wallet connected!')
      setCryptoWallet('')
      setLoading(false)
    }, 1500)
  }

  const handleQuickPay = (method) => {
    setLoading(true)
    setTimeout(() => {
      toast.success(`${method} payment initiated!`)
      setLoading(false)
    }, 1000)
  }

  return (
    <>
      <Helmet>
        <title>Payment Methods - NEXORA</title>
        <meta name="description" content="Manage your payment methods and make secure payments" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Methods</h1>
            <p className="text-xl text-gray-600">Choose your preferred payment method</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Available Methods</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{method.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-green-50 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">🔒 Secure Payments</h3>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>• 256-bit SSL encryption</li>
                  <li>• PCI DSS compliant</li>
                  <li>• Fraud protection</li>
                  <li>• 24/7 monitoring</li>
                </ul>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-8">
                {selectedMethod === 'card' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Add Credit/Debit Card</h2>
                    <form onSubmit={handleCardSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) => setCardData({...cardData, number: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardData.name}
                          onChange={(e) => setCardData({...cardData, name: e.target.value})}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Adding Card...' : 'Add Card'}
                      </button>
                    </form>
                  </div>
                )}

                {selectedMethod === 'paypal' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">🅿️ Connect PayPal</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PayPal Email</label>
                        <input
                          type="email"
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={handlePayPalConnect}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Connecting...' : 'Connect PayPal'}
                      </button>
                    </div>
                  </div>
                )}

                {selectedMethod === 'apple' && (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">🍎</span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Apple Pay</h2>
                    <p className="text-gray-600 mb-6">Use Touch ID or Face ID for quick and secure payments</p>
                    <button
                      onClick={() => handleQuickPay('Apple Pay')}
                      disabled={loading}
                      className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Set up Apple Pay'}
                    </button>
                  </div>
                )}

                {selectedMethod === 'google' && (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">🔍</span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Google Pay</h2>
                    <p className="text-gray-600 mb-6">Pay quickly and securely with Google Pay</p>
                    <button
                      onClick={() => handleQuickPay('Google Pay')}
                      disabled={loading}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Set up Google Pay'}
                    </button>
                  </div>
                )}

                {selectedMethod === 'crypto' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">₿ Cryptocurrency</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <span className="text-2xl block mb-2">₿</span>
                          <p className="text-sm font-medium">Bitcoin</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <span className="text-2xl block mb-2">Ξ</span>
                          <p className="text-sm font-medium">Ethereum</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <span className="text-2xl block mb-2">₮</span>
                          <p className="text-sm font-medium">USDT</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                        <input
                          type="text"
                          value={cryptoWallet}
                          onChange={(e) => setCryptoWallet(e.target.value)}
                          placeholder="Enter your wallet address"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={handleCryptoConnect}
                        disabled={loading}
                        className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Connecting...' : 'Connect Wallet'}
                      </button>
                    </div>
                  </div>
                )}

                {selectedMethod === 'bank' && (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">🏦</span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Bank Transfer</h2>
                    <p className="text-gray-600 mb-6">Direct transfer from your bank account</p>
                    <div className="bg-gray-50 rounded-lg p-6 text-left">
                      <h3 className="font-semibold mb-3">Bank Details:</h3>
                      <p className="text-sm text-gray-600 mb-1">Account Name: NEXORA Inc.</p>
                      <p className="text-sm text-gray-600 mb-1">Account Number: 1234567890</p>
                      <p className="text-sm text-gray-600 mb-1">Routing Number: 021000021</p>
                      <p className="text-sm text-gray-600">SWIFT Code: CHASUS33</p>
                    </div>
                    <button
                      onClick={() => handleQuickPay('Bank Transfer')}
                      disabled={loading}
                      className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Initiate Transfer'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment History */}
          {isAuthenticated && (
            <div className="mt-12">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Date</th>
                        <th className="text-left py-3">Description</th>
                        <th className="text-left py-3">Method</th>
                        <th className="text-left py-3">Amount</th>
                        <th className="text-left py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">Dec 23, 2024</td>
                        <td className="py-3">Premium Wireless Headphones</td>
                        <td className="py-3">💳 **** 1234</td>
                        <td className="py-3">$299.99</td>
                        <td className="py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Completed</span></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Dec 22, 2024</td>
                        <td className="py-3">Smart Fitness Watch</td>
                        <td className="py-3">🅿️ PayPal</td>
                        <td className="py-3">$199.99</td>
                        <td className="py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Completed</span></td>
                      </tr>
                      <tr>
                        <td className="py-3">Dec 21, 2024</td>
                        <td className="py-3">Gaming Keyboard</td>
                        <td className="py-3">🍎 Apple Pay</td>
                        <td className="py-3">$159.99</td>
                        <td className="py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Pending</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Accepted Payment Methods */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-6">We Accept</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">💳</span>
                  </div>
                  <p className="font-semibold">Visa</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">💳</span>
                  </div>
                  <p className="font-semibold">Mastercard</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">🅿️</span>
                  </div>
                  <p className="font-semibold">PayPal</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">💳</span>
                  </div>
                  <p className="font-semibold">Stripe</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-lg mb-4">🔒 All payments are secured with 256-bit SSL encryption</p>
                <div className="flex justify-center space-x-6 text-sm">
                  <span>✓ PCI DSS Compliant</span>
                  <span>✓ Fraud Protection</span>
                  <span>✓ 24/7 Monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Payments