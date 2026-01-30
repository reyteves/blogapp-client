<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3>Create New Post</h3>
          </div>
          <div class="card-body">
            <PostForm @submit="handleCreatePost" :loading="postsStore.isLoading" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { usePostsStore } from '../stores/posts'
import PostForm from '../components/PostForm.vue'

export default {
  name: 'CreatePostPage',
  components: {
    PostForm
  },
  setup() {
    const router = useRouter()
    const postsStore = usePostsStore()
    const instance = getCurrentInstance()
    const Swal = instance.appContext.config.globalProperties.$swal

    const handleCreatePost = async (formData) => {
      const result = await postsStore.createPost(formData)
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Post created successfully!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
        router.push(`/post/${result.data._id}`)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
      }
    }

    return {
      postsStore,
      handleCreatePost
    }
  }
}
</script>
