<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div v-if="postsStore.isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Loading post...</p>
        </div>

        <div v-else-if="!postsStore.currentPost" class="card">
          <div class="card-body text-center">
            <i class="bi bi-journal-x display-1 text-muted"></i>
            <h3 class="mt-3">Post not found</h3>
            <p class="text-muted">The post you're trying to edit doesn't exist.</p>
            <router-link to="/" class="btn btn-primary">Back to Home</router-link>
          </div>
        </div>

        <div v-else-if="!canEditPost" class="card">
          <div class="card-body text-center">
            <i class="bi bi-shield-x display-1 text-muted"></i>
            <h3 class="mt-3">Access Denied</h3>
            <p class="text-muted">You don't have permission to edit this post.</p>
            <router-link to="/" class="btn btn-primary">Back to Home</router-link>
          </div>
        </div>

        <div v-else class="card">
          <div class="card-header">
            <h3>Edit Post</h3>
          </div>
          <div class="card-body">
            <PostForm 
              @submit="handleUpdatePost" 
              :loading="postsStore.isLoading"
              :initial-data="postsStore.currentPost"
              :is-edit="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'
import PostForm from '../components/PostForm.vue'

export default {
  name: 'EditPostPage',
  components: {
    PostForm
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const postsStore = usePostsStore()
    const instance = getCurrentInstance()
    const Swal = instance.appContext.config.globalProperties.$swal

    const canEditPost = computed(() => {
      if (!authStore.isAuthenticated || !postsStore.currentPost) return false
      return authStore.currentUser?.id === postsStore.currentPost.author?._id || authStore.currentUser?._id === postsStore.currentPost.author?._id || authStore.isAdmin
    })

    const handleUpdatePost = async (formData) => {
      const result = await postsStore.updatePost(postsStore.currentPost._id, formData)
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Post updated successfully!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
        router.push(`/post/${result.data._id}`)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
      }
    }

    onMounted(async () => {
      const postId = route.params.id
      await postsStore.fetchPost(postId)
    })

    return {
      authStore,
      postsStore,
      canEditPost,
      handleUpdatePost
    }
  }
}
</script>
