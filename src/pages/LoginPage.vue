<template>
  <div class="row justify-content-center mt-lg-5">
    <div class="col-md-8 col-lg-6">
      <div class="card card-fb border-0 shadow-lg">
        <div class="card-body p-4 p-md-5">
          <div class="text-center mb-4">
            <i class="bi bi-journal-text text-primary" style="font-size: 3.5rem"></i>
            <h2 class="fw-bold mt-2">Login to BlogApp</h2>
            <p class="text-secondary">Welcome back! Please enter your details.</p>
          </div>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label fw-600">Email Address</label>
              <input
                type="email"
                class="form-control form-control-fb py-2 px-3"
                id="email"
                placeholder="name@example.com"
                v-model="form.email"
                required
              />
            </div>
            <div class="mb-4">
              <label for="password" class="form-label fw-600">Password</label>
              <input
                type="password"
                class="form-control form-control-fb py-2 px-3"
                id="password"
                placeholder="••••••••"
                v-model="form.password"
                required
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary w-100 py-2 fw-bold"
              :disabled="authStore.isLoading"
            >
              <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
              Log In
            </button>
          </form>

          <div class="text-center mt-4 pt-3 border-top">
            <p class="mb-0">
              Don't have an account?
              <router-link to="/register" class="text-primary fw-bold text-decoration-none"
                >Create Account</router-link
              >
            </p>
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
      password: '',
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
          timer: 3000,
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
          timer: 3000,
        })
      }
    }

    return {
      form,
      authStore,
      handleLogin,
    }
  },
}
</script>
