import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    setCategories: (state, action) => {
      state.categories = action.payload
      state.loading = false
      state.error = null
    },
    
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload
      state.loading = false
      state.error = null
    },
    
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    
    clearError: (state) => {
      state.error = null
    }
  }
})

export const {
  setLoading,
  setCategories,
  setCurrentCategory,
  setError,
  clearError
} = categorySlice.actions

export default categorySlice.reducer