import api from './api'

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Logout user
  logout: async (data) => {
    const response = await api.post('/auth/logout', data)
    return response.data
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Refresh access token
  refreshToken: async (data) => {
    const response = await api.post('/auth/refresh', data)
    return response.data
  },

  // Forgot password
  forgotPassword: async (data) => {
    const response = await api.post('/auth/forgot-password', data)
    return response.data
  },

  // Reset password
  resetPassword: async (token, data) => {
    const response = await api.put(`/auth/reset-password/${token}`, data)
    return response.data
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`)
    return response.data
  },
}

export default authService