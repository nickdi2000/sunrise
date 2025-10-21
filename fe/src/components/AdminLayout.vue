<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Mobile Navigation -->
        <div class="lg:hidden">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <router-link to="/" class="flex items-center">
              <img src="/sun.png" alt="Sun Logo" class="h-8 w-8" />
              <span class="ml-2 text-lg font-semibold text-gray-900">SunriseYouth</span>
            </router-link>
            
            <!-- Mobile Menu Button -->
            <button 
              @click="isMenuOpen = !isMenuOpen"
              class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <svg 
                class="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  v-if="!isMenuOpen"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path 
                  v-else
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <!-- Mobile Menu -->
          <div 
            v-show="isMenuOpen"
            class="border-b border-gray-200 pb-3 pt-2"
          >
            <div class="space-y-1">
              <router-link
                to="/admin"
                class="block px-4 py-2 text-base font-medium rounded-md transition-colors"
                :class="$route.name === 'Admin' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                @click="isMenuOpen = false"
              >
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Page Editor
              </router-link>
              <router-link
                to="/admin/messages"
                class="block px-4 py-2 text-base font-medium rounded-md transition-colors"
                :class="$route.name === 'Messages' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                @click="isMenuOpen = false"
              >
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                Messages
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex lg:justify-between lg:h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <img src="/sun.png" alt="Sun Logo" class="h-8 w-8" />
              <span class="ml-3 text-xl font-semibold text-gray-900">SunriseYouth Admin</span>
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Admin Navigation Tabs -->
            <div class="flex space-x-2">
              <router-link
                to="/admin"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors"
                :class="$route.name === 'Admin' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Page Editor
              </router-link>
              <router-link
                to="/admin/messages"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors"
                :class="$route.name === 'Messages' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                Messages
              </router-link>
            </div>
            <div class="border-l border-gray-300 pl-4">
              <button
                @click="handleLogout"
                class="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '../utils/auth'

const router = useRouter()
const isMenuOpen = ref(false)

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

