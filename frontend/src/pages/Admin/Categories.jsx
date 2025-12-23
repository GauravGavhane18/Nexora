import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const AdminCategories = () => {
  const [categories] = useState([
    { id: 1, name: 'Electronics', products: 45, status: 'Active' },
    { id: 2, name: 'Wearables', products: 23, status: 'Active' },
    { id: 3, name: 'Photography', products: 18, status: 'Active' },
    { id: 4, name: 'Furniture', products: 32, status: 'Active' },
    { id: 5, name: 'Gaming', products: 56, status: 'Active' },
    { id: 6, name: 'Audio', products: 29, status: 'Active' }
  ])

  return (
    <>
      <Helmet><title>Category Management - NEXORA Admin</title></Helmet>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Category</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
                <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">{cat.status}</span>
              </div>
              <p className="text-gray-600 mb-4">{cat.products} products</p>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default AdminCategories