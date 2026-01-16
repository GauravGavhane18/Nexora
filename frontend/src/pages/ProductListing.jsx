import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice'
import toast from 'react-hot-toast'
import api from '../services/api'
import ProductCard from '../components/Product/ProductCard'
import QuickFilters from '../components/Product/QuickFilters'

const ProductListing = () => {
  const dispatch = useDispatch()
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(true)
  const [compareList, setCompareList] = useState([]) // Products to compare
  const [showCompare, setShowCompare] = useState(false)

  useEffect(() => {
    fetchProducts()
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?limit=100')
      console.log('API Response:', response.data)
      setProducts(response.data.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    inStock: false
  })
  const [quickFilters, setQuickFilters] = useState({})

  const [sortBy, setSortBy] = useState('name')

  const categories = ['Electronics', 'Food & Grocery', 'Fashion & Clothing', 'Home & Garden', 'Sports & Fitness', 'Books & Media']

  // Enhanced filtering with search and quick filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = product.name.toLowerCase().includes(query)
      const matchesCategory = product.category?.name?.toLowerCase().includes(query)
      const matchesDescription = product.description?.toLowerCase().includes(query)
      if (!matchesName && !matchesCategory && !matchesDescription) return false
    }

    // Category filter
    if (filters.category && product.category?.name !== filters.category) return false

    // Stock filter
    if (filters.inStock && product.inventory?.quantity <= 0) return false

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      if (max) {
        if (product.basePrice < min || product.basePrice > max) return false
      } else {
        if (product.basePrice < min) return false
      }
    }

    // Quick filters
    if (quickFilters.new && !product.isNew) return false
    if (quickFilters.sale && product.basePrice >= (product.originalPrice || product.basePrice * 1.1)) return false
    if (quickFilters.bestseller && (product.ratings?.count || 0) < 50) return false
    if (quickFilters['in-stock'] && product.inventory?.quantity <= 0) return false
    if (quickFilters['free-shipping'] && product.basePrice < 999) return false
    if (quickFilters['under-500'] && product.basePrice >= 500) return false
    if (quickFilters['rated-4'] && (product.ratings?.average || 0) < 4) return false

    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.basePrice - b.basePrice
      case 'price-high': return b.basePrice - a.basePrice
      case 'rating': return (b.ratings?.average || 0) - (a.ratings?.average || 0)
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt)
      case 'popular': return (b.ratings?.count || 0) - (a.ratings?.count || 0)
      default: return a.name.localeCompare(b.name)
    }
  })

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({ category: '', priceRange: '', inStock: false })
    setSearchQuery('')
    setSortBy('name')
  }

  // Quick add to cart
  const handleQuickAdd = (product, quantity = 1) => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.basePrice,
      image: product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image',
      category: product.category?.name || '',
      quantity
    };

    dispatch(addToCart(cartItem));
    toast.success(`${quantity}x ${product.name} added to cart!`);
  }

  // Compare products
  const toggleCompare = (product) => {
    if (compareList.find(p => p._id === product._id)) {
      setCompareList(compareList.filter(p => p._id !== product._id))
      toast.success('Removed from comparison')
    } else {
      if (compareList.length >= 3) {
        toast.error('You can only compare up to 3 products')
        return
      }
      setCompareList([...compareList, product])
      toast.success('Added to comparison')
    }
  }

  const clearCompare = () => {
    setCompareList([])
    setShowCompare(false)
  }

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.basePrice,
      image: product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image',
      category: product.category?.name || '',
      quantity: 1
    };

    dispatch(addToCart(cartItem));

    toast.success(
      <div>
        <p className="font-semibold">{product.name} added to cart!</p>
        <Link to="/cart" className="text-blue-600 hover:underline text-sm">View Cart</Link>
      </div>,
      { duration: 3000 }
    );
  }

  const isInWishlist = (id) => wishlistItems.some(item => item.id === id)

  const handleWishlist = (product) => {
    if (isInWishlist(product._id)) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist({
        id: product._id,
        name: product.name,
        price: product.basePrice,
        originalPrice: product.comparePrice,
        category: product.category?.name || '',
        image: product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'
      }));
      toast.success('Added to wishlist!');
    }
  }

  return (
    <>
      <Helmet>
        <title>Products - NEXORA</title>
        <meta name="description" content="Browse our premium product collection" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header with Search */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Premium Products</h1>
            <p className="text-gray-600 mb-4">Discover our curated collection of high-quality products</p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mb-4">
              <input
                type="text"
                placeholder="Search products by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <QuickFilters
              onFilterChange={setQuickFilters}
              activeFilters={quickFilters}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Prices</option>
                    <option value="0-500">Under ₹500</option>
                    <option value="500-1000">₹500 - ₹1,000</option>
                    <option value="1000-2000">₹1,000 - ₹2,000</option>
                    <option value="2000-5000">₹2,000 - ₹5,000</option>
                    <option value="5000-99999">₹5,000+</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">In Stock Only</span>
                  </label>
                </div>

                <button
                  onClick={handleClearFilters}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Products */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {showFilters ? 'Hide' : 'Show'} Filters
                    </button>
                    <p className="text-gray-600">
                      <span className="font-semibold">{sortedProducts.length}</span> products found
                      {searchQuery && <span className="text-sm ml-2">for "{searchQuery}"</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        title="Grid View"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        title="List View"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest First</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                  </div>
                ) : sortedProducts.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-600 text-lg mb-2">No products found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or search query</p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  // Grid/List View using ProductCard component
                  sortedProducts.map(product => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-600 shadow-2xl z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-gray-900">Compare Products ({compareList.length}/3)</h3>
                  <div className="flex gap-3">
                    {compareList.map(product => (
                      <div key={product._id} className="relative">
                        <img
                          src={product.images[0]?.url || '/api/placeholder/80/80'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md border-2 border-gray-200"
                        />
                        <button
                          onClick={() => toggleCompare(product)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCompare(true)}
                    disabled={compareList.length < 2}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${compareList.length < 2
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    Compare Now
                  </button>
                  <button
                    onClick={clearCompare}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compare Modal */}
        {showCompare && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Product Comparison</h2>
                <button
                  onClick={() => setShowCompare(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {compareList.map(product => (
                    <div key={product._id} className="border rounded-lg overflow-hidden">
                      <img
                        src={product.images[0]?.url || '/api/placeholder/300/300'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 space-y-3">
                        <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-bold text-gray-900">₹{product.basePrice}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium">{product.category?.name || 'N/A'}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-600">Rating:</span>
                            <div className="flex items-center">
                              <span className="text-yellow-400 mr-1">★</span>
                              <span className="font-medium">{product.ratings?.average?.toFixed(1) || '0.0'}</span>
                              <span className="text-gray-500 ml-1">({product.ratings?.count || 0})</span>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-600">Stock:</span>
                            <span className={`font-medium ${product.inventory?.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {product.inventory?.quantity > 0 ? `${product.inventory?.quantity} available` : 'Out of stock'}
                            </span>
                          </div>

                          {product.comparePrice && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Savings:</span>
                              <span className="font-medium text-green-600">
                                {Math.round(((product.comparePrice - product.basePrice) / product.comparePrice) * 100)}% OFF
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.inventory?.quantity <= 0}
                          className={`w-full py-2 rounded-md font-medium transition-colors ${product.inventory?.quantity <= 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                          {product.inventory?.quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ProductListing