import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('nexora_cart');
    if (serializedCart === null) {
      return {
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        itemCount: 0,
        isOpen: false
      };
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    console.error('Error loading cart from storage:', err);
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      itemCount: 0,
      isOpen: false
    };
  }
};

// Save cart to localStorage
const saveCartToStorage = (state) => {
  try {
    const serializedCart = JSON.stringify(state);
    localStorage.setItem('nexora_cart', serializedCart);
  } catch (err) {
    console.error('Could not save cart', err);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price || action.payload.basePrice || 0,
          image: action.payload.image || action.payload.images?.[0] || null,
          category: action.payload.category?.name || action.payload.category || '',
          quantity: action.payload.quantity || 1
        });
      }
      
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state);
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.shipping = 0;
      state.total = 0;
      state.itemCount = 0;
      saveCartToStorage(state);
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    calculateTotals: (state) => {
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.subtotal = state.items.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
      }, 0);
      
      // Free shipping over $100
      state.shipping = state.subtotal >= 100 ? 0 : 10;
      
      // 10% tax
      state.tax = state.subtotal * 0.1;
      
      // Calculate total
      state.total = state.subtotal + state.shipping + state.tax;
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  toggleCart,
  calculateTotals 
} = cartSlice.actions;

export default cartSlice.reducer;
