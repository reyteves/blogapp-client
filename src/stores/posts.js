import { defineStore } from 'pinia'
import api from '../api'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    currentPost: null,
    isLoading: false,
    error: null
  }),

  getters: {
    allPosts: (state) => state.posts,
    postById: (state) => (id) => state.posts.find(post => post._id === id),
    getPost: (state) => state.currentPost
  },

  actions: {
    async fetchPosts() {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get('/posts')
        this.posts = response.data
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch posts'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async fetchPost(id) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get(`/posts/${id}`)
        this.currentPost = response.data
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch post'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async createPost(postData) {
      this.isLoading = true
      try {
        const response = await api.post('/posts', postData)
        this.posts.unshift(response.data)
        return { success: true, data: response.data }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to create post'
        return { success: false, message }
      } finally {
        this.isLoading = false
      }
    },

    async updatePost(id, postData) {
      this.isLoading = true
      try {
        const response = await api.patch(`/posts/${id}`, postData)
        const index = this.posts.findIndex(post => post._id === id)
        if (index !== -1) {
          this.posts[index] = response.data
        }
        if (this.currentPost?._id === id) {
          this.currentPost = response.data
        }
        return { success: true, data: response.data }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to update post'
        return { success: false, message }
      } finally {
        this.isLoading = false
      }
    },

    async deletePost(id) {
      this.isLoading = true
      try {
        await api.delete(`/posts/${id}`)
        this.posts = this.posts.filter(post => post._id !== id)
        if (this.currentPost?._id === id) {
          this.currentPost = null
        }
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete post'
        return { success: false, message }
      } finally {
        this.isLoading = false
      }
    },

    clearCurrentPost() {
      this.currentPost = null
    }
  }
})
