import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { removeFromWishlist, clearWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  const handleRemove = (id, name) => {
    dispatch(removeFromWishlist(id));
    toast.success(`${name} removed from wishlist`);
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({ 
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      quantity: 1 
    }));
    toast.success(`${item.name} added to cart!`);
  };

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;
    
    items.forEach(item => {
      dispatch(addToCart({ 
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        quantity: 1 
      }));
    });
    dispatch(clearWishlist());
    toast.success('All items moved to cart!');
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      dispatch(clearWishlist());
      toast.success('Wishlist cleared');
    }
  };

  const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (typeof image === 'string') return image;
    if (image.url) return image.url;
    return 'https://via.placeholder.com/300x300?text=No+Image';
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Wishlist - NEXORA</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center max-w-md px-4">
            <div className="w-32 h-32 mx-auto mb-6 bg-pink-50 rounded-full flex items-center justify-center">
              <FiHeart className="w-16 h-16 text-pink-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save items you love to your wishlist and shop them later!</p>
            <Link 
              to="/products" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Wishlist ({items.length}) - NEXORA</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FiHeart className="w-8 h-8 mr-3 text-pink-600" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <FiShoppingCart className="w-4 h-4" />
                <span>Move All to Cart</span>
              </button>
              <button
                onClick={handleClearWishlist}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2 border border-red-300 rounded-lg font-medium transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <Link to={`/products/${item.id}`}>
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </Link>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors group/btn"
                  >
                    <FiTrash2 className="w-5 h-5 text-gray-600 group-hover/btn:text-red-600" />
                  </button>

                  {/* Discount Badge */}
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <Link to={`/products/${item.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
                      {item.name}
                    </h3>
                  </Link>

                  {item.category && (
                    <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-blue-600">
                        ${item.price?.toFixed(2)}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.originalPrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FiShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-12 text-center">
            <Link 
              to="/products" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
