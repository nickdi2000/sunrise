<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center">
        <div class="mx-auto h-16 w-16 mb-4">
          <svg class="animate-spin h-16 w-16 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h2>
        <p class="text-gray-600">Please wait while we redirect you.</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center">
        <div class="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">QR Code Not Found</h2>
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go to Home
        </router-link>
      </div>

      <!-- Success State (brief display before redirect) -->
      <div v-else class="text-center">
        <div class="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Redirecting Now</h2>
        <p class="text-gray-600 mb-2">Taking you to your destination...</p>
        <p v-if="qrData" class="text-sm text-gray-500 truncate">{{ qrData.link }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { lookupQRCode } from '../api/api'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const qrData = ref(null)

onMounted(async () => {
  const code = route.params.code
  console.log('QR Redirect page loaded for code:', code)

  if (!code) {
    error.value = true
    errorMessage.value = 'No QR code specified.'
    isLoading.value = false
    return
  }

  try {
    console.log('Looking up QR code:', code)
    const data = await lookupQRCode(code)
    console.log('QR code data:', JSON.stringify(data))
    
    qrData.value = data
    isLoading.value = false

    // Redirect after a brief moment to show success state
    setTimeout(() => {
      console.log('Redirecting to:', data.link)
      window.location.href = data.link
    }, 500)
  } catch (err) {
    console.error('Failed to lookup QR code:', {
      error: err,
      message: err.message,
      stack: err.stack
    })
    error.value = true
    errorMessage.value = err.message || 'The QR code you\'re looking for doesn\'t exist or has been removed.'
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style>

