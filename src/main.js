import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Swal from 'sweetalert2'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import custom styles
import './assets/main.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Make Swal globally available
app.config.globalProperties.$swal = Swal

// Initialize auth store
const authStore = useAuthStore(pinia)
authStore.initializeAuth()

app.mount('#app')
