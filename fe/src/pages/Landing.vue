<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p class="text-gray-600">Loading...</p>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="text-red-600 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="text-xl font-semibold mb-2">Failed to load content</h2>
        <p class="text-sm text-gray-600 mb-4">{{ error }}</p>
      </div>
      <button 
        @click="loadContent" 
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>

   <!-- Content Loaded -->
   <div v-else>
      <!-- Navigation -->
      <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4 px-6">
        <div class="container mx-auto">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <a href="/" class="flex items-center space-x-3 group">
              <img 
                :src="content?.navigation?.logo?.image || '/sun.png'" 
                :alt="content?.navigation?.logo?.alt || 'Logo'"
                class="h-10 w-10 transition-transform group-hover:scale-105" 
              />
              <span class="text-xl font-semibold text-gray-900">
                {{ content?.navigation?.logo?.text || 'SunriseYouth' }}
              </span>
            </a>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center space-x-8">
              <a 
                v-for="link in (content?.navigation?.links || [])"
                :key="link.text"
                :href="link.href"
                class="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {{ link.text }}
              </a>
              
              <!-- CTA Button -->
              <a 
                :href="content?.navigation?.cta?.href || '/contact'"
                class="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
              >
                {{ content?.navigation?.cta?.text || 'Get Involved' }}
              </a>
            </div>

            <!-- Mobile Menu Button -->
            <button 
              class="md:hidden p-2 rounded-lg hover:bg-gray-100"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            >
              <svg 
                class="w-6 h-6" 
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
                v-for="link in (content?.navigation?.links || [])"
                :key="link.text"
                :href="link.href"
                class="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
              >
                {{ link.text }}
              </a>
              
              <!-- Mobile CTA Button -->
              <a 
                :href="content?.navigation?.cta?.href || '#'"
                class="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-center"
              >
                {{ content?.navigation?.cta?.text || 'Get Involved' }}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main content -->
      <main class="pt-20"><!-- Added padding-top to account for fixed nav -->
      <!-- Hero Section -->
      <div class="relative h-[90vh] min-h-[600px] overflow-hidden">
        <div 
          ref="parallaxContainer"
          class="absolute inset-0 will-change-transform"
          style="transform: translate3d(0, 0, 0)"
        >
          <img 
            :src="stageImage" 
            alt="Stage" 
            class="w-full h-[120%] object-cover"
            loading="eager"
          />
        </div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        <div class="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 class="hero-text font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
            {{ content?.hero?.title || 'Loading...' }}
          </h1>
          <p class="hero-text font-sans text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed">
            {{ content?.hero?.subtitle || '' }}
          </p>
          <div class="hero-text flex flex-col sm:flex-row gap-4">
            <a 
              v-for="button in (content?.hero?.buttons || [])"
              :key="button.text"
              :href="button.href" 
              :class="[
                'transition-all duration-300 transform hover:scale-105 hover:shadow-lg px-8 py-4 rounded-lg',
                button.type === 'primary' 
                  ? 'group bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                  : 'border-2 border-white/50 hover:border-white text-white backdrop-blur-sm hover:backdrop-blur-md'
              ]"
            >
              <span class="flex items-center justify-center">
                {{ button.text }}
                <svg v-if="button.type === 'primary'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <section id="about" class="py-24 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="flex flex-col lg:flex-row items-center gap-16 mb-20">
            <div class="lg:w-1/3 flex-shrink-0">
              <img 
                :src="content?.branding?.logo || ''"
                :alt="content?.branding?.alt || 'Logo'"
                class="w-full max-w-md mx-auto rounded-lg shadow-xl"
                data-aos="fade-right"
              />
            </div>
            <div class="lg:w-2/3">
              <h2 
                class="font-display text-5xl md:text-6xl font-bold mb-8 tracking-tight"
                data-aos="fade-up"
              >
                {{ content?.about?.title || '' }}
              </h2>
              <h3 
                class="font-display text-3xl md:text-4xl font-bold mb-12 text-blue-600"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {{ content?.about?.subtitle || '' }}
              </h3>
              <div class="space-y-6 text-gray-600">
                <p 
                  v-for="(paragraph, index) in (content?.about?.paragraphs || [])"
                  :key="index"
                  class="text-xl leading-relaxed"
                  data-aos="fade-up"
                  :data-aos-delay="(index + 1) * 150"
                >
                  {{ paragraph }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Callout Section -->
          <div 
            v-if="content?.about?.callout"
            class="max-w-3xl mx-auto mt-20 p-8 bg-blue-50 rounded-2xl border border-blue-200"
            data-aos="fade-up"
          >
            <h3 class="font-display text-2xl md:text-3xl font-bold mb-4 text-blue-600">
              {{ content.about.callout.title }}
            </h3>
            <p class="text-xl leading-relaxed text-gray-600">
              {{ content.about.callout.content }}
            </p>
          </div>
        </div>
      </section>

      <!-- Programs Section -->
      <section id="programs" class="py-24 bg-white">
        <div class="container mx-auto px-4">
          <h2 
            class="font-display text-5xl md:text-6xl font-bold text-center mb-20 tracking-tight"
            data-aos="fade-up"
          >
            {{ content?.programs?.title || '' }}
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(program, index) in (content?.programs?.items || [])"
              :key="program.title || index"
              class="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              data-aos="fade-up"
              :data-aos-delay="(index + 1) * 100"
            >
              <div class="h-16 w-16 bg-blue-100 rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-10 h-10 text-blue-600 m-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    v-if="program.icon === 'music'"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                  <path 
                    v-else-if="program.icon === 'art'"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                  <path 
                    v-else-if="program.icon === 'production'"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 class="font-display text-2xl font-bold mb-4">{{ program.title }}</h3>
              <p class="text-gray-600 leading-relaxed" :class="{ 'mb-6': program.link }">{{ program.description }}</p>
              <a 
                v-if="program.link"
                :href="program.link.href" 
                :target="program.link.external ? '_blank' : undefined" 
                :rel="program.link.external ? 'noopener noreferrer' : undefined" 
                class="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 group/link"
              >
                {{ program.link.text }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-32 bg-white relative overflow-hidden">
        <div 
          class="absolute inset-0 bg-blue-50 transform -skew-y-6"
          data-aos="fade"
          data-aos-delay="100"
        ></div>
        <div class="container mx-auto px-4 text-center relative">
          <h2 
            class="font-display text-5xl md:text-6xl font-bold mb-8 tracking-tight"
            data-aos="fade-up"
          >
            {{ content?.cta?.title || '' }}
          </h2>
          <p 
            class="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {{ content?.cta?.subtitle || '' }}
          </p>
          <div 
            class="flex flex-col sm:flex-row justify-center gap-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <a 
              v-for="button in (content?.cta?.buttons || [])"
              :key="button.text || 'button'"
              :href="button.href"
              :class="[
                'group transition-all duration-300 transform hover:scale-105 hover:shadow-lg px-10 py-4 rounded-lg',
                button.type === 'primary'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                  : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
              ]"
            >
              <span class="flex items-center justify-center">
                {{ button.text }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-white py-12 text-gray-600">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div class="flex items-center space-x-3">
            <img src="/sun.png" alt="Sun Logo" class="h-10 w-10" />
            <div>
              <p class="text-lg font-semibold text-gray-900">{{ content?.footer?.branding?.title || 'SunriseYouth' }}</p>
              <p class="text-sm text-gray-500">{{ content?.footer?.branding?.tagline || 'Youth arts. Community. Confidence.' }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4 text-sm">
            <a 
              v-for="link in (content?.footer?.quickLinks?.links || [])"
              :key="link.text"
              :href="link.href" 
              class="transition hover:text-gray-900"
            >
              {{ link.text }}
            </a>
          </div>
          <p class="text-xs text-gray-500">&copy; {{ currentYear }} {{ content?.footer?.branding?.title || 'SunriseYouth' }}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getContent } from '../api/api';
import stageImage from '../assets/images/stage.png';

// Simple reactive state - no complex injection needed
const content = ref(null);
const isLoading = ref(true);
const error = ref(null);
const currentYear = new Date().getFullYear();
const isMobileMenuOpen = ref(false);

// Parallax effect
const parallaxContainer = ref(null);

const handleScroll = () => {
  if (!parallaxContainer.value) return;
  const scrolled = window.pageYOffset;
  const rate = scrolled * 0.5;
  parallaxContainer.value.style.transform = `translate3d(0, ${rate}px, 0)`;
};

// Simple content loading - just like the test page
const loadContent = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('Loading content...');
    const apiContent = await getContent();
    console.log('Content loaded successfully:', apiContent);
    content.value = apiContent;
  } catch (err) {
    console.error('Failed to load content:', err);
    error.value = err.message || 'Failed to load content';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Load content immediately
  loadContent();
  
  // Initialize animations
  AOS.init({
    duration: 1000,
    easing: 'ease-out',
    once: true
  });
  
  // Add scroll listener for parallax
  window.addEventListener('scroll', handleScroll);
  
  // Animate hero text after content loads
  setTimeout(() => {
    if (content.value?.hero?.title) {
      gsap.from('.hero-text', {
        duration: 1.5,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
  }, 500);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>