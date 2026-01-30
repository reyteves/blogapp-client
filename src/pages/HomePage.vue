<template>
  <div class="mt-2">
    <!-- What's on your mind? Section -->
    <div v-if="authStore.isAuthenticated" class="card card-fb p-3 mb-3">
      <div class="d-flex align-items-center mb-3">
        <div class="fb-avatar-container">
          <i
            :class="
              authStore.user?.isAdmin ||
              authStore.user?.role === 'admin' ||
              authStore.user?.email === 'admin@example.com'
                ? 'bi bi-gear-fill'
                : 'bi bi-chat'
            "
          ></i>
        </div>
        <router-link
          to="/create-post"
          class="form-control text-start text-muted text-decoration-none"
        >
          What's on your mind, {{ authStore.currentUser?.username }}?
        </router-link>
      </div>
      <hr class="m-0 mb-2" />
      <div class="d-flex justify-content-around">
        <router-link to="/create-post" class="btn btn-fb-action flex-grow-1">
          <i class="bi bi-pencil-fill text-primary"></i> <span>Create Post</span>
        </router-link>
      </div>
    </div>

    <!-- Feed Content -->
    <div v-if="postsStore.isLoading" class="text-center py-5 card card-fb">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading your feed...</p>
    </div>

    <div v-else-if="postsStore.posts.length === 0" class="text-center py-5 card card-fb">
      <i class="bi bi-journal-text display-1 text-muted"></i>
      <h3 class="mt-3">No posts yet</h3>
      <p class="text-muted">Follow some people or be the first to share something!</p>
      <router-link v-if="authStore.isAuthenticated" to="/create-post" class="btn btn-primary mt-2">
        Create Your First Post
      </router-link>
    </div>

    <div v-else class="feed-container">
      <div v-for="post in postsStore.posts" :key="post._id">
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
    PostCard,
  },
  setup() {
    const authStore = useAuthStore()
    const postsStore = usePostsStore()

    onMounted(async () => {
      await postsStore.fetchPosts()
    })

    return {
      authStore,
      postsStore,
    }
  },
}
</script>
