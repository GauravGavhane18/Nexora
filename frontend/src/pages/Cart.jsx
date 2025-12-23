import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { updateQuantity, removeFromCart, clearCart } from '../redux/slices/cartSlice'

const Cart = () => {
  const dispatch = useDispatch()
  const { items, subtotal, itemCount } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(id))
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    }
  }

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id))
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart())
    }
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'nexora10') {
      setDiscount(subtotal * 0.1)
      alert('Promo code applied! 10% discount')
    } else if (promoCode.toLowerCase() === 'welcome20') {
      setDiscount(subtotal * 0.2)
      alert('Promo code applied! 20% discount')
    } else {
      alert('Invalid promo code')
      setDiscount(0)
    }
  }

  const finalSubtotal = subtotal - discount
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = finalSubtotal * 0.08
  const total = finalSubtotal + shipping + tax

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - NEXORA</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items yet.</p>
            <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart ({itemCount}) - NEXORA</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button onClick={handleClearCart} className="text-red-600 hover:text-red-700 text-sm font-medium">
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-lg font-bold text-blue-600">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">-</button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">+</button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => handleRemoveItem(item.id)} className="text-red-600 hover:text-red-700 text-sm mt-1">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                  <div className="flex space-x-2">
                    <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter code" className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
                    <button onClick={applyPromoCode} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Apply</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Try: NEXORA10 or WELCOME20</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {subtotal < 50 && subtotal > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                    <p className="text-sm text-blue-700">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
                  </div>
                )}

                {isAuthenticated ? (
                  <Link to="/checkout" className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 text-center block font-medium">
                    Proceed to Checkout
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 text-center block font-medium">Sign In to Checkout</Link>
                    <Link to="/register" className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 text-center block font-medium">Create Account</Link>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <Link to="/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">← Continue Shopping</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart