<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1>Admin Dashboard</h1>
        <p class="text-muted">Manage all posts and comments</p>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h5 class="card-title">Total Posts</h5>
            <h2>{{ postsStore.posts.length }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h5 class="card-title">Total Comments</h5>
            <h2>{{ commentsStore.comments.length }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-info text-white">
          <div class="card-body">
            <h5 class="card-title">Total Users</h5>
            <h2>{{ usersCount }}</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Management Tabs -->
    <div class="card">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" data-bs-toggle="tab" href="#posts-tab" role="tab">
              Posts Management
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#comments-tab" role="tab">
              Comments Management
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="tab-content">
          <!-- Posts Tab -->
          <div class="tab-pane fade show active" id="posts-tab" role="tabpanel">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5>All Posts</h5>
              <button @click="refreshPosts" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>
            
            <div v-if="postsStore.isLoading" class="text-center py-3">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="post in postsStore.posts" :key="post._id">
                    <td>
                      <router-link :to="`/post/${post._id}`" class="text-decoration-none">
                        {{ post.title }}
                      </router-link>
                    </td>
                    <td>{{ post.author?.username || 'Unknown' }}</td>
                    <td>{{ formatDate(post.creationDate) }}</td>
                    <td>
                      <button @click="deletePost(post)" class="btn btn-sm btn-outline-danger">
                        <i class="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Comments Tab -->
          <div class="tab-pane fade" id="comments-tab" role="tabpanel">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5>All Comments</h5>
              <button @click="refreshComments" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>
            
            <div v-if="commentsStore.isLoading" class="text-center py-3">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Comment</th>
                    <th>Author</th>
                    <th>Post</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="comment in commentsStore.comments" :key="comment._id">
                    <td>
                      <div class="comment-preview">
                        {{ truncateText(comment.content, 50) }}
                      </div>
                    </td>
                    <td>{{ comment.author?.username || 'Unknown' }}</td>
                    <td>
                      <router-link :to="`/post/${comment.post}`" class="text-decoration-none">
                        {{ getPostTitle(comment.post) }}
                      </router-link>
                    </td>
                    <td>{{ formatDate(comment.creationDate) }}</td>
                    <td>
                      <button @click="deleteComment(comment)" class="btn btn-sm btn-outline-danger">
                        <i class="bi bi-trash"></i> Delete
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
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'
import { useCommentsStore } from '../stores/comments'

export default {
  name: 'AdminDashboard',
  setup() {
    const authStore = useAuthStore()
    const postsStore = usePostsStore()
    const commentsStore = useCommentsStore()
    
    const usersCount = ref(0)

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const truncateText = (text, maxLength) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    const getPostTitle = (postId) => {
      const post = postsStore.posts.find(p => p._id === postId)
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
        confirmButtonText: 'Yes, delete it!'
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
            timer: 3000
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
        confirmButtonText: 'Yes, delete it!'
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
            timer: 3000
          })
        }
      }
    }

    const refreshPosts = async () => {
      await postsStore.fetchPosts()
    }

    const refreshComments = async () => {
      // Fetch all comments by getting comments for each post
      await Promise.all(
        postsStore.posts.map(post => commentsStore.fetchComments(post._id))
      )
    }

    onMounted(async () => {
      await postsStore.fetchPosts()
      
      // Calculate unique users from posts
      const uniqueUsers = new Set(
        postsStore.posts.map(post => post.author?._id).filter(Boolean)
      )
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
      refreshComments
    }
  }
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
