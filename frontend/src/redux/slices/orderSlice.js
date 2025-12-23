import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    setOrders: (state, action) => {
      state.orders = action.payload
      state.loading = false
      state.error = null
    },
    
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload
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
  setOrders,
  setCurrentOrder,
  setError,
  clearError
} = orderSlice.actions

export default orderSlice.reducer