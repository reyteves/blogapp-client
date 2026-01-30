<template>
  <footer class="py-5 bg-white border-top mt-5">
    <div class="container text-center text-secondary small">
      <p class="mb-1 text-dark fw-bold">BlogApp</p>
      <p class="mb-3">Connect with the world of writers.</p>
      <div class="d-flex justify-content-center gap-3 mb-4">
        <router-link to="/" class="text-secondary text-decoration-none">Home</router-link>
        <router-link
          v-if="authStore.isAuthenticated"
          to="/create-post"
          class="text-secondary text-decoration-none"
          >Create Post</router-link
        >
        <router-link
          v-if="authStore.isAdmin"
          to="/admin"
          class="text-secondary text-decoration-none"
          >Admin</router-link
        >
      </div>
      <p class="mb-0">&copy; {{ currentYear }} BlogApp. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Footer',
  setup() {
    const authStore = useAuthStore()
    const currentYear = computed(() => new Date().getFullYear())

    return {
      authStore,
      currentYear,
    }
  },
}
</script>

<style scoped>
footer {
  margin-top: auto;
}

footer a {
  transition: all 0.3s ease;
}

footer a:hover {
  color: #fff !important;
  transform: translateX(3px);
  display: inline-block;
}
</style>
