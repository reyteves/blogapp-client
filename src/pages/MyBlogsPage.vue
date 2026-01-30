<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col">
        <h1>My Blogs</h1>
        <div class="d-flex justify-content-between align-items-center">
          <p class="text-muted">Manage your blog posts</p>
          <router-link to="/create-post" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>Create New Post
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="postsStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading your posts...</p>
    </div>

    <div v-else-if="userPosts.length === 0" class="text-center py-5">
      <i class="bi bi-journal-text display-1 text-muted"></i>
      <h3 class="mt-3">You haven't created any posts yet</h3>
      <p class="text-muted">Start sharing your thoughts with the community!</p>
      <router-link to="/create-post" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>Create Your First Post
      </router-link>
    </div>

    <div v-else class="row">
      <div v-for="post in userPosts" :key="post._id" class="col-md-6 col-lg-4 mb-4">
        <PostCard :post="post" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'
import PostCard from '../components/PostCard.vue'

export default {
  name: 'MyBlogsPage',
  components: {
    PostCard
  },
  setup() {
    const authStore = useAuthStore()
    const postsStore = usePostsStore()

    const userPosts = computed(() => {
      if (!authStore.currentUser) return []
      return postsStore.posts.filter(post => 
        post.author?._id === authStore.currentUser.id || 
        post.author?._id === authStore.currentUser._id
      )
    })

    onMounted(async () => {
      await postsStore.fetchPosts()
    })

    return {
      authStore,
      postsStore,
      userPosts
    }
  }
}
</script>

<style scoped>
.display-1 {
  font-size: 4rem;
}
</style>
