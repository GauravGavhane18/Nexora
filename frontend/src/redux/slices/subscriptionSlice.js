import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  plans: [],
  currentPlan: null,
  userSubscription: null,
  loading: false,
  error: null
}

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    setPlans: (state, action) => {
      state.plans = action.payload
      state.loading = false
      state.error = null
    },
    
    setCurrentPlan: (state, action) => {
      state.currentPlan = action.payload
      state.loading = false
      state.error = null
    },
    
    setUserSubscription: (state, action) => {
      state.userSubscription = action.payload
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
  setPlans,
  setCurrentPlan,
  setUserSubscription,
  setError,
  clearError
} = subscriptionSlice.actions

export default subscriptionSlice.reducer