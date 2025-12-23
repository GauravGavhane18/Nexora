import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromWishlist, clearWishlist } from '../redux/slices/wishlistSlice'
import { addToCart } from '../redux/slices/cartSlice'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.wishlist)

  const handleRemove = (id, name) => {
    dispatch(removeFromWishlist(id))
    toast.success(`${name} removed from wishlist`)
  }

  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }))
    toast.success(`${item.name} added to cart!`)
  }

  const handleMoveAllToCart = () => {
    items.forEach(item => {
      dispatch(addToCart({ ...item, quantity: 1 }))
    })
    dispatch(clearWishlist())
    toast.success('All items moved to cart!')
  }

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Wishlist - NEXORA</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
            <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Browse Products
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Wishlist ({items.length}) - NEXORA</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">{items.length} items saved</p>
            </div>
            <button
              onClick={handleMoveAllToCart}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Move All to Cart
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <Link to={`/products/${item.id}`}>
                    <img src={item.image} alt={item.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors"
                  >
                    <span className="text-red-500">✕</span>
                  </button>
                </div>
                <div className="p-4">
                  <Link to={`/products/${item.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">{item.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-blue-600">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Wishlist
