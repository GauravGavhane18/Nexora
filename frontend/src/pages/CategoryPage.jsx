import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FiGrid, FiList, FiFilter, FiChevronRight } from 'react-icons/fi'
import api from '../services/api' // Added import

const CategoryPage = () => {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/categories/${slug}`) // Assuming api.js adds /api/v1 base
        if (response.data.success) {
          setCategory(response.data.data.category)
          // Ensure subCategories is at least an empty array if not present, though current model might not populate it yet
          const cat = response.data.data.category;
          if (!cat.subCategories) cat.subCategories = []; // default fallback

          setCategory(cat)
          setProducts(response.data.data.products || [])
        }
      } catch (error) {
        console.error('Error fetching category:', error)
        // toast.error('Failed to load category')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCategoryData()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{category ? `${category.name} - NEXORA` : 'Category - NEXORA'}</title>
        <meta name="description" content={category?.description || 'Browse products by category'} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Category Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <nav className="mb-4">
              <ol className="flex items-center space-x-2 text-sm">
                <li><Link to="/" className="hover:text-primary-200">Home</Link></li>
                <li><FiChevronRight className="w-4 h-4" /></li>
                <li><span className="text-primary-200">{category?.name}</span></li>
              </ol>
            </nav>
            <h1 className="text-4xl font-bold mb-2">{category?.name}</h1>
            <p className="text-primary-100 text-lg">{category?.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Sub Categories */}
          {category?.subCategories?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Sub-Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.subCategories.map((subCat) => (
                  <Link
                    key={subCat.id}
                    to={`/category/${category.slug}/${subCat.slug}`}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{subCat.name}</h3>
                    <p className="text-sm text-gray-500">{subCat.productCount} products</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found in this category.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product.slug}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/300?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">${product.basePrice}</span>
                        {product.comparePrice > product.basePrice && (
                          <span className="text-sm text-gray-500 line-through">${product.comparePrice}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{(product.ratings?.average || 0).toFixed(1)}</span>
                          <span className="ml-1">({product.ratings?.count || 0})</span>
                        </div>
                        {(product.inventory?.quantity > 0) ? (
                          <span className="text-xs text-green-600 font-medium">In Stock</span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryPage