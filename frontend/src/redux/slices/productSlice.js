import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    sortBy: 'newest'
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  }
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    setProducts: (state, action) => {
      state.products = action.payload
      state.loading = false
      state.error = null
    },
    
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload
      state.loading = false
      state.error = null
    },
    
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    
    clearError: (state) => {
      state.error = null
    }
  }
})

export const {
  setLoading,
  setProducts,
  setCurrentProduct,
  setError,
  updateFilters,
  updatePagination,
  clearError
} = productSlice.actions

export default productSlice.reducer