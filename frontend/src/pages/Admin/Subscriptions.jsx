import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const AdminSubscriptions = () => {
  const [plans] = useState([
    { id: 1, name: 'Free', price: 0, users: 856, features: 4 },
    { id: 2, name: 'Pro', price: 9.99, users: 234, features: 8 },
    { id: 3, name: 'Enterprise', price: 29.99, users: 45, features: 12 }
  ])

  return (
    <>
      <Helmet><title>Subscription Management - NEXORA Admin</title></Helmet>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Plan</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">${plan.price}<span className="text-sm text-gray-500">/mo</span></p>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>{plan.users} active users</p>
                <p>{plan.features} features included</p>
              </div>
              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">Edit Plan</button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">$4,567</p>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">1,135</p>
              <p className="text-sm text-gray-600">Total Subscribers</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">24%</p>
              <p className="text-sm text-gray-600">Conversion Rate</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminSubscriptions