import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const helpCategories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'orders', name: 'Orders & Shipping', icon: '📦' },
    { id: 'payments', name: 'Payments & Billing', icon: '💳' },
    { id: 'returns', name: 'Returns & Refunds', icon: '↩️' },
    { id: 'account', name: 'Account & Profile', icon: '👤' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' },
  ]

  const helpArticles = [
    {
      id: 1,
      title: 'How to track your order',
      category: 'orders',
      content: 'Learn how to track your order status and delivery updates.',
      link: '/track-order'
    },
    {
      id: 2,
      title: 'Shipping options and delivery times',
      category: 'orders',
      content: 'Information about our shipping methods and estimated delivery times.'
    },
    {
      id: 3,
      title: 'Payment methods we accept',
      category: 'payments',
      content: 'Complete list of accepted payment methods and security information.',
      link: '/payments'
    },
    {
      id: 4,
      title: 'How to return or exchange items',
      category: 'returns',
      content: 'Step-by-step guide for returning or exchanging your purchases.'
    },
    {
      id: 5,
      title: 'Managing your account settings',
      category: 'account',
      content: 'How to update your profile, password, and preferences.'
    },
    {
      id: 6,
      title: 'Troubleshooting website issues',
      category: 'technical',
      content: 'Solutions for common website and app problems.'
    },
    {
      id: 7,
      title: 'NEXORA subscription benefits',
      category: 'account',
      content: 'Learn about subscription plans and exclusive member benefits.',
      link: '/subscription-plans'
    },
    {
      id: 8,
      title: 'International shipping information',
      category: 'orders',
      content: 'Details about shipping to international destinations.'
    },
    {
      id: 9,
      title: 'Refund processing times',
      category: 'returns',
      content: 'How long it takes to process refunds and when to expect them.'
    }
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Helmet>
        <title>Help Center - NEXORA</title>
        <meta name="description" content="Get help and support for your NEXORA experience" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">Find answers to your questions</p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles..."
                className="w-full px-6 py-4 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
                <div className="space-y-2">
                  {helpCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="mr-3 text-lg">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-blue-600 rounded-xl p-6 text-white mt-6">
                <h3 className="text-lg font-semibold mb-3">Need More Help?</h3>
                <p className="text-sm mb-4">Can't find what you're looking for? Our support team is here to help!</p>
                <Link to="/contact" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block">
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Help Articles */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {article.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-600 dark:text-blue-400 capitalize">
                            {helpCategories.find(cat => cat.id === article.category)?.name}
                          </span>
                          {article.link ? (
                            <Link
                              to={article.link}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                            >
                              Learn More →
                            </Link>
                          ) : (
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                              Read Article →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or browse different categories.</p>
                </div>
              )}
            </div>
          </div>

          {/* Popular Topics */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Popular Topics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/track-order" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Track Your Order</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Get real-time updates on your shipment</p>
              </Link>
              
              <Link to="/payments" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Methods</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Manage your payment options</p>
              </Link>
              
              <Link to="/contact" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Support</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Get help from our support team</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Help