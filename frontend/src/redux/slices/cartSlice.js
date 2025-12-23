import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  itemCount: 0,
  isOpen: false
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1
        })
      }
      
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      
      if (item) {
        item.quantity = quantity
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id)
        }
      }
      
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    clearCart: (state) => {
      state.items = []
      state.subtotal = 0
      state.tax = 0
      state.shipping = 0
      state.total = 0
      state.itemCount = 0
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    
    calculateTotals: (state) => {
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
      state.subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      state.shipping = state.subtotal > 100 ? 0 : 9.99
      state.tax = state.subtotal * 0.08 // 8% tax
      state.total = state.subtotal + state.shipping + state.tax
    }
  }
})

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  toggleCart,
  calculateTotals 
} = cartSlice.actions

export default cartSlice.reducer