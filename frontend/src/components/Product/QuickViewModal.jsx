import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiShoppingCart, FiHeart, FiShare2, FiStar } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../redux/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const isInWishlist = wishlistItems.some(item => item.id === product?._id)

  useEffect(() => {
    if (isOpen && product?.images?.length > 0) {
      setSelectedImage(0)
      setQuantity(1)
    }
  }, [isOpen, product])

  if (!product || !isOpen) return null

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.basePrice,
      image: product.images?.[0]?.url || product.images?.[0],
      quantity: quantity
    }))
    toast.success(`${quantity}x ${product.name} added to cart!`)
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id))
      toast.success('Removed from wishlist')
    } else {
      dispatch(addToWishlist({
        id: product._id,
        name: product.name,
        price: product.basePrice,
        image: product.images?.[0]?.url || product.images?.[0]
      }))
      toast.success('Added to wishlist')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>

              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Images */}
                <div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
                    <img
                      src={product.images?.[selectedImage]?.url || product.images?.[selectedImage] || '/api/placeholder/600/600'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {product.images?.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.slice(0, 5).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            selectedImage === idx ? 'border-blue-600' : 'border-transparent'
                          }`}
                        >
                          <img
                            src={img?.url || img}
                            alt={`${product.name} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div>
                  <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                  
                  {product.ratings?.average && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.ratings.average)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">
                        ({product.ratings.count || 0} reviews)
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-blue-600">
                      ₹{product.basePrice?.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.basePrice && (
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {product.description}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-4 mb-6">
                    <label className="font-semibold">Quantity:</label>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.inventory?.quantity || 10, quantity + 1))}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.inventory?.quantity || 0} in stock
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <FiShoppingCart />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        isInWishlist
                          ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-red-500'
                      }`}
                    >
                      <FiHeart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                    >
                      <FiShare2 className="w-6 h-6" />
                    </button>
                  </div>

                  <Link
                    to={`/products/${product.slug || product._id}`}
                    className="block text-center text-blue-600 hover:text-blue-700 font-semibold py-2"
                  >
                    View Full Details →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default QuickViewModal

