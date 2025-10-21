<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center px-4">
      <h1 class="text-9xl font-bold text-gray-800">404</h1>
      <p class="mt-4 text-xl text-gray-600">Oops! Page not found</p>
      <p class="mt-2 text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
      <router-link 
        to="/" 
        class="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
      >
        Back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed for this component
</script>
