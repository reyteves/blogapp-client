<template>
  <div class="mt-2 text-start">
    <div class="mb-4">
      <h3 class="fw-bold">Admin Dashboard</h3>
      <p class="text-secondary small">Manage content and monitor platform activity</p>
    </div>

    <!-- Statistics Cards -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-4">
        <div class="card card-fb p-3 text-center h-100">
          <div class="text-secondary small fw-bold mb-1">TOTAL POSTS</div>
          <h2 class="fw-bold text-primary mb-0">{{ postsStore.posts.length }}</h2>
        </div>
      </div>
      <div class="col-6 col-md-4">
        <div class="card card-fb p-3 text-center h-100">
          <div class="text-secondary small fw-bold mb-1">TOTAL COMMENTS</div>
          <h2 class="fw-bold text-success mb-0">{{ commentsStore.comments.length }}</h2>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card card-fb p-3 text-center h-100">
          <div class="text-secondary small fw-bold mb-1">TOTAL USERS</div>
          <h2 class="fw-bold text-info mb-0">{{ usersCount }}</h2>
        </div>
      </div>
    </div>

    <!-- Management Tabs -->
    <div class="card card-fb border-0">
      <div class="card-header border-bottom">
        <ul class="nav nav-tabs card-header-tabs border-0" role="tablist">
          <li class="nav-item">
            <a
              class="nav-link active border-0 py-3"
              data-bs-toggle="tab"
              href="#posts-tab"
              role="tab"
            >
              <i class="bi bi-journal-text me-1"></i> Posts
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link border-0 py-3" data-bs-toggle="tab" href="#comments-tab" role="tab">
              <i class="bi bi-chat-dots me-1"></i> Comments
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body p-0">
        <div class="tab-content">
          <!-- Posts Tab -->
          <div class="tab-pane fade show active" id="posts-tab" role="tabpanel">
            <div
              class="d-flex justify-content-between align-items-center p-3 border-bottom bg-light"
            >
              <h6 class="mb-0 fw-bold">Recent Posts</h6>
              <button @click="refreshPosts" class="btn btn-fb-secondary btn-sm">
                <i class="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>

            <div v-if="postsStore.isLoading" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="bg-light">
                  <tr>
                    <th class="ps-3 border-0">Title</th>
                    <th class="border-0">Author</th>
                    <th class="border-0">Created</th>
                    <th class="text-center border-0 border-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="post in postsStore.posts" :key="post._id">
                    <td class="ps-3">
                      <router-link
                        :to="`/post/${post._id}`"
                        class="text-decoration-none text-dark fw-600"
                      >
                        {{ post.title }}
                      </router-link>
                    </td>
                    <td>
                      <span class="text-primary fw-600">{{
                        post.author?.username || 'Unknown'
                      }}</span>
                    </td>
                    <td>{{ formatDate(post.creationDate) }}</td>
                    <td class="text-center">
                      <button
                        @click="deletePost(post)"
                        class="btn btn-sm btn-outline-danger border-0"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Comments Tab -->
          <div class="tab-pane fade" id="comments-tab" role="tabpanel">
            <div
              class="d-flex justify-content-between align-items-center p-3 border-bottom bg-light"
            >
              <h6 class="mb-0 fw-bold">Recent Comments</h6>
              <button @click="refreshComments" class="btn btn-fb-secondary btn-sm">
                <i class="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>

            <div v-if="commentsStore.isLoading" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="bg-light">
                  <tr>
                    <th class="ps-3 border-0">Comment</th>
                    <th class="border-0">Author</th>
                    <th class="border-0">On Post</th>
                    <th class="border-0">Created</th>
                    <th class="text-center border-0 border-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="comment in commentsStore.comments" :key="comment._id">
                    <td class="ps-3">
                      <div class="text-muted small">
                        {{ truncateText(comment.content, 50) }}
                      </div>
                    </td>
                    <td>
                      <span class="text-primary fw-600 small">{{
                        comment.author?.username || 'Unknown'
                      }}</span>
                    </td>
                    <td>
                      <router-link
                        :to="`/post/${comment.post}`"
                        class="text-decoration-none extra-small"
                      >
                        {{ getPostTitle(comment.post) }}
                      </router-link>
                    </td>
                    <td>{{ formatDate(comment.creationDate || comment.createdAt) }}</td>
                    <td class="text-center">
                      <button
                        @click="deleteComment(comment)"
                        class="btn btn-sm btn-outline-danger border-0"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, getCurrentInstance } from 'vue'
import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'
import { useCommentsStore } from '../stores/comments'

export default {
  name: 'AdminDashboard',
  setup() {
    const authStore = useAuthStore()
    const postsStore = usePostsStore()
    const commentsStore = useCommentsStore()
    const instance = getCurrentInstance()
    const Swal = instance.appContext.config.globalProperties.$swal

    const usersCount = ref(0)

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    const truncateText = (text, maxLength) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    const getPostTitle = (postId) => {
      const post = postsStore.posts.find((p) => p._id === postId)
      return post ? post.title : 'Unknown Post'
    }

    const deletePost = async (post) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Delete post "${post.title}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      })

      if (result.isConfirmed) {
        const deleteResult = await postsStore.deletePost(post._id)

        if (deleteResult.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Post has been deleted.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          })
        }
      }
    }

    const deleteComment = async (comment) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Delete comment by ${comment.author?.username || 'Unknown'}? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      })

      if (result.isConfirmed) {
        const deleteResult = await commentsStore.deleteComment(comment._id)

        if (deleteResult.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Comment has been deleted.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          })
        }
      }
    }

    const refreshPosts = async () => {
      await postsStore.fetchPosts()
    }

    const refreshComments = async () => {
      // Fetch all comments by getting comments for each post
      await Promise.all(postsStore.posts.map((post) => commentsStore.fetchComments(post._id)))
    }

    onMounted(async () => {
      await postsStore.fetchPosts()

      // Calculate unique users from posts
      const uniqueUsers = new Set(postsStore.posts.map((post) => post.author?._id).filter(Boolean))
      usersCount.value = uniqueUsers.size
    })

    return {
      authStore,
      postsStore,
      commentsStore,
      usersCount,
      formatDate,
      truncateText,
      getPostTitle,
      deletePost,
      deleteComment,
      refreshPosts,
      refreshComments,
    }
  },
}
</script>

<style scoped>
.comment-preview {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
