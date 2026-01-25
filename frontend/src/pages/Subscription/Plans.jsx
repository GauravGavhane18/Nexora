import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FiCheck, FiX } from 'react-icons/fi'

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { name: 'Browse all products', included: true },
        { name: 'Basic search', included: true },
        { name: 'Wishlist (up to 10 items)', included: true },
        { name: 'Standard support', included: true },
        { name: 'Premium products access', included: false },
        { name: 'Priority shipping', included: false },
        { name: 'Exclusive deals', included: false },
        { name: 'Early access to sales', included: false },
      ],
      buttonText: 'Get Started',
      buttonStyle: 'secondary',
      popular: false
    },
    {
      name: 'Pro',
      description: 'Best for regular shoppers',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        { name: 'Browse all products', included: true },
        { name: 'Advanced search & filters', included: true },
        { name: 'Unlimited wishlist', included: true },
        { name: 'Priority support', included: true },
        { name: 'Premium products access', included: true },
        { name: 'Priority shipping', included: true },
        { name: 'Exclusive deals', included: false },
        { name: 'Early access to sales', included: false },
      ],
      buttonText: 'Subscribe Now',
      buttonStyle: 'primary',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For power users & businesses',
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      features: [
        { name: 'Browse all products', included: true },
        { name: 'Advanced search & filters', included: true },
        { name: 'Unlimited wishlist', included: true },
        { name: '24/7 dedicated support', included: true },
        { name: 'Premium products access', included: true },
        { name: 'Free express shipping', included: true },
        { name: 'Exclusive deals', included: true },
        { name: 'Early access to sales', included: true },
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'secondary',
      popular: false
    }
  ]

  return (
    <>
      <Helmet>
        <title>Subscription Plans - NEXORA</title>
        <meta name="description" content="Choose the perfect subscription plan for your needs" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Unlock premium features and exclusive access with our subscription plans
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly <span className="text-green-600">(Save 17%)</span>
              </span>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
                  }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-gray-600">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (plan.monthlyPrice === 0) {
                        navigate('/register');
                      } else {
                        navigate('/checkout', {
                          state: {
                            subscription: {
                              name: plan.name,
                              price: billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice,
                              billingCycle,
                              description: plan.description
                            }
                          }
                        });
                      }
                    }}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${plan.buttonStyle === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                  >
                    {plan.buttonText}
                  </button>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        {feature.included ? (
                          <FiCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                          <FiX className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 mb-8">
              Have questions? We're here to help.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">Yes, you can cancel your subscription at any time. No questions asked.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">Yes! Start with our Free plan and upgrade when you're ready.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-gray-900 mb-2">Can I switch plans?</h3>
                <p className="text-gray-600">Absolutely! You can upgrade or downgrade your plan at any time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SubscriptionPlans