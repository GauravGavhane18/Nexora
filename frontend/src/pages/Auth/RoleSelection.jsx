import { Link } from 'react-router-dom'
import { FiShoppingBag, FiPackage, FiUsers, FiArrowRight } from 'react-icons/fi'
import Logo from '../../components/UI/Logo'

const RoleSelection = () => {
  const roles = [
    {
      type: 'buyer',
      title: 'Customer',
      description: 'Shop for products and services',
      icon: FiShoppingBag,
      color: 'blue',
      features: [
        'Browse thousands of products',
        'Secure checkout and payments',
        'Order tracking and history',
        'Wishlist and favorites',
        'Customer support'
      ],
      loginPath: '/auth/buyer/login',
      registerPath: '/auth/register?type=buyer'
    },
    {
      type: 'seller',
      title: 'Seller',
      description: 'Sell your products and grow your business',
      icon: FiPackage,
      color: 'green',
      features: [
        'List and manage products',
        'Process orders and payments',
        'Analytics and insights',
        'Inventory management',
        'Marketing tools'
      ],
      loginPath: '/auth/seller/login',
      registerPath: '/auth/register?type=seller'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Logo className="mx-auto h-16 w-auto mb-6" />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Welcome to NEXORA
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you'd like to use our platform. You can always switch between roles later.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {roles.map((role) => {
            const IconComponent = role.icon
            const colorClasses = {
              blue: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                icon: 'text-blue-600',
                button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                link: 'text-blue-600 hover:text-blue-500'
              },
              green: {
                bg: 'bg-green-50',
                border: 'border-green-200',
                icon: 'text-green-600',
                button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
                link: 'text-green-600 hover:text-green-500'
              }
            }[role.color]

            return (
              <div
                key={role.type}
                className={`${colorClasses.bg} ${colorClasses.border} border-2 rounded-xl p-8 hover:shadow-lg transition-all duration-200`}
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${colorClasses.icon} bg-white rounded-full shadow-md mb-4`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {role.title}
                  </h2>
                  <p className="text-gray-600">
                    {role.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    What you can do:
                  </h3>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <div className={`w-1.5 h-1.5 ${colorClasses.icon} rounded-full mr-3 flex-shrink-0`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <Link
                    to={role.registerPath}
                    className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white ${colorClasses.button} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
                  >
                    Get Started as {role.title}
                    <FiArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  
                  <div className="text-center">
                    <span className="text-sm text-gray-500">Already have an account? </span>
                    <Link
                      to={role.loginPath}
                      className={`text-sm font-medium ${colorClasses.link}`}
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <FiUsers className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              Join over <span className="font-semibold text-gray-900">10,000+</span> users already on NEXORA
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection