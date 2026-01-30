import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Import page components
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import LogoutPage from '../pages/LogoutPage.vue'
import ViewPostPage from '../pages/ViewPostPage.vue'
import CreatePostPage from '../pages/CreatePostPage.vue'
import EditPostPage from '../pages/EditPostPage.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'
import MyBlogsPage from '../pages/MyBlogsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/post/:id',
      name: 'view-post',
      component: ViewPostPage
    },
    {
      path: '/create-post',
      name: 'create-post',
      component: CreatePostPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit-post/:id',
      name: 'edit-post',
      component: EditPostPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/my-blogs',
      name: 'my-blogs',
      component: MyBlogsPage,
      meta: { requiresAuth: true, requiresRegularUser: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: HomePage
    }
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state if not already done
  if (!authStore.user && authStore.token) {
    authStore.initializeAuth()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  // Check if route requires admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
    return
  }

  // Check if route requires regular user (not admin)
  if (to.meta.requiresRegularUser && authStore.isAdmin) {
    next({ name: 'admin' })
    return
  }

  next()
})

export default router
