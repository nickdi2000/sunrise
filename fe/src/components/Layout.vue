<script setup>
import { ref, provide, toRef } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    required: true
  }
});

const currentYear = new Date().getFullYear();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Provide content to child components (Landing page as slot)
// Use toRef to create a reactive reference to props.content
const contentRef = toRef(props, 'content');

console.log('[Layout] Initial props.content:', props.content);
console.log('[Layout] Initial props.content has hero?', !!props.content?.hero);
console.log('[Layout] contentRef via toRef:', contentRef);
console.log('[Layout] contentRef.value:', contentRef.value);

provide('content', contentRef);
provide('isLoadingContent', ref(false)); // Content is loaded when Layout renders
provide('contentError', ref(null)); // No error when Layout renders

console.log('[Layout] Providing contentRef via toRef:', contentRef);
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <a href="/" class="flex items-center gap-3">
            <img 
              :src="content.navigation?.logo?.image || ''"
              :alt="content.navigation?.logo?.alt || 'Logo'"
              class="h-8 w-8"
            />
            <span class="text-2xl font-bold text-gray-900">{{ content.navigation?.logo?.text || '' }}</span>
          </a>
          
          <!-- Mobile menu button -->
          <button 
            class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none" 
            @click="toggleMenu"
            aria-label="Toggle menu"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Navigation links -->
          <div class="hidden md:flex md:items-center md:space-x-8">
            <a 
              v-for="link in (content.navigation?.links || [])" 
              :key="link.href || 'link'"
              :href="link.href" 
              class="text-gray-600 hover:text-gray-900"
            >
              {{ link.text }}
            </a>
            <a 
              :href="content.navigation?.cta?.href || '#'" 
              class="bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to text-white px-4 py-2 rounded-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {{ content.navigation?.cta?.text || '' }}
            </a>
          </div>
        </div>
        
        <!-- Mobile menu -->
        <div 
          v-show="isMenuOpen" 
          class="md:hidden"
        >
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a 
              v-for="link in (content.navigation?.links || [])" 
              :key="link.href || 'mobile-link'"
              :href="link.href" 
              class="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {{ link.text }}
            </a>
            <a 
              :href="content.navigation?.cta?.href || '#'" 
              class="block px-3 py-2 rounded-md bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to text-white hover:shadow-lg transition-all duration-300"
            >
              {{ content.navigation?.cta?.text || '' }}
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <slot></slot>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-16 mb-16">
          <div class="space-y-4">
            <h3 class="font-display text-3xl font-bold">{{ content.footer?.branding?.title || '' }}</h3>
            <p class="text-gray-400 text-lg">{{ content.footer?.branding?.tagline || '' }}</p>
          </div>
          <div class="space-y-4">
            <h4 class="font-display text-xl font-semibold">{{ content.footer?.quickLinks?.title || '' }}</h4>
            <div class="space-y-3">
              <a 
                v-for="link in (content.footer?.quickLinks?.links || [])"
                :key="link.href || 'footer-link'"
                :href="link.href"
                class="block text-gray-400 hover:text-white transition-colors duration-300 transform hover:translate-x-1"
              >
                {{ link.text }}
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center">
          <div class="flex flex-col items-center space-y-2">
            <p class="text-gray-400 text-lg">&copy; {{ currentYear }} Evolve Communities. All rights reserved.</p>
            <router-link 
              to="/login" 
              class="text-gray-500 text-sm hover:text-gray-300 transition-colors duration-300"
            >
              Admin
            </router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
