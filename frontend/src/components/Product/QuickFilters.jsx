import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'

const QuickFilters = ({ onFilterChange, activeFilters = {} }) => {
  const [showMore, setShowMore] = useState(false)

  const quickFilters = [
    { id: 'new', label: 'New Arrivals', icon: '✨' },
    { id: 'sale', label: 'On Sale', icon: '🔥' },
    { id: 'bestseller', label: 'Bestsellers', icon: '⭐' },
    { id: 'in-stock', label: 'In Stock', icon: '✓' },
    { id: 'free-shipping', label: 'Free Shipping', icon: '🚚' },
    { id: 'under-500', label: 'Under ₹500', icon: '💰' },
    { id: 'rated-4', label: '4+ Stars', icon: '⭐' },
    { id: 'fast-delivery', label: 'Fast Delivery', icon: '⚡' },
  ]

  const handleFilterToggle = (filterId) => {
    const newFilters = { ...activeFilters }
    if (newFilters[filterId]) {
      delete newFilters[filterId]
    } else {
      newFilters[filterId] = true
    }
    onFilterChange(newFilters)
  }

  const clearAll = () => {
    onFilterChange({})
  }

  const activeCount = Object.keys(activeFilters).length

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Quick Filters</h3>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FiX className="w-4 h-4" />
            Clear All ({activeCount})
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {quickFilters.slice(0, showMore ? quickFilters.length : 4).map((filter) => {
          const isActive = activeFilters[filter.id]
          return (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterToggle(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500'
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </motion.button>
          )
        })}
        
        {quickFilters.length > 4 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {showMore ? 'Show Less' : `+${quickFilters.length - 4} More`}
          </button>
        )}
      </div>
    </div>
  )
}

export default QuickFilters

