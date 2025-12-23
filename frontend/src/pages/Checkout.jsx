import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { FiCreditCard, FiTruck, FiShield, FiCheck } from 'react-icons/fi'
import { clearCart } from '../redux/slices/cartSlice'

const Checkout = () => {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { items, total, subtotal, tax, shipping } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    }
  })

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items, navigate])

  const onSubmit = async (data) => {
    setProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear cart and redirect to success
      dispatch(clearCart())
      toast.success('Order placed successfully!')
      navigate('/orders')
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const steps = [
    { id: 1, name: 'Shipping', icon: FiTruck },
    { id: 2, name: 'Payment', icon: FiCreditCard },
    { id: 3, name: 'Review', icon: FiCheck }
  ]

  return (
    <>
      <Helmet>
        <title>Checkout - NEXORA</title>
        <meta name="description" content="Complete your purchase securely" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol className="flex items-center justify-center space-x-5">
                {steps.map((stepItem) => (
                  <li key={stepItem.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        step >= stepItem.id
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'border-gray-300 text-gray-500'
                      }`}
                    >
                      <stepItem.icon className="w-5 h-5" />
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      step >= stepItem.id ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {stepItem.name}
                    </span>
                    {stepItem.id < steps.length && (
                      <div className={`ml-5 w-16 h-0.5 ${
                        step > stepItem.id ? 'bg-primary-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          {...register('firstName', { required: 'First name is required' })}
                          className="form-input mt-1"
                          placeholder="Enter first name"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          {...register('lastName', { required: 'Last name is required' })}
                          className="form-input mt-1"
                          placeholder="Enter last name"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                        })}
                        type="email"
                        className="form-input mt-1"
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        {...register('address', { required: 'Address is required' })}
                        className="form-input mt-1"
                        placeholder="Enter street address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                          {...register('city', { required: 'City is required' })}
                          className="form-input mt-1"
                          placeholder="Enter city"
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input
                          {...register('state', { required: 'State is required' })}
                          className="form-input mt-1"
                          placeholder="Enter state"
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                        <input
                          {...register('zipCode', { required: 'ZIP code is required' })}
                          className="form-input mt-1"
                          placeholder="Enter ZIP"
                        />
                        {errors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn btn-primary w-full"
                    >
                      Continue to Payment
                    </button>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="card"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="form-radio"
                        />
                        <label htmlFor="card" className="flex items-center space-x-2">
                          <FiCreditCard className="w-5 h-5" />
                          <span>Credit/Debit Card</span>
                        </label>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Card Number</label>
                          <input
                            {...register('cardNumber', { required: 'Card number is required' })}
                            className="form-input mt-1"
                            placeholder="1234 5678 9012 3456"
                          />
                          {errors.cardNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                            <input
                              {...register('expiryDate', { required: 'Expiry date is required' })}
                              className="form-input mt-1"
                              placeholder="MM/YY"
                            />
                            {errors.expiryDate && (
                              <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">CVV</label>
                            <input
                              {...register('cvv', { required: 'CVV is required' })}
                              className="form-input mt-1"
                              placeholder="123"
                            />
                            {errors.cvv && (
                              <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn btn-secondary flex-1"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="btn btn-primary flex-1"
                      >
                        Review Order
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Review Order */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                      <p className="text-sm text-gray-600">
                        {watch('firstName')} {watch('lastName')}<br />
                        {watch('address')}<br />
                        {watch('city')}, {watch('state')} {watch('zipCode')}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                      <p className="text-sm text-gray-600">
                        Credit Card ending in {watch('cardNumber')?.slice(-4) || '****'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiShield className="w-4 h-4" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="btn btn-secondary flex-1"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary flex-1"
                      >
                        {processing ? (
                          <div className="flex items-center justify-center">
                            <div className="spinner h-5 w-5 mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          `Place Order - $${total.toFixed(2)}`
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image || '/api/placeholder/60/60'}
                      alt={item.name}
                      className="w-15 h-15 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout