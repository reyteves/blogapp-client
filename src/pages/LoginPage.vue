<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Login</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="form.email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="form.password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="authStore.isLoading">
                <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
                Login
              </button>
            </form>
            <div class="text-center mt-3">
              <p>Don't have an account? <router-link to="/register">Register</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const instance = getCurrentInstance()
    const Swal = instance.appContext.config.globalProperties.$swal
    
    const form = ref({
      email: '',
      password: ''
    })

    const handleLogin = async () => {
      const result = await authStore.login(form.value)
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Login successful!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
        router.push('/')
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

    return {
      form,
      authStore,
      handleLogin
    }
  }
}
</script>
