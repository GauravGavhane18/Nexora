import { createSlice } from '@reduxjs/toolkit'

const loadWishlistFromStorage = () => {
  try {
    const serialized = localStorage.getItem('wishlist')
    return serialized ? JSON.parse(serialized) : []
  } catch (err) {
    console.error('Error loading wishlist from storage:', err)
    return []
  }
}

const initialState = {
  items: loadWishlistFromStorage(),
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find(item => item.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
        localStorage.setItem('wishlist', JSON.stringify(state.items))
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    },
    clearWishlist: (state) => {
      state.items = []
      localStorage.removeItem('wishlist')
    },
  },
})

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
