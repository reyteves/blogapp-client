<template>
  <div class="card mb-3">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <strong>{{ comment.author?.username || 'Unknown' }}</strong>
          <small class="text-muted ms-2">{{ formatDate(comment.createdAt) }}</small>
        </div>
        <div v-if="canDeleteComment">
          <button @click="deleteComment" class="btn btn-sm btn-outline-danger">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <p class="card-text mb-0">{{ comment.content }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCommentsStore } from '../stores/comments'

export default {
  name: 'CommentCard',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const authStore = useAuthStore()
    const commentsStore = useCommentsStore()

    const canDeleteComment = computed(() => {
      if (!authStore.isAuthenticated) return false
      return authStore.currentUser?._id === props.comment.author?._id || authStore.isAdmin
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
        minute: '2-digit'
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
        confirmButtonText: 'Yes, delete it!'
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
            timer: 3000
          })
        }
      }
    }

    return {
      authStore,
      canDeleteComment,
      formatDate,
      deleteComment
    }
  }
}
</script>
