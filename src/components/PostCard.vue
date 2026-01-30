<template>
  <div class="card h-100">
    <div class="card-body">
      <h5 class="card-title">{{ post.title }}</h5>
      <p class="card-text text-muted small">
        By {{ post.author?.username || 'Unknown' }} 
        on {{ formatDate(post.creationDate) }}
      </p>
      <div class="card-text" v-html="truncateContent(post.content)"></div>
    </div>
    <div class="card-footer bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <router-link :to="`/post/${post._id}`" class="btn btn-outline-primary btn-sm">
          Read More
        </router-link>
        <div v-if="canEditPost">
          <router-link :to="`/edit-post/${post._id}`" class="btn btn-outline-secondary btn-sm me-2">
            <i class="bi bi-pencil"></i>
          </router-link>
          <button @click="deletePost" class="btn btn-outline-danger btn-sm">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'

export default {
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const authStore = useAuthStore()
    const postsStore = usePostsStore()
    const instance = getCurrentInstance()
    const Swal = instance.appContext.config.globalProperties.$swal

    const canEditPost = computed(() => {
      if (!authStore.isAuthenticated) return false
      return authStore.currentUser?.id === props.post.author?._id || authStore.currentUser?._id === props.post.author?._id || authStore.isAdmin
    })

    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown date'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const truncateContent = (content) => {
      if (!content) return ''
      const plainText = content.replace(/<[^>]*>/g, '')
      return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
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
        try {
          const deleteResult = await postsStore.deletePost(props.post._id)
          
          if (deleteResult.success) {
            await Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Your post has been deleted.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            })
            // Refresh the posts list after deletion
            await postsStore.fetchPosts()
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to delete post',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          })
        }
      }
    }

    return {
      authStore,
      canEditPost,
      formatDate,
      truncateContent,
      deletePost
    }
  }
}
</script>
