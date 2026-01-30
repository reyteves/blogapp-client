<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <div class="main-container">
        <router-view />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
  },
  setup() {
    const authStore = useAuthStore()

    onMounted(() => {
      // Initialize auth state on app load
      authStore.initializeAuth()
    })

    return {
      authStore,
    }
  },
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 20px;
  padding-bottom: 40px;
}

/* Container for centered content like Facebook feed */
.main-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 15px;
}

/* Global scrollbar styling is now in main.css */
</style>
