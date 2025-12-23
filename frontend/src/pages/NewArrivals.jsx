import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import toast from 'react-hot-toast'

const NewArrivals = () => {
  const dispatch = useDispatch()
  
  const [products] = useState([
    {
      id: 201,
      name: 'AirPods Pro Max 2024',
      price: 549.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 23,
      isNew: true,
      arrivalDate: '2024-01-15'
    },
    {
      id: 202,
      name: 'Smart Ring Health Tracker',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 12,
      isNew: true,
      arrivalDate: '2024-01-14'
    },
    {
      id: 203,
      name: 'Portable Projector 4K',
      price: 699.99,
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 8,
      isNew: true,
      arrivalDate: '2024-01-13'
    },
    {
      id: 204,
      name: 'Wireless Charging Pad 3-in-1',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 34,
      isNew: true,
      arrivalDate: '2024-01-12'
    },
    {
      id: 205,
      name: 'Smart Glasses AR Edition',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 15,
      isNew: true,
      arrivalDate: '2024-01-11'
    },
    {
      id: 206,
      name: 'Mechanical Keyboard Mini',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop',
      rating: 4.4,
      reviews: 28,
      isNew: true,
      arrivalDate: '2024-01-10'
    },
    {
      id: 207,
      name: 'USB-C Hub 10-in-1',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 45,
      isNew: true,
      arrivalDate: '2024-01-09'
    },
    {
      id: 208,
      name: 'Smart Water Bottle',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
      rating: 4.2,
      reviews: 67,
      isNew: true,
      arrivalDate: '2024-01-08'
    },
  ])

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    }))
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <>
      <Helmet>
        <title>New Arrivals - NEXORA</title>
        <meta name="description" content="Check out our latest products" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">✨ New Arrivals</h1>
            <p className="text-xl">Be the first to get our latest products</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <Link to={`/products/${product.id}`}>
                    <img src={product.image} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    NEW
                  </div>
                </div>
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">{product.name}</h3>
                  </Link>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm">{'★'.repeat(Math.floor(product.rating))}</div>
                    <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default NewArrivals