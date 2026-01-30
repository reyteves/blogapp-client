<template>
  <div class="mt-2 text-center" v-if="postsStore.isLoading">
    <div class="card card-fb py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Opening post...</p>
    </div>
  </div>

  <div v-else-if="!postsStore.currentPost" class="text-center">
    <div class="card card-fb py-5">
      <i class="bi bi-journal-x display-1 text-muted"></i>
      <h3 class="mt-3">Post not found</h3>
      <p class="text-muted">The post you're looking for doesn't exist.</p>
      <router-link to="/" class="btn btn-primary">Back to Home</router-link>
    </div>
  </div>

  <div v-else class="post-detail-view">
    <div class="mb-3 text-start">
      <router-link to="/" class="btn btn-fb-secondary btn-sm">
        <i class="bi bi-arrow-left"></i> Back to feed
      </router-link>
    </div>

    <!-- Main Post Content -->
    <article class="card card-fb">
      <div class="fb-post-header">
        <div class="fb-avatar-container">
          <i
                :class="
                  postsStore.currentPost.author?.role === 'admin' ||
                  postsStore.currentPost.author?.isAdmin ||
                  postsStore.currentPost.author?.email === 'admin@example.com'
                    ? 'bi bi-gear-fill'
                    : 'bi bi-chat'
                "
          ></i>
        </div>
        <div class="flex-grow-1 text-start">
          <p class="fb-post-author">{{ postsStore.currentPost.author?.username || 'Unknown' }}</p>
          <p class="fb-post-date">
            {{ formatDate(postsStore.currentPost.creationDate) }} ·
            <i class="bi bi-globe-americas"></i>
          </p>
        </div>
        <div v-if="canEditPost">
          <router-link
            :to="`/edit-post/${postsStore.currentPost._id}`"
            class="btn btn-fb-secondary btn-sm me-1 rounded-circle"
          >
            <i class="bi bi-pencil"></i>
          </router-link>
          <button
            @click="deletePost"
            class="btn btn-fb-secondary btn-sm text-danger rounded-circle"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <div class="card-fb-body p-3 pt-0 text-start">
        <h1 class="fw-bold mb-4" style="font-size: 2rem">{{ postsStore.currentPost.title }}</h1>
        <div
          class="post-content text-dark mb-4"
          style="font-size: 1.1rem"
          v-html="postsStore.currentPost.content"
        ></div>
        <div v-if="postsStore.currentPost.tags && postsStore.currentPost.tags.length" class="mt-3">
          <span
            v-for="tag in postsStore.currentPost.tags"
            :key="tag"
            class="badge rounded-pill bg-light text-primary border me-1"
            >#{{ tag }}</span
          >
        </div>
      </div>

      <div class="card-fb-footer border-top mx-3 p-1">
        <button class="btn btn-fb-action w-100" @click="focusCommentInput">
          <i class="bi bi-chat"></i> Comment
        </button>
      </div>

      <!-- Comments Section Inside Card -->
      <div class="bg-light p-3 border-top">
        <h6 class="fw-bold mb-3 text-start text-secondary">
          Comments ({{ commentsStore.comments.length }})
        </h6>

        <!-- Add Comment Form -->
        <div v-if="authStore.isAuthenticated" class="d-flex mb-4">
          <div class="fb-avatar-container" style="width: 32px; height: 32px">
            <i
              :class="
                authStore.user?.isAdmin ||
                authStore.user?.role === 'admin' ||
                authStore.user?.email === 'admin@example.com'
                  ? 'bi bi-gear-fill'
                  : 'bi bi-chat'
              "
              style="font-size: 0.9rem"
            ></i>
          </div>
          <form @submit.prevent="addComment" class="flex-grow-1">
            <div class="input-group">
              <input
                type="text"
                ref="commentInput"
                class="form-control form-control-fb py-2"
                placeholder="Write a comment..."
                v-model="newComment"
                required
              />
              <button
                type="submit"
                class="btn btn-primary px-3"
                :disabled="commentsStore.isLoading"
              >
                <i v-if="!commentsStore.isLoading" class="bi bi-send-fill text-white"></i>
                <span v-else class="spinner-border spinner-border-sm"></span>
              </button>
            </div>
          </form>
        </div>
        <div v-else class="mb-4 text-start">
          <p class="text-muted small">
            Please
            <router-link to="/login" class="text-primary text-decoration-none">login</router-link>
            to add comments.
          </p>
        </div>

        <!-- Comments List -->
        <div v-if="commentsStore.isLoading" class="text-center py-3">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div
          v-else-if="commentsStore.comments.length === 0"
          class="text-center py-3 text-muted small"
        >
          No comments yet.
        </div>
        <div v-else class="comments-list text-start">
          <CommentCard
            v-for="comment in commentsStore.comments"
            :key="comment._id"
            :comment="comment"
          />
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { ref, onMounted, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'
import { useCommentsStore } from '../stores/comments'
import CommentCard from '../components/CommentCard.vue'

export default {
  name: 'ViewPostPage',
  components: {
    CommentCard,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const postsStore = usePostsStore()
    const commentsStore = useCommentsStore()
    const instance = getCurrentInstance()
    const Swal = instance.appContext.config.globalProperties.$swal

    const newComment = ref('')
    const commentInput = ref(null) // Declare commentInput ref

    const canEditPost = computed(() => {
      if (!authStore.isAuthenticated || !postsStore.currentPost) {
        return false
      }

      const currentUserId = authStore.currentUser?.id || authStore.currentUser?._id
      const postAuthorId = postsStore.currentPost.author?._id || postsStore.currentPost.author
      return currentUserId === postAuthorId || authStore.isAdmin
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    const focusCommentInput = () => {
      if (commentInput.value) {
        commentInput.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
        commentInput.value.focus()
      } else if (!authStore.isAuthenticated) {
        Swal.fire({
          icon: 'info',
          title: 'Login Required',
          text: 'Please login to leave a comment.',
          confirmButtonText: 'Go to Login',
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/login')
          }
        })
      }
    }

    const addComment = async () => {
      const result = await commentsStore.addComment({
        content: newComment.value,
        blogPostId: postsStore.currentPost._id,
      })

      if (result.success) {
        newComment.value = ''
        // Re-fetch comments to ensure the newest one has a populated author name
        await commentsStore.fetchComments(postsStore.currentPost._id)

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Comment added!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        })
      }
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
        const deleteResult = await postsStore.deletePost(postsStore.currentPost._id)

        if (deleteResult.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your post has been deleted.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          })
          router.push('/')
        }
      }
    }

    onMounted(async () => {
      const postId = route.params.id
      console.log('Attempting to fetch post with ID:', postId)
      try {
        const result = await postsStore.fetchPost(postId)
        console.log('Fetch result:', result)
        console.log('Current post data:', postsStore.currentPost)

        if (!result.success) {
          console.error('Failed to fetch post:', result.message)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.message || 'Failed to load post',
          })
        }

        // Also fetch comments if post was loaded successfully
        if (result.success && postsStore.currentPost) {
          await commentsStore.fetchComments(postId)

          // Auto-focus if requested via query param
          if (route.query.focus === 'true') {
            setTimeout(() => {
              focusCommentInput()
            }, 100)
          }
        }
      } catch (error) {
        console.error('Error loading post data:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while loading the post',
        })
      }
    })

    // Return all the necessary values and methods
    return {
      route,
      authStore,
      postsStore,
      commentsStore,
      newComment,
      commentInput,
      focusCommentInput,
      canEditPost,
      formatDate,
      addComment,
      deletePost,
    }
  },
}
</script>
