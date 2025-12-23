import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const SubscriptionSuccess = () => {
  return (
    <>
      <Helmet><title>Subscription Successful - NEXORA</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Pro!</h2>
          <p className="text-gray-600 mb-8">Your subscription has been activated successfully. Enjoy all the premium features!</p>
          <div className="space-y-4">
            <Link to="/products" className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Start Shopping
            </Link>
            <Link to="/dashboard" className="block text-blue-600 hover:text-blue-700">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default SubscriptionSuccess