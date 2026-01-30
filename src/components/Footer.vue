<template>
  <footer class="text-light py-4 mt-5" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h5><i class="bi bi-journal-text me-2"></i>Blog Application</h5>
          <p class="text-light">A modern blog application built with Vue.js and Node.js</p>
        </div>
        <div class="col-md-6">
          <h5>Quick Links</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <router-link to="/" class="text-light text-decoration-none">
                <i class="bi bi-house me-2"></i>Home
              </router-link>
            </li>
            <li v-if="authStore.isAuthenticated" class="mb-2">
              <router-link to="/create-post" class="text-light text-decoration-none">
                <i class="bi bi-plus-circle me-2"></i>Create Post
              </router-link>
            </li>
            <li v-if="authStore.isAdmin" class="mb-2">
              <router-link to="/admin" class="text-light text-decoration-none">
                <i class="bi bi-gear me-2"></i>Admin Dashboard
              </router-link>
            </li>
            <li v-if="!authStore.isAuthenticated" class="mb-2">
              <router-link to="/login" class="text-light text-decoration-none">
                <i class="bi bi-box-arrow-in-right me-2"></i>Login
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <hr class="bg-secondary">
      <div class="row">
        <div class="col-12 text-center">
          <p class="mb-0 text-light">
            &copy; {{ currentYear }} Blog Application. All rights reserved.
          </p>
        </div>
      </div>
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
      currentYear
    }
  }
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
