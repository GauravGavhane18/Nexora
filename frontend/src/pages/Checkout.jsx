import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FiCreditCard, FiTruck, FiShield, FiCheck } from 'react-icons/fi';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { clearCart } from '../redux/slices/cartSlice';
import { trackEvent } from '../services/omnisend';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Initialize Stripe
let stripePromise = null;
const getStripe = async () => {
  if (!stripePromise) {
    try {
      const { data } = await axios.get(`${API_URL}/payments/config`);
      stripePromise = loadStripe(data.data.publishableKey);
    } catch (error) {
      console.error('Failed to load Stripe:', error);
    }
  }
  return stripePromise;
};

const CheckoutForm = () => {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const subscriptionData = location.state?.subscription;

  const { items, total: cartTotal, subtotal: cartSubtotal, tax: cartTax, shipping: cartShipping } = useSelector((state) => state.cart);

  // Override totals if subscription
  const total = subscriptionData ? subscriptionData.price : cartTotal;
  const subtotal = subscriptionData ? subscriptionData.price : cartSubtotal;
  const tax = subscriptionData ? 0 : cartTax;
  const shipping = subscriptionData ? 0 : cartShipping;

  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues
  } = useForm({
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });

  useEffect(() => {
    if (items.length === 0 && !subscriptionData) {
      navigate('/cart');
    } else {
      // Track started checkout
      trackEvent('started checkout', {
        value: total,
        currency: 'USD',
        lineItems: items.map(item => ({
          productID: item.id,
          title: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });
    }
  }, [items, navigate, subscriptionData, total]);

  // Create payment intent when moving to payment step
  const createPaymentIntent = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Fix: use accessToken not token
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      const { data } = await axios.post(
        `${API_URL}/payments/create-payment-intent`,
        {
          amount: total,
          currency: 'usd',
          metadata: {
            items: subscriptionData
              ? JSON.stringify([{ type: 'subscription', ...subscriptionData }])
              : JSON.stringify(items.map(item => ({
                product: item.id,
                quantity: item.quantity
              })))
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClientSecret(data.data.clientSecret);
      setPaymentIntentId(data.data.paymentIntentId);
    } catch (error) {
      console.error('Payment intent error:', error);
      toast.error('Failed to initialize payment');
    }
  };

  const handleStepTwo = async () => {
    const formData = getValues();
    if (!formData.firstName || !formData.lastName || !formData.street || !formData.city || !formData.state || !formData.zipCode) {
      toast.error('Please fill in all shipping information');
      return;
    }
    await createPaymentIntent();
    setStep(2);
  };

  const onSubmit = async (formData) => {
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem('accessToken');

      // 1. Create Pending Order first to validate stock
      const orderData = {
        items: subscriptionData ? [] : items.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        type: subscriptionData ? 'subscription' : 'standard',
        subscriptionDetails: subscriptionData,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentIntentId: paymentIntentId // Created in Step 2
      };

      const { data: orderResponse } = await axios.post(
        `${API_URL}/orders`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderId = orderResponse.data.order._id;

      // 2. Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: {
              line1: formData.street,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
              country: 'US'
            }
          }
        }
      });

      if (error) {
        // If payment fails, we could optionally cancel the pending order here, 
        // or let it remain pending/expire.
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. Confirm payment on backend (finalize order)
        await axios.put(
          `${API_URL}/orders/${orderId}/confirm-payment`,
          { paymentIntentId: paymentIntent.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Clear cart and redirect
        // Track placed order
        trackEvent('placed order', {
          orderID: orderId,
          value: total,
          currency: 'USD',
          lineItems: items.map(item => ({
            productID: item.id,
            title: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        });

        dispatch(clearCart());
        toast.success('Order placed successfully!');
        navigate(`/orders/${orderId}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      // If error came from axios (e.g. out of stock in step 1)
      const message = error.response?.data?.message || error.message || 'Payment failed. Please try again.';
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const steps = [
    { id: 1, name: 'Shipping', icon: FiTruck },
    { id: 2, name: 'Payment', icon: FiCreditCard },
    { id: 3, name: 'Review', icon: FiCheck }
  ];

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

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
                {steps.map((stepItem, index) => (
                  <li key={stepItem.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= stepItem.id
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 text-gray-500'
                        }`}
                    >
                      <stepItem.icon className="w-5 h-5" />
                    </div>
                    <span className={`ml-2 text-sm font-medium ${step >= stepItem.id ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                      {stepItem.name}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`ml-5 w-16 h-0.5 ${step > stepItem.id ? 'bg-blue-600' : 'bg-gray-300'
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
                <div className={step === 1 ? 'block' : 'hidden'}>
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          {...register('firstName', { required: 'First name is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          {...register('lastName', { required: 'Last name is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                        })}
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                      <input
                        {...register('street', { required: 'Address is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.street && (
                        <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          {...register('city', { required: 'City is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <input
                          {...register('state', { required: 'State is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                        <input
                          {...register('zipCode', { required: 'ZIP code is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleStepTwo}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>

                {/* Step 2: Payment Method */}
                <div className={step === 2 ? 'block' : 'hidden'}>
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Card Details
                      </label>
                      <CardElement options={cardElementOptions} />
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <FiShield className="w-5 h-5 text-blue-600" />
                      <span>Your payment is secured by Stripe</span>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 font-medium"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!stripe}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                      >
                        Review Order
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3: Review Order */}
                <div className={step === 3 ? 'block' : 'hidden'}>
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                      <p className="text-sm text-gray-600">
                        {watch('firstName')} {watch('lastName')}<br />
                        {watch('street')}<br />
                        {watch('city')}, {watch('state')} {watch('zipCode')}
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
                        className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 font-medium"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={processing || !stripe}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                      >
                        {processing ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          `Place Order - $${total.toFixed(2)}`
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {subscriptionData ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-xl">
                      {subscriptionData.billingCycle === 'yearly' ? 'YR' : 'MO'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{subscriptionData.name} Plan</h3>
                      <p className="text-sm text-gray-500">{subscriptionData.description}</p>
                    </div>
                    <span className="font-medium text-gray-900">
                      ${subscriptionData.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  items.map((item) => (
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
                  ))
                )}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
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
  );
};

const Checkout = () => {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    getStripe().then(setStripePromise);
  }, []);

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;