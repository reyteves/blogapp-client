<template>
  <div class="row justify-content-center mt-lg-5">
    <div class="col-md-8 col-lg-6">
      <div class="card card-fb border-0 shadow-lg">
        <div class="card-body p-4 p-md-5">
          <div class="text-center mb-4">
            <i class="bi bi-journal-plus text-primary" style="font-size: 3.5rem"></i>
            <h2 class="fw-bold mt-2">Create Account</h2>
            <p class="text-secondary">Join our community of writers today.</p>
          </div>

          <form @submit.prevent="handleRegister">
            <div class="row g-3 mb-3">
              <div class="col-12">
                <label for="username" class="form-label fw-600">Username</label>
                <input
                  type="text"
                  class="form-control form-control-fb py-2 px-3"
                  id="username"
                  placeholder="johndoe"
                  v-model="form.username"
                  required
                />
              </div>
            </div>
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
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label for="password" class="form-label fw-600">Password</label>
                <input
                  type="password"
                  class="form-control form-control-fb py-2 px-3"
                  id="password"
                  placeholder="••••••••"
                  v-model="form.password"
                  required
                  minlength="6"
                />
              </div>
              <div class="col-md-6">
                <label for="confirmPassword" class="form-label fw-600">Confirm</label>
                <input
                  type="password"
                  class="form-control form-control-fb py-2 px-3"
                  id="confirmPassword"
                  placeholder="••••••••"
                  v-model="form.confirmPassword"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              class="btn btn-primary w-100 py-2 fw-bold"
              :disabled="authStore.isLoading"
            >
              <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
              Sign Up
            </button>
          </form>

          <div class="text-center mt-4 pt-3 border-top">
            <p class="mb-0">
              Already have an account?
              <router-link to="/login" class="text-primary fw-bold text-decoration-none"
                >Log In</router-link
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Swal from 'sweetalert2'

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const form = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    })

    const handleRegister = async () => {
      const { username, email, password } = form.value

      if (password !== form.value.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Passwords do not match',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        })
        return
      }

      // Cleanup payload to ensure only required fields are sent
      const payload = {
        username: username.trim(),
        email: email.trim(),
        password
      }
      
      const result = await authStore.register(payload)

      if (result.success) {
        if (result.loggedIn) {
          Swal.fire({
            icon: 'success',
            title: 'Welcome!',
            text: 'Registration successful and you are logged in.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          })
          router.push('/')
        } else {
          // If the backend doesn't return a token, we must ask the user to login
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Registration successful! Please login to continue.',
            confirmButtonColor: '#0866ff',
          }).then(() => {
            router.push('/login')
          })
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: result.message || 'An error occurred during registration.',
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
      handleRegister,
    }
  },
}
</script>
