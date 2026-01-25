import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiTrash2, FiShoppingBag, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { updateQuantity, removeFromCart, clearCart } from '../redux/slices/cartSlice';
import { getHomeRecommendations, getProductRecommendations } from '../services/recommendationService';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, itemCount } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  // Fetch recommendations
  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (items.length > 0) {
        // Use the most recently added item for recommendations
        // Assuming the last item in the array is the most recent
        const lastItem = items[items.length - 1];
        try {
          const recs = await getProductRecommendations(lastItem.id);
          setRecommendations(recs);
        } catch (error) {
          console.error('Error fetching cart recommendations:', error);
        }
      } else if (user && (user._id || user.id)) {
        // Fallback to home recommendations if cart is empty
        try {
          const recs = await getHomeRecommendations(user._id || user.id);
          setRecommendations(recs);
        } catch (error) {
          console.error('Error fetching home recommendations:', error);
        }
      }
    };

    fetchRecommendations();
  }, [user, items]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(id));
      toast.success('Item removed from cart');
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from cart`);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      toast.success('Cart cleared');
    }
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (code === 'SAVE10') {
      setDiscount(subtotal * 0.1);
      toast.success('Promo code applied! 10% discount');
    } else if (code === 'SAVE20') {
      setDiscount(subtotal * 0.2);
      toast.success('Promo code applied! 20% discount');
    } else {
      toast.error('Invalid promo code');
      setDiscount(0);
    }
  };

  const finalSubtotal = subtotal - discount;
  const shipping = subtotal >= 100 ? 0 : 10;
  const tax = finalSubtotal * 0.1; // 10% tax
  const total = finalSubtotal + shipping + tax;

  const getImageUrl = (image) => {
    if (!image) return 'https://placehold.co/150?text=No+Image';
    if (typeof image === 'string') return image;
    if (image.url) return image.url;
    return 'https://placehold.co/150?text=No+Image';
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - NEXORA</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center max-w-md px-4">
            <div className="w-32 h-32 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
              <FiShoppingBag className="w-16 h-16 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items yet. Start shopping to fill your cart!</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Shopping Cart (${itemCount || 0}) - NEXORA`}</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
            </div>
            <button
              onClick={handleClearCart}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <Link to={`/products/${item.id}`} className="flex-shrink-0">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/150?text=No+Image';
                        }}
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-1">
                          {item.name}
                        </h3>
                      </Link>
                      {item.category && (
                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                      )}
                      <p className="text-lg font-bold text-blue-600">${item.price?.toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white hover:shadow transition-all"
                        >
                          <span className="text-lg font-medium">−</span>
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white hover:shadow transition-all"
                        >
                          <span className="text-lg font-medium">+</span>
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium mt-1 flex items-center space-x-1"
                        >
                          <FiTrash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiTag className="w-4 h-4 mr-2" />
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Try: SAVE10 or SAVE20</p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between text-xl font-bold mb-6">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>

                {/* Free Shipping Banner */}
                {subtotal < 100 && subtotal > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-700 font-medium">
                      🎉 Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                {isAuthenticated ? (
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm hover:shadow-md"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/login', { state: { from: '/checkout' } })}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                      Sign In to Checkout
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <Link
                    to="/products"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                  >
                    ← Continue Shopping
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended for You */}
        {recommendations.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <div key={rec._id || rec.product_id || rec.id} className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                    <img
                      src={rec.image || rec.images?.[0]?.url || rec.images?.[0] || 'https://placehold.co/150'}
                      alt={rec.name}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link to={`/products/${rec.slug || rec._id || rec.product_id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {rec.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-green-600">{rec.reason || rec.category?.name || 'Recommended'}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${(rec.basePrice || rec.price)?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </>
  );
};

export default Cart;
