<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col">
        <h1>Blog Posts</h1>
        <div class="d-flex justify-content-between align-items-center">
          <p class="text-muted">Welcome to our blog application!</p>
          <router-link v-if="authStore.isAuthenticated" to="/create-post" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>Create Post
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="postsStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading posts...</p>
    </div>

    <div v-else-if="postsStore.posts.length === 0" class="text-center py-5">
      <i class="bi bi-journal-text display-1 text-muted"></i>
      <h3 class="mt-3">No posts yet</h3>
      <p class="text-muted">Be the first to create a post!</p>
    </div>

    <div v-else class="row">
      <div v-for="post in postsStore.posts" :key="post._id" class="col-md-6 col-lg-4 mb-4">
        <PostCard :post="post" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'
import PostCard from '../components/PostCard.vue'

export default {
  name: 'HomePage',
  components: {
    PostCard
  },
  setup() {
    const authStore = useAuthStore()
    const postsStore = usePostsStore()

    onMounted(async () => {
      await postsStore.fetchPosts()
    })

    return {
      authStore,
      postsStore
    }
  }
}
</script>
