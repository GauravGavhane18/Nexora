import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'

const UserSubscription = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <>
      <Helmet><title>My Subscription - NEXORA</title></Helmet>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Subscription</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
                <p className="text-gray-600">You are currently on the Free plan</p>
              </div>
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium">Free</span>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Plan Features:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">✓ Browse all products</li>
                <li className="flex items-center">✓ Basic search</li>
                <li className="flex items-center">✓ Wishlist (up to 10 items)</li>
                <li className="flex items-center">✓ Standard support</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-2">Upgrade to Pro</h2>
            <p className="mb-4 opacity-90">Get access to premium products, priority shipping, and exclusive deals!</p>
            <Link to="/subscription-plans" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 inline-block">
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserSubscription