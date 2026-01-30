import { defineStore } from 'pinia'
import api from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => {
      // Check if user is admin based on email or isAdmin flag
      return state.user?.isAdmin === true || 
             state.user?.role === 'admin' || 
             state.user?.email === 'admin@example.com'
    },
    currentUser: (state) => state.user
  },

  actions: {
    async register(userData) {
      this.isLoading = true
      try {
        const response = await api.post('/users/register', userData)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Registration failed' 
        }
      } finally {
        this.isLoading = false
      }
    },

    async login(credentials) {
      this.isLoading = true
      try {
        const response = await api.post('/users/login', credentials)
        const { access: token } = response.data
        
        // Extract user info from JWT token
        const tokenPayload = JSON.parse(atob(token.split('.')[1]))
        const user = {
          id: tokenPayload.id,
          email: tokenPayload.email,
          isAdmin: tokenPayload.isAdmin
        }
        
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return { success: true }
      } catch (error) {
        console.error('Login error:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || 'Login failed' 
        }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user && user !== 'undefined') {
        this.token = token
        try {
          this.user = JSON.parse(user)
        } catch (error) {
          console.error('Error parsing user data:', error)
          this.user = null
          localStorage.removeItem('user')
        }
      } else {
        // Clear any invalid data
        if (!token) {
          localStorage.removeItem('token')
        }
        if (!user || user === 'undefined') {
          localStorage.removeItem('user')
        }
      }
    }
  }
})
