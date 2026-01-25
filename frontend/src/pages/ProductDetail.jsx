import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  FiStar,
  FiHeart,
  FiShare2,
  FiShoppingCart,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiCheck,
  FiMinus,
  FiPlus
} from 'react-icons/fi'
import { addToCart } from '../redux/slices/cartSlice'
import { addToRecentlyViewed } from '../utils/recentlyViewed'
import api from '../services/api'
import { getProductRecommendations, logInteraction } from '../services/recommendationService'
import { trackEvent } from '../services/omnisend'

const ProductDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/products/${slug}`)
        const productData = response.data.data.product || response.data.data
        setProduct(productData)
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0])
        }
        // Track recently viewed
        addToRecentlyViewed(productData)

        // Log interaction and fetch recommendations
        if (productData) {
          const pid = productData._id || productData.id;
          logInteraction(pid, 'view');
          getProductRecommendations(pid).then(recs => setRecommendations(recs));

          // Omnisend Tracking
          trackEvent('viewed product', {
            productID: pid,
            productName: productData.name,
            productVersion: productData.variants && productData.variants.length ? 'variant' : 'simple',
            productPrice: productData.price,
            productUrl: window.location.href,
            productImage: productData.images?.[0]?.url || productData.images?.[0]
          });
        }

      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Product not found')
        navigate('/products')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug, navigate])

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: selectedVariant?.price || product.price,
      image: product.images?.[0]?.url || product.images?.[0] || 'https://placehold.co/300x300?text=No+Image',
      category: product.category || '',
      quantity: quantity,
      variant: selectedVariant
    };

    console.log('Adding to cart:', cartItem);
    dispatch(addToCart(cartItem));

    // Omnisend Tracking
    trackEvent('added product to cart', {
      productID: product.id || product._id,
      productName: product.name,
      productPrice: selectedVariant?.price || product.price,
      quantity: quantity,
      currency: 'USD', // Defaulting to USD for now
      variantId: selectedVariant?.id,
      variantTitle: selectedVariant?.name
    });

    toast.success('Added to cart!');
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product?.stockCount) {
      setQuantity(newQuantity)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating)
          ? 'text-yellow-400 fill-current'
          : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
          }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-lg h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
            <button
              onClick={() => navigate('/products')}
              className="mt-4 btn btn-primary"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name || 'Product'} - NEXORA`}</title>
        <meta name="description" content={product.description || 'Product Details'} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li><a href="/" className="text-gray-500 hover:text-gray-700">Home</a></li>
              <li><span className="text-gray-400">/</span></li>
              <li><a href="/products" className="text-gray-500 hover:text-gray-700">Products</a></li>
              <li><span className="text-gray-400">/</span></li>
              <li><span className="text-gray-900">{product.name}</span></li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-lg overflow-hidden">
                <img
                  src={imageError ? 'https://placehold.co/500' : (product.images?.[selectedImage]?.url || product.images?.[selectedImage] || 'https://placehold.co/500')}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => { setSelectedImage(index); setImageError(false); }}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                      }`}
                  >
                    <img
                      src={image?.url || image || 'https://placehold.co/100'}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/100'; }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(product.ratings?.average || 0)}
                </div>
                <span className="text-sm text-gray-600">
                  {product.ratings?.average?.toFixed(1) || '0.0'} ({product.ratings?.count || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${selectedVariant?.price || product.price}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      {product.discount || 0}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                  <div className="flex space-x-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`w-8 h-8 rounded-full border-2 ${selectedVariant?.id === variant.id
                          ? 'border-primary-500 ring-2 ring-primary-200'
                          : 'border-gray-300'
                          }`}
                        style={{ backgroundColor: variant.value }}
                        title={variant.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stockCount}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.inventory?.quantity || 0} available
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.isActive || (product.inventory?.quantity || 0) <= 0}
                    className="btn btn-secondary flex-1"
                  >
                    <FiShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.isActive || (product.inventory?.quantity || 0) <= 0}
                    className="btn btn-primary flex-1"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`btn ${isWishlisted ? 'btn-primary' : 'btn-secondary'} flex-1`}
                  >
                    <FiHeart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </button>
                  <button className="btn btn-secondary">
                    <FiShare2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <FiCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  )) || <p className="text-sm text-gray-500">No specific features listed.</p>}
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiTruck className="w-5 h-5 mr-2 text-primary-600" />
                    Free shipping
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiShield className="w-5 h-5 mr-2 text-primary-600" />
                    2 year warranty
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiRefreshCw className="w-5 h-5 mr-2 text-primary-600" />
                    30-day returns
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button className="py-4 text-sm font-medium text-primary-600 border-b-2 border-primary-600">
                    Specifications
                  </button>
                  <button className="py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Reviews ({product.ratings?.count || 0})
                  </button>
                  <button className="py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Shipping & Returns
                  </button>
                </nav>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.specifications ? Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  )) : <p className="text-gray-500">No specifications available.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Recommendation */}
        {recommendations.length > 0 && (
          <div className="mt-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <div key={rec._id || rec.product_id} className="group relative bg-white p-4 rounded-lg shadow-sm">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-60">
                    <img
                      src={rec.image || rec.images?.[0]?.url || rec.images?.[0] || 'https://placehold.co/300'}
                      alt={rec.name}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        <a href={`/products/${rec.slug || rec._id || rec.product_id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {rec.name}
                        </a>
                      </h3>
                      <p className="mt-1 text-xs text-green-600 font-medium">{rec.reason || rec.category?.name || 'Recommended'}</p>
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
  )
}

export default ProductDetail