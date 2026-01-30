<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="title" class="form-label">Title</label>
      <input
        type="text"
        class="form-control"
        id="title"
        v-model="form.title"
        required
        placeholder="Enter post title"
      />
    </div>

    <div class="mb-3">
      <label for="content" class="form-label">Content</label>
      <textarea
        class="form-control"
        id="content"
        rows="10"
        v-model="form.content"
        required
        placeholder="Write your post content here..."
      ></textarea>
      <small class="text-muted">You can use HTML formatting in your content.</small>
    </div>

    <div class="d-flex justify-content-between">
      <router-link to="/" class="btn btn-secondary">
        <i class="bi bi-arrow-left me-2"></i>Cancel
      </router-link>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        {{ isEdit ? 'Update Post' : 'Create Post' }}
      </button>
    </div>
  </form>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'PostForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    initialData: {
      type: Object,
      default: () => ({})
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const form = ref({
      title: '',
      content: ''
    })

    // Watch for initial data changes (for edit mode)
    watch(() => props.initialData, (newData) => {
      if (newData && Object.keys(newData).length > 0) {
        form.value = {
          title: newData.title || '',
          content: newData.content || ''
        }
      }
    }, { immediate: true })

    const handleSubmit = () => {
      emit('submit', { ...form.value })
    }

    return {
      form,
      handleSubmit
    }
  }
}
</script>
