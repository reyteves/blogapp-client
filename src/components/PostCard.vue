<template>
  <div class="card card-fb">
    <!-- Header -->
    <div class="fb-post-header">
      <div class="fb-avatar-container">
        <i
          :class="
            post.author?.role === 'admin' ||
            post.author?.isAdmin ||
            post.author?.email === 'admin@example.com'
              ? 'bi bi-gear-fill'
              : 'bi bi-chat'
          "
        ></i>
      </div>
      <div class="flex-grow-1">
        <p class="fb-post-author d-flex align-items-center">
          {{ post.author?.username || 'Unknown' }}
          <span
            v-if="post.author?.role === 'admin' || post.author?.isAdmin || post.author?.email === 'admin@example.com'"
            class="badge bg-danger ms-2"
            style="font-size: 0.65rem"
            >ADMIN</span
          >
        </p>
        <p class="fb-post-date">
          {{ formatDate(post.creationDate) }} · <i class="bi bi-globe-americas"></i>
        </p>
      </div>
      <!-- Edit/Delete Actions for Owners/Admins -->
      <div v-if="canEditPost" class="dropdown">
        <button
          class="btn btn-fb-secondary btn-sm rounded-circle px-2"
          type="button"
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-three-dots"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow">
          <li>
            <router-link :to="`/edit-post/${post._id}`" class="dropdown-item py-2">
              <i class="bi bi-pencil me-2"></i>Edit Post
            </router-link>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <button @click="deletePost" class="dropdown-item py-2 text-danger">
              <i class="bi bi-trash me-2"></i>Delete Post
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Body -->
    <div class="card-fb-body p-3 pt-0">
      <h5 class="fw-bold mb-2">{{ post.title }}</h5>
      <div class="post-content text-dark" v-html="truncateContent(post.content)"></div>
      <div v-if="post.tags && post.tags.length" class="mt-2">
        <span v-for="tag in post.tags" :key="tag" class="text-primary small me-2">#{{ tag }}</span>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="border-top mx-3"></div>
    <div class="d-flex justify-content-around p-1">
      <router-link :to="`/post/${post._id}`" class="btn btn-fb-action">
        <i class="bi bi-eye"></i> <span>View</span>
      </router-link>
      <router-link
        :to="{ path: `/post/${post._id}`, query: { focus: 'true' } }"
        class="btn btn-fb-action"
      >
        <i class="bi bi-chat"></i> <span>Comment</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'

export default {
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const authStore = useAuthStore()
    const postsStore = usePostsStore()
    const instance = getCurrentInstance()
    const Swal = instance.appContext.config.globalProperties.$swal

    const canEditPost = computed(() => {
      if (!authStore.isAuthenticated) return false
      const currentUserId = authStore.currentUser?.id || authStore.currentUser?._id
      const postAuthorId = props.post.author?._id || props.post.author
      return currentUserId === postAuthorId || authStore.isAdmin
    })

    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown date'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    const truncateContent = (content) => {
      if (!content) return ''
      const plainText = content.replace(/<[^>]*>/g, '')
      return plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText
    }

    const deletePost = async () => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      })

      if (result.isConfirmed) {
        try {
          const deleteResult = await postsStore.deletePost(props.post._id)

          if (deleteResult.success) {
            await Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Your post has been deleted.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
            })
            // Refresh the posts list after deletion
            await postsStore.fetchPosts()
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to delete post',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          })
        }
      }
    }

    return {
      authStore,
      canEditPost,
      formatDate,
      truncateContent,
      deletePost,
    }
  },
}
</script>

<style scoped>
.btn-fb-action {
  flex: 1;
  background: transparent;
  color: var(--fb-text-secondary);
  border-radius: 4px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  transition: var(--transition);
}

.btn-fb-action:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--fb-text-secondary);
}

.fb-post-date {
  line-height: 1;
}

.dropdown-menu {
  border: none;
}
</style>
