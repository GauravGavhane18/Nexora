import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiEye, FiStar, FiShare2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../redux/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice'
import toast from 'react-hot-toast'
import QuickViewModal from './QuickViewModal'

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const dispatch = useDispatch()
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const [showQuickView, setShowQuickView] = useState(false)
  const [imageError, setImageError] = useState(false)

  const isInWishlist = wishlistItems.some(item => item.id === product._id)
  const imageUrl = product.images?.[0]?.url || product.images?.[0] || 'https://placehold.co/300'

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.basePrice,
      image: imageUrl,
      quantity: 1
    }))
    toast.success(`${product.name} added to cart!`)
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id))
      toast.success('Removed from wishlist')
    } else {
      dispatch(addToWishlist({
        id: product._id,
        name: product.name,
        price: product.basePrice,
        image: imageUrl
      }))
      toast.success('Added to wishlist')
    }
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
  }

  const handleShare = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/products/${product.slug || product._id}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url
        })
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied!')
    }
  }

  if (viewMode === 'list') {
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <Link to={`/products/${product.slug || product._id}`} className="flex">
            <div className="w-48 h-48 flex-shrink-0">
              <img
                src={imageError ? 'https://placehold.co/300' : imageUrl}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{product.name || 'Untitled Product'}</h3>
                {product.ratings?.average && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.ratings.average)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({product.ratings.count || 0})
                    </span>
                  </div>
                )}
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{product.basePrice?.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.basePrice && (
                    <span className="ml-2 text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleQuickView}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Quick View"
                  >
                    <FiEye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-2 rounded-lg transition-colors ${isInWishlist
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-600'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    <FiShoppingCart />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
        <QuickViewModal
          product={product}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      </>
    )
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700 relative"
      >
        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
            NEW
          </span>
        )}
        {product.basePrice < (product.originalPrice || product.basePrice * 1.2) && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
            SALE
          </span>
        )}

        {/* Image */}
        <Link to={`/products/${product.slug || product._id}`} className="block relative overflow-hidden">
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
            <img
              src={imageError ? 'https://placehold.co/300' : imageUrl}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={handleQuickView}
                className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
                title="Quick View"
              >
                <FiEye className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={handleAddToCart}
                className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
                title="Add to Cart"
              >
                <FiShoppingCart className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
                title="Share"
              >
                <FiShare2 className="w-5 h-5 text-gray-800" />
              </button>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <Link to={`/products/${product.slug || product._id}`}>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name || 'Untitled Product'}
            </h3>
          </Link>

          {product.ratings?.average && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.ratings.average)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({product.ratings.count || 0})
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xl font-bold text-blue-600">
                ₹{product.basePrice?.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.basePrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-lg transition-colors ${isInWishlist
                ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <FiShoppingCart />
            Add to Cart
          </button>
        </div>
      </motion.div>

      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  )
}

export default ProductCard

