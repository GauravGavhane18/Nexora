import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiPhone, FiShoppingBag, FiPackage } from 'react-icons/fi'
import { register as registerUser, clearError } from '../../redux/slices/authSlice'
import Logo from '../../components/UI/Logo'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const userType = searchParams.get('type') || 'buyer'
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      role: userType === 'seller' ? 'seller' : 'user'
    }
  })

  const password = watch('password')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const onSubmit = (data) => {
    dispatch(registerUser(data))
  }

  const isSeller = userType === 'seller'
  const colorClasses = isSeller ? {
    gradient: 'from-green-50 to-emerald-100',
    icon: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    link: 'text-green-600 hover:text-green-500',
    ring: 'focus:ring-green-500 focus:border-green-500'
  } : {
    gradient: 'from-blue-50 to-indigo-100',
    icon: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    link: 'text-blue-600 hover:text-blue-500',
    ring: 'focus:ring-blue-500 focus:border-blue-500'
  }

  return (
    <>
      <Helmet>
        <title>{isSeller ? 'Seller Registration' : 'Customer Registration'} - NEXORA</title>
        <meta name="description" content={`Create your NEXORA ${isSeller ? 'seller' : 'customer'} account`} />
      </Helmet>
      
      <div className={`min-h-screen bg-gradient-to-br ${colorClasses.gradient} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Logo className="mx-auto h-12 w-auto" />
            <div className="mt-6 flex items-center justify-center">
              {isSeller ? (
                <FiPackage className={`h-8 w-8 ${colorClasses.icon} mr-2`} />
              ) : (
                <FiShoppingBag className={`h-8 w-8 ${colorClasses.icon} mr-2`} />
              )}
              <h2 className="text-3xl font-extrabold text-gray-900">
                {isSeller ? 'Become a Seller' : 'Create Account'}
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {isSeller ? 'Start selling on NEXORA today' : 'Join thousands of happy customers'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            {isSeller && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-sm font-semibold text-green-800 mb-2">Seller Benefits:</h3>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Reach thousands of customers</li>
                  <li>• Easy product management tools</li>
                  <li>• Secure payment processing</li>
                  <li>• Analytics and insights</li>
                </ul>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" {...register('role')} />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: { value: 2, message: 'First name must be at least 2 characters' }
                      })}
                      className={`appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none ${colorClasses.ring} sm:text-sm`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                      })}
                      className={`appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none ${colorClasses.ring} sm:text-sm`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none ${colorClasses.ring} sm:text-sm`}
                    placeholder={isSeller ? "business@example.com" : "john@example.com"}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number {!isSeller && <span className="text-gray-400">(Optional)</span>}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone', {
                      required: isSeller ? 'Phone number is required for sellers' : false,
                      pattern: {
                        value: /^\+?[\d\s-()]+$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    className={`appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none ${colorClasses.ring} sm:text-sm`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                      }
                    })}
                    className={`appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none ${colorClasses.ring} sm:text-sm`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                    className={`appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none ${colorClasses.ring} sm:text-sm`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  {...register('agreeToTerms', {
                    required: 'You must agree to the terms and conditions'
                  })}
                  className={`h-4 w-4 ${colorClasses.icon} focus:ring-2 ${colorClasses.ring} border-gray-300 rounded`}
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <Link to="/terms" className={`${colorClasses.link} font-medium`}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className={`${colorClasses.link} font-medium`}>
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${colorClasses.button} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Creating Account...' : `Create ${isSeller ? 'Seller' : 'Customer'} Account`}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to={isSeller ? '/auth/seller/login' : '/auth/buyer/login'}
                    className={`font-medium ${colorClasses.link}`}
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-3">
                    {isSeller ? 'Want to shop instead?' : 'Want to sell products?'}
                  </p>
                  <Link
                    to={isSeller ? '/auth/register?type=buyer' : '/auth/register?type=seller'}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    {isSeller ? 'Customer Registration' : 'Seller Registration'}
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register