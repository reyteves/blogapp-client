import { defineStore } from 'pinia'
import api from '../api'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    comments: [],
    isLoading: false,
    error: null
  }),

  getters: {
    commentsByPostId: (state) => (postId) => 
      state.comments.filter(comment => comment.post === postId),
    allComments: (state) => state.comments
  },

  actions: {
    async fetchComments(postId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get(`/comments/post/${postId}`)
        this.comments = response.data
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch comments'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async addComment(commentData) {
      this.isLoading = true
      try {
        console.log('Sending comment data:', JSON.stringify(commentData, null, 2))
        const response = await api.post('/comments', commentData)
        console.log('Comment added successfully:', response.data)
        this.comments.unshift(response.data)
        return { success: true, data: response.data }
      } catch (error) {
        console.error('Error adding comment:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data
          }
        })
        const message = error.response?.data?.message || 'Failed to add comment'
        return { success: false, message }
      } finally {
        this.isLoading = false
      }
    },

    async deleteComment(id) {
      this.isLoading = true
      try {
        await api.delete(`/comments/${id}`)
        this.comments = this.comments.filter(comment => comment._id !== id)
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete comment'
        return { success: false, message }
      } finally {
        this.isLoading = false
      }
    },

    clearComments() {
      this.comments = []
    }
  }
})
