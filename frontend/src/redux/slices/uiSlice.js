import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  sidebarOpen: false,
  mobileMenuOpen: false,
  loading: false,
  notifications: [],
  modals: {
    login: false,
    cart: false,
    search: false
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload
      })
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    
    toggleModal: (state, action) => {
      const { modal } = action.payload
      state.modals[modal] = !state.modals[modal]
    },
    
    setModal: (state, action) => {
      const { modal, isOpen } = action.payload
      state.modals[modal] = isOpen
    }
  }
})

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  setLoading,
  addNotification,
  removeNotification,
  toggleModal,
  setModal
} = uiSlice.actions

export default uiSlice.reducer