import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const SubscriptionCancel = () => {
  return (
    <>
      <Helmet><title>Subscription Cancelled - NEXORA</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Cancelled</h2>
          <p className="text-gray-600 mb-8">Your subscription process was cancelled. No charges were made.</p>
          <div className="space-y-4">
            <Link to="/subscription-plans" className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              View Plans Again
            </Link>
            <Link to="/" className="block text-blue-600 hover:text-blue-700">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default SubscriptionCancel