<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body text-center">
            <h3>Logging out...</h3>
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'LogoutPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const instance = getCurrentInstance()
    const Swal = instance.appContext.config.globalProperties.$swal

    onMounted(() => {
      authStore.logout()
      
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      })

      setTimeout(() => {
        router.push('/login')
      }, 1000)
    })

    return {}
  }
}
</script>
