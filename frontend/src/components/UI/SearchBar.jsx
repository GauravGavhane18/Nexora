import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      console.log('Searching for:', query)
      // TODO: Implement search functionality
      if (onClose) onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-input pl-10 pr-4 w-full"
          placeholder="Search products..."
        />
      </div>
    </form>
  )
}

export default SearchBar