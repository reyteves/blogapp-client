<template>
  <nav class="navbar navbar-expand-lg sticky-top">
    <div class="container px-md-4">
      <router-link to="/" class="navbar-brand">
        <i class="bi bi-journal-text"></i>
      </router-link>

      <!-- Nav Items for Desktop (Centered-ish) -->
      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <div class="navbar-nav gap-1">
          <router-link to="/" class="nav-link" active-class="active">
            <i class="bi bi-house-door fs-5"></i>
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated"
            to="/create-post"
            class="nav-link"
            active-class="active"
          >
            <i class="bi bi-plus-square fs-5"></i>
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated && !authStore.isAdmin"
            to="/my-blogs"
            class="nav-link"
            active-class="active"
          >
            <i class="bi bi-journal-bookmark fs-5"></i>
          </router-link>
          <router-link v-if="authStore.isAdmin" to="/admin" class="nav-link" active-class="active">
            <i class="bi bi-gear fs-5"></i>
          </router-link>
        </div>
      </div>

      <!-- Auth Items (Right Side) -->
      <div class="d-flex align-items-center">
        <div v-if="!authStore.isAuthenticated" class="navbar-nav flex-row gap-2">
          <router-link to="/login" class="nav-link py-2 px-3 border rounded"> Login </router-link>
          <router-link
            to="/register"
            class="nav-link py-2 px-3 bg-primary text-white border-0 rounded"
          >
            Register
          </router-link>
        </div>

        <div v-else class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle d-flex align-items-center p-1"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
          >
            <div class="fb-avatar-container" style="width: 32px; height: 32px; margin-right: 0">
              <i
                :class="authStore.isAdmin ? 'bi bi-gear-fill' : 'bi bi-chat'"
                style="font-size: 1rem"
              ></i>
            </div>
          </a>
          <ul class="dropdown-menu dropdown-menu-end shadow">
            <li>
              <div class="dropdown-header d-flex flex-column">
                <span class="fw-bold text-dark">{{ authStore.currentUser?.username }}</span>
                <span v-if="authStore.isAdmin" class="badge bg-warning text-dark w-fit mt-1"
                  >Admin</span
                >
              </div>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <router-link to="/create-post" class="dropdown-item py-2">
                <i class="bi bi-plus-circle me-2"></i>Create Post
              </router-link>
            </li>
            <li v-if="!authStore.isAdmin">
              <router-link to="/my-blogs" class="dropdown-item py-2">
                <i class="bi bi-journal-bookmark me-2"></i>My Blogs
              </router-link>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <router-link to="/logout" class="dropdown-item py-2 text-danger">
                <i class="bi bi-box-arrow-right me-2"></i>Logout
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Mobile Toggler -->
        <button
          class="navbar-toggler ms-2 border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
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
      authStore,
    }
  },
}
</script>

<style scoped>
.navbar-brand i {
  font-size: 2rem;
}

.w-fit {
  width: fit-content;
}

.dropdown-menu {
  border: none;
  min-width: 200px;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    padding: 10px 0;
  }
}
</style>
