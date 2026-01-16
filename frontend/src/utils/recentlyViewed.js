// Utility for managing recently viewed products
const STORAGE_KEY = 'nexora_recently_viewed'
const MAX_ITEMS = 10

export const addToRecentlyViewed = (product) => {
  if (!product || !product._id) return

  try {
    const recent = getRecentlyViewed()
    // Remove if already exists
    const filtered = recent.filter(p => p._id !== product._id)
    // Add to beginning
    const updated = [
      {
        _id: product._id,
        name: product.name,
        image: product.images?.[0]?.url || product.images?.[0],
        price: product.basePrice,
        slug: product.slug
      },
      ...filtered
    ].slice(0, MAX_ITEMS)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving recently viewed:', error)
  }
}

export const getRecentlyViewed = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting recently viewed:', error)
    return []
  }
}

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing recently viewed:', error)
  }
}

