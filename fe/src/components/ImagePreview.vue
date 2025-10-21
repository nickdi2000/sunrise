<template>
  <div class="relative group">
    <!-- Image Preview Mode -->
    <div 
      v-if="!isEditing || modelValue" 
      class="relative min-h-[120px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-200 cursor-pointer"
      @click="startEditing"
    >
      <div v-if="!modelValue" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p class="mt-1 text-sm text-gray-500">Click to add image</p>
        </div>
      </div>
      
      <div v-else class="relative">
        <img 
          :src="modelValue"
          :alt="alt"
          class="w-full h-[120px] object-cover rounded-lg"
          @error="handleImageError"
        />
        <div 
          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center"
        >
          <button 
            type="button"
            class="opacity-0 group-hover:opacity-100 bg-white text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-opacity duration-200"
          >
            Change Image
          </button>
        </div>
      </div>
      
      <div 
        v-if="hasError" 
        class="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg"
      >
        <div class="text-center text-red-500">
          <svg class="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="mt-1 text-sm">Unable to load image</p>
        </div>
      </div>
    </div>

    <!-- URL Input Mode -->
    <div v-if="isEditing" class="mt-2">
      <div class="flex gap-2">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          type="text"
          :placeholder="placeholder"
          class="form-input flex-1"
          ref="urlInput"
        />
        <button 
          type="button"
          @click="finishEditing"
          class="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
        >
          Done
        </button>
      </div>
      <p class="mt-1 text-xs text-gray-500">Enter the URL of your image</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Enter image URL'
  },
  alt: {
    type: String,
    default: 'Image preview'
  }
})

defineEmits(['update:modelValue'])

const hasError = ref(false)
const isEditing = ref(false)
const urlInput = ref(null)

const handleImageError = () => {
  hasError.value = true
}

const startEditing = () => {
  isEditing.value = true
  // Focus the input on next tick after it's rendered
  setTimeout(() => {
    urlInput.value?.focus()
  }, 0)
}

const finishEditing = () => {
  isEditing.value = false
}
</script>
