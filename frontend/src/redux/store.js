import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import cartSlice from './slices/cartSlice'
import productSlice from './slices/productSlice'
import categorySlice from './slices/categorySlice'
import orderSlice from './slices/orderSlice'
import subscriptionSlice from './slices/subscriptionSlice'
import uiSlice from './slices/uiSlice'
import wishlistSlice from './slices/wishlistSlice'
import themeSlice from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    products: productSlice,
    categories: categorySlice,
    orders: orderSlice,
    subscriptions: subscriptionSlice,
    ui: uiSlice,
    wishlist: wishlistSlice,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})