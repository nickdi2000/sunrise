<template>
  <PublicLayout>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative">
      <!-- Background Animation -->
      <CityAnimation />
      
      <!-- Main Content -->
      <main class="pt-20 min-h-screen flex items-center justify-center px-4 relative z-10">
      <div class="container mx-auto max-w-5xl py-12">
        <div class="text-center mb-16 space-y-6">
          <!-- Logo with white wash effect -->
          <div class="flex justify-center mb-8 fade-slide-in">
            <img 
              :src="evolveLogo" 
              alt="Evolve Communities"
              class="h-32 w-auto logo-white-wash"
            />
          </div>

          <!-- Heading -->

          <!-- Poetic Description -->
          <div class="max-w-3xl mx-auto space-y-4 text-lg md:text-xl text-gray-700 leading-relaxed">
            <p class="fade-slide-in-delay-2">
              Where threads of humanity interweave into tapestries of belonging.
            </p>
            <p class="fade-slide-in-delay-3">
              We cultivate spaces where every voice finds its echo, every story finds its listener,
              and every dream finds its foundation.
            </p>
            <p class="fade-slide-in-delay-4">
              Communities don't just exist—they evolve.
            </p>
          </div>
        </div>

        <!-- Card Link to Youth -->
        <div 
          class="max-w-4xl mx-auto fade-slide-in-delay-5"
        >
          <a 
            href="/youth"
            class="group block bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:border-purple-400 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <!-- Image Section -->
            <div class="relative h-64 md:h-80 overflow-hidden">
              <img 
                :src="stageImage" 
                alt="Youth performing on stage"
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <!-- Gradient overlay for text readability -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              
              <!-- Badge on image -->
              <div class="absolute top-6 left-6">
                <span class="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-purple-600 shadow-lg">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                  </svg>
                  Live Performances
                </span>
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-8 md:p-10">
              <div class="flex items-start justify-between gap-6">
                <div class="flex-1">
                  <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                    Youth Arts & Music
                  </h2>
                  <p class="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
                    Empowering young voices through music, art, and creative expression. 
                    Building confidence, community, and futures one performance at a time.
                  </p>
                  
                  <!-- Feature highlights -->
                  <div class="flex flex-wrap gap-3">
                    <span class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                      <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      Music & Performance
                    </span>
                    <span class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                      <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      Creative Expression
                    </span>
                    <span class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                      <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      Community Building
                    </span>
                  </div>
                </div>
                
                <div class="flex-shrink-0">
                  <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                    <svg 
                      class="w-7 h-7 text-white transform group-hover:translate-x-0.5 transition-all" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2.5" 
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>

        <!-- Additional Info -->
        <div 
          class="mt-16 text-center fade-slide-in-delay-6"
        >
          <p class="text-gray-500 text-sm">
            More communities coming soon
          </p>
        </div>
      </div>
    </main>
    </div>
  </PublicLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import evolveLogo from '../assets/images/evolve-logo.png';
import stageImage from '../assets/images/stage.png';
import CityAnimation from '../components/CityAnimation.vue';
import PublicLayout from '../components/PublicLayout.vue';

onMounted(() => {
  AOS.init({
    duration: 1000,
    easing: 'ease-out',
    once: true
  });
});
</script>

<style scoped>
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes whiteWashFade {
  0% {
    opacity: 0;
    filter: brightness(10) contrast(0);
    transform: translateY(15px);
  }
  50% {
    filter: brightness(10) contrast(0);
  }
  100% {
    opacity: 1;
    filter: brightness(1) contrast(1);
    transform: translateY(0);
  }
}

.logo-white-wash {
  animation: whiteWashFade 3s ease-out forwards;
  animation-delay: 0.1s;
  opacity: 0;
}

.fade-slide-in {
  animation: fadeSlideIn 0.8s ease-out forwards;
  animation-delay: 0.1s;
  opacity: 0;
}

.fade-slide-in-delay-1 {
  animation: fadeSlideIn 0.8s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

.fade-slide-in-delay-2 {
  animation: fadeSlideIn 0.8s ease-out forwards;
  animation-delay: 0.5s;
  opacity: 0;
}

.fade-slide-in-delay-3 {
  animation: fadeSlideIn 0.8s ease-out forwards;
  animation-delay: 0.7s;
  opacity: 0;
}

.fade-slide-in-delay-4 {
  animation: fadeSlideIn 0.8s ease-out forwards;
  animation-delay: 0.9s;
  opacity: 0;
}

.fade-slide-in-delay-5 {
  animation: fadeSlideIn 0.8s ease-out forwards;
  animation-delay: 1.1s;
  opacity: 0;
}

.fade-slide-in-delay-6 {
  animation: fadeSlideIn 0.8s ease-out forwards;
  animation-delay: 1.3s;
  opacity: 0;
}
</style>

