import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FiGrid, FiList, FiFilter, FiChevronRight } from 'react-icons/fi'

const SubCategoryPage = () => {
  const { categorySlug, subCategorySlug } = useParams()
  const [category, setCategory] = useState(null)
  const [subCategory, setSubCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockCategory = {
      id: 'cat-001',
      name: 'Electronics',
      slug: 'electronics'
    }

    const mockSubCategory = {
      id: 'sub-001',
      name: 'Audio',
      slug: 'audio',
      description: 'High-quality audio equipment and accessories',
      productCount: 45
    }

    const mockProducts = Array.from({ length: 8 }, (_, i) => ({
      id: `prod-${i + 1}`,
      name: `Audio Product ${i + 1}`,
      slug: `audio-product-${i + 1}`,
      price: 149.99 + i * 20,
      originalPrice: 199.99 + i * 20,
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 150),
      image: '/api/placeholder/300/300',
      inStock: Math.random() > 0.1
    }))

    setTimeout(() => {
      setCategory(mockCategory)
      setSubCategory(mockSubCategory)
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [categorySlug, subCategorySlug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
        <title>{subCategory?.name} - {category?.name} - NEXORA</title>
        <meta name="description" content={subCategory?.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Sub Category Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav className="mb-4">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li><Link to="/" className="hover:text-gray-700">Home</Link></li>
                <li><FiChevronRight className="w-4 h-4" /></li>
                <li><Link to={`/category/${category?.slug}`} className="hover:text-gray-700">{category?.name}</Link></li>
                <li><FiChevronRight className="w-4 h-4" /></li>
                <li><span className="text-gray-900">{subCategory?.name}</span></li>
              </ol>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{subCategory?.name}</h1>
                <p className="mt-2 text-gray-600">{subCategory?.description}</p>
                <p className="mt-1 text-sm text-gray-500">{subCategory?.productCount} products available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and View Options */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <select className="form-select">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Customer Rating</option>
                <option>Newest First</option>
              </select>
            </div>
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
              <button className="btn btn-secondary btn-sm">
                <FiFilter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`bg-gray-100 ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{product.rating.toFixed(1)}</span>
                        <span className="ml-1">({product.reviewCount})</span>
                      </div>
                      {product.inStock ? (
                        <span className="text-xs text-green-600 font-medium">In Stock</span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                      )}
                    </div>
                    {viewMode === 'list' && (
                      <div className="mt-3">
                        <button className="btn btn-primary btn-sm w-full">
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Previous</button>
              <button className="px-3 py-2 text-sm bg-primary-600 text-white rounded">1</button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">2</button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">3</button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Next</button>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default SubCategoryPage