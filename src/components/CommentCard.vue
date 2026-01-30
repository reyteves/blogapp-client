<template>
  <div class="d-flex mb-3">
    <div class="fb-avatar-container mt-1" style="width: 32px; height: 32px">
      <i
        :class="
          comment.author?.role === 'admin' ||
          comment.author?.isAdmin ||
          comment.author?.email === 'admin@example.com'
            ? 'bi bi-gear-fill'
            : 'bi bi-chat'
        "
        style="font-size: 0.9rem"
      ></i>
    </div>
    <div class="flex-grow-1 ms-2">
      <div class="d-inline-block bg-white border p-2 rounded-3 shadow-sm" style="max-width: 90%">
        <div class="fw-bold small">{{ comment.author?.username || 'Unknown' }}</div>
        <p class="mb-0 small text-dark">{{ comment.content }}</p>
      </div>
      <div class="d-flex align-items-center gap-2 mt-1 ms-1">
        <small class="text-muted extra-small">{{ formatDate(comment.createdAt) }}</small>
        <button
          v-if="canDeleteComment"
          @click="deleteComment"
          class="btn btn-link p-0 text-danger text-decoration-none extra-small fw-bold"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCommentsStore } from '../stores/comments'

export default {
  name: 'CommentCard',
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const authStore = useAuthStore()
    const commentsStore = useCommentsStore()
    const instance = getCurrentInstance()
    const Swal = instance.appContext.config.globalProperties.$swal

    const canDeleteComment = computed(() => {
      if (!authStore.isAuthenticated) return false
      const currentUserId = authStore.currentUser?.id || authStore.currentUser?._id
      const commentAuthorId = props.comment.author?._id || props.comment.author
      return currentUserId === commentAuthorId || authStore.isAdmin
    })

    const formatDate = (dateString) => {
      if (!dateString) return 'Just now'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    const deleteComment = async () => {
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
        const deleteResult = await commentsStore.deleteComment(props.comment._id)

        if (deleteResult.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your comment has been deleted.',
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
      canDeleteComment,
      formatDate,
      deleteComment,
    }
  },
}
</script>
<style scoped>
.extra-small {
  font-size: 0.75rem;
}
</style>
