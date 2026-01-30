<template>
  <div class="container mt-4">
    <div v-if="postsStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading post...</p>
    </div>

    <div v-else-if="!postsStore.currentPost" class="text-center py-5">
      <i class="bi bi-journal-x display-1 text-muted"></i>
      <h3 class="mt-3">Post not found</h3>
      <p class="text-muted">The post you're looking for doesn't exist.</p>
      <router-link to="/" class="btn btn-primary">Back to Home</router-link>
    </div>

    <div v-else>
      <div class="row">
        <div class="col-md-8">
          <article class="card">
            <div class="card-header">
              <h2>{{ postsStore.currentPost.title }}</h2>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <small class="text-muted">
                  By {{ postsStore.currentPost.author?.username || 'Unknown' }} 
                  on {{ formatDate(postsStore.currentPost.creationDate) }}
                </small>
                <div v-if="canEditPost">
                  <router-link :to="`/edit-post/${postsStore.currentPost._id}`" class="btn btn-sm btn-outline-primary me-2">
                    <i class="bi bi-pencil"></i> Edit
                  </router-link>
                  <button @click="deletePost" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="post-content" v-html="postsStore.currentPost.content"></div>
            </div>
          </article>

          <!-- Comments Section -->
          <div class="card mt-4">
            <div class="card-header">
              <h4>Comments ({{ commentsStore.comments.length }})</h4>
            </div>
            <div class="card-body">
              <!-- Add Comment Form -->
              <div v-if="authStore.isAuthenticated" class="mb-4">
                <form @submit.prevent="addComment">
                  <div class="mb-3">
                    <textarea
                      class="form-control"
                      rows="3"
                      placeholder="Write a comment..."
                      v-model="newComment"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary" :disabled="commentsStore.isLoading">
                    <span v-if="commentsStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Add Comment
                  </button>
                </form>
              </div>
              <div v-else class="mb-4">
                <p class="text-muted">Please <router-link to="/login">login</router-link> to add comments.</p>
              </div>

              <!-- Comments List -->
              <div v-if="commentsStore.isLoading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div v-else-if="commentsStore.comments.length === 0" class="text-center py-3 text-muted">
                No comments yet. Be the first to comment!
              </div>
              <div v-else>
                <CommentCard 
                  v-for="comment in commentsStore.comments" 
                  :key="comment._id" 
                  :comment="comment" 
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5>Navigation</h5>
            </div>
            <div class="card-body">
              <router-link to="/" class="btn btn-outline-primary w-100 mb-2">
                <i class="bi bi-arrow-left me-2"></i>Back to Posts
              </router-link>
              <router-link v-if="authStore.isAuthenticated" to="/create-post" class="btn btn-primary w-100">
                <i class="bi bi-plus-circle me-2"></i>Create Post
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'
import { useCommentsStore } from '../stores/comments'
import CommentCard from '../components/CommentCard.vue'

export default {
  name: 'ViewPostPage',
  components: {
    CommentCard
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const postsStore = usePostsStore()
    const commentsStore = useCommentsStore()
    const instance = getCurrentInstance()
    const Swal = instance.appContext.config.globalProperties.$swal
    
    const newComment = ref('')

    const canEditPost = computed(() => {
      if (!authStore.isAuthenticated || !postsStore.currentPost) {
        console.log('Not authenticated or no post data')
        return false
      }
      
      const currentUserId = authStore.currentUser?._id
      const postAuthorId = postsStore.currentPost.author?._id || postsStore.currentPost.author
      const isAuthor = currentUserId === postAuthorId
      
      return isAuthor || authStore.isAdmin
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const addComment = async () => {
      const result = await commentsStore.addComment({
        content: newComment.value,
        blogPostId: postsStore.currentPost._id
      })
      
      if (result.success) {
        newComment.value = ''
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Comment added!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
      }
    }

    const deletePost = async () => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      })

      if (result.isConfirmed) {
        const deleteResult = await postsStore.deletePost(postsStore.currentPost._id)
        
        if (deleteResult.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your post has been deleted.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          })
          router.push('/')
        }
      }
    }

    onMounted(async () => {
      const postId = route.params.id
      console.log('Attempting to fetch post with ID:', postId)
      try {
        const result = await postsStore.fetchPost(postId)
        console.log('Fetch result:', result)
        console.log('Current post data:', postsStore.currentPost)
        
        if (!result.success) {
          console.error('Failed to fetch post:', result.message)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.message || 'Failed to load post'
          })
        }
        
        // Also fetch comments if post was loaded successfully
        if (result.success && postsStore.currentPost) {
          await commentsStore.fetchComments(postId)
        }
      } catch (error) {
        console.error('Error loading post data:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while loading the post'
        })
      }
    })

    // Return all the necessary values and methods
    return {
      route,
      authStore,
      postsStore,
      commentsStore,
      newComment,
      canEditPost,
      formatDate,
      addComment,
      deletePost
    }
  }
}
</script>
