<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <i class="bi bi-journal-text me-2"></i>Blog App
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">
              <i class="bi bi-house me-1"></i>Home
            </router-link>
          </li>
          <li v-if="authStore.isAuthenticated" class="nav-item">
            <router-link to="/create-post" class="nav-link">
              <i class="bi bi-plus-circle me-1"></i>Create Post
            </router-link>
          </li>
          <li v-if="authStore.isAuthenticated && !authStore.isAdmin" class="nav-item">
            <router-link to="/my-blogs" class="nav-link">
              <i class="bi bi-journal-bookmark me-1"></i>My Blogs
            </router-link>
          </li>
          <li v-if="authStore.isAdmin" class="nav-item">
            <router-link to="/admin" class="nav-link">
              <i class="bi bi-gear me-1"></i>Admin
            </router-link>
          </li>
        </ul>
        
        <ul class="navbar-nav">
          <li v-if="!authStore.isAuthenticated" class="nav-item">
            <router-link to="/login" class="nav-link">
              <i class="bi bi-box-arrow-in-right me-1"></i>Login
            </router-link>
          </li>
          <li v-if="!authStore.isAuthenticated" class="nav-item">
            <router-link to="/register" class="nav-link">
              <i class="bi bi-person-plus me-1"></i>Register
            </router-link>
          </li>
          <li v-if="authStore.isAuthenticated" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle me-1"></i>
              {{ authStore.currentUser?.username }}
              <span v-if="authStore.isAdmin" class="badge bg-warning text-dark ms-1">Admin</span>
            </a>
            <ul class="dropdown-menu">
              <li><router-link to="/create-post" class="dropdown-item">
                <i class="bi bi-plus-circle me-2"></i>Create Post
              </router-link></li>
              <li v-if="!authStore.isAdmin"><router-link to="/my-blogs" class="dropdown-item">
                <i class="bi bi-journal-bookmark me-2"></i>My Blogs
              </router-link></li>
              <li v-if="authStore.isAdmin"><router-link to="/admin" class="dropdown-item">
                <i class="bi bi-gear me-2"></i>Admin Dashboard
              </router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><router-link to="/logout" class="dropdown-item">
                <i class="bi bi-box-arrow-right me-2"></i>Logout
              </router-link></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Navbar',
  setup() {
    const authStore = useAuthStore()

    return {
      authStore
    }
  }
}
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
}

.nav-link {
  transition: all 0.3s ease;
}

.nav-link:hover {
  transform: translateY(-1px);
}

.dropdown-menu .dropdown-item {
  transition: all 0.2s ease;
}

.dropdown-menu .dropdown-item:hover {
  padding-left: 20px;
}
</style>
