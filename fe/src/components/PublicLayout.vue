<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4 px-6">
      <div class="container mx-auto">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a href="/" class="flex items-center group">
            <img 
              :src="evolveLogo" 
              alt="Evolve Communities"
              class="h-10 w-auto transition-transform group-hover:scale-105" 
            />
          </a>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a 
              href="/"
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </a>
            <a 
              href="/youth"
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Youth
            </a>
            <a 
              href="/contact"
              class="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 font-semibold"
            >
              Get Involved
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            class="md:hidden p-2 rounded-lg hover:bg-gray-100"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <svg 
              class="w-6 h-6 text-gray-900" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                v-if="!isMobileMenuOpen"
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
          v-if="isMobileMenuOpen"
          class="md:hidden mt-4 py-4 border-t border-gray-100"
        >
          <div class="flex flex-col space-y-4">
            <a 
              href="/"
              class="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
            >
              Home
            </a>
            <a 
              href="/youth"
              class="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
            >
              Youth
            </a>
            <a 
              href="/contact"
              class="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-center font-semibold"
            >
              Get Involved
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Slot -->
    <slot></slot>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-white py-12 text-gray-600 relative z-10">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div class="flex items-center space-x-3">
            <img :src="evolveLogo" alt="Evolve Communities Logo" class="h-10 w-auto" />
          </div>
          <div class="flex items-center space-x-6 text-sm">
            <a href="/" class="transition hover:text-gray-900">Home</a>
            <a href="/youth" class="transition hover:text-gray-900">Youth</a>
            <a href="/contact" class="transition hover:text-gray-900">Contact</a>
            <a href="/login" class="text-gray-400 hover:text-gray-600 transition-colors">Admin</a>
          </div>
          <p class="text-xs text-gray-500">&copy; {{ currentYear }} Evolve Communities. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import evolveLogo from '../assets/images/evolve-logo.png';

const currentYear = new Date().getFullYear();
const isMobileMenuOpen = ref(false);
</script>

