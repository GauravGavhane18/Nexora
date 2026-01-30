import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import toast from 'react-hot-toast'

const Deals = () => {
  const dispatch = useDispatch()

  const [deals] = useState([
    {
      id: 101,
      name: 'Premium Wireless Headphones',
      price: 149.99,
      originalPrice: 299.99,
      discount: 50,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 128,
      endTime: '2024-12-31'
    },
    {
      id: 102,
      name: 'Smart Fitness Watch Pro',
      price: 99.99,
      originalPrice: 249.99,
      discount: 60,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 89,
      endTime: '2024-12-31'
    },
    {
      id: 103,
      name: 'Mechanical Gaming Keyboard RGB',
      price: 79.99,
      originalPrice: 159.99,
      discount: 50,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop',
      rating: 4.4,
      reviews: 167,
      endTime: '2024-12-31'
    },
    {
      id: 104,
      name: 'Noise Cancelling Earbuds',
      price: 89.99,
      originalPrice: 179.99,
      discount: 50,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 445,
      endTime: '2024-12-31'
    },
    {
      id: 105,
      name: 'Ultra HD 4K Monitor 27"',
      price: 299.99,
      originalPrice: 549.99,
      discount: 45,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 156,
      endTime: '2024-12-31'
    },
    {
      id: 106,
      name: 'Wireless Gaming Mouse',
      price: 44.99,
      originalPrice: 89.99,
      discount: 50,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 234,
      endTime: '2024-12-31'
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
        <title>Hot Deals - NEXORA</title>
        <meta name="description" content="Amazing deals and discounts on premium products" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">🔥 Hot Deals</h1>
            <p className="text-xl mb-6">Up to 60% OFF on selected items!</p>
            <div className="inline-flex items-center bg-white/20 rounded-full px-6 py-2">
              <span className="text-lg">Limited Time Offer - Don't Miss Out!</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Deal'; e.target.onerror = null; }}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                    -{deal.discount}%
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{deal.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">{'★'.repeat(Math.floor(deal.rating))}</div>
                    <span className="text-sm text-gray-500 ml-2">({deal.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-red-600">${deal.price}</span>
                      <span className="text-lg text-gray-500 line-through ml-2">${deal.originalPrice}</span>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      Save ${(deal.originalPrice - deal.price).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(deal)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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

export default Deals