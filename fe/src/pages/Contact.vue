<script setup>
import { ref, onMounted, reactive } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { submitContactForm } from '../api/api';

// Form data
const form = reactive({
  name: '',
  email: '',
  message: '',
  subject: 'general'
});

const currentStep = ref('select'); // 'select' or 'form'
const isSubmitting = ref(false);
const submitMessage = ref('');
const submitSuccess = ref(false);
const showForm = ref(true);
const errors = ref({});

// Inquiry types with icons and descriptions
const inquiryTypes = [
  {
    id: 'general',
    title: 'General Inquiry',
    description: 'Questions about SunriseYouth',
    icon: 'question'
  },
  {
    id: 'programs',
    title: 'Programs',
    description: 'Learn about our programs',
    icon: 'academic-cap'
  },
  {
    id: 'volunteer',
    title: 'Volunteer',
    description: 'Get involved and help out',
    icon: 'hand-raised'
  },
  {
    id: 'partnership',
    title: 'Partnership',
    description: 'Collaborate with us',
    icon: 'handshake'
  },
  {
    id: 'support',
    title: 'Support/Donations',
    description: 'Help fund our mission',
    icon: 'heart'
  },
  {
    id: 'sponsorships',
    title: 'Sponsorships',
    description: 'Sponsor our events',
    icon: 'star'
  }
];

onMounted(() => {
  AOS.init({
    duration: 1000,
    easing: 'ease-out',
    once: true
  });
});

// Validation
const validateForm = () => {
  errors.value = {};
  
  if (!form.name.trim()) {
    errors.value.name = 'Name is required';
  }
  
  if (!form.email.trim()) {
    errors.value.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.value.email = 'Please enter a valid email address';
  }
  
  if (!form.subject) {
    errors.value.subject = 'Please select a subject';
  }
  
  if (!form.message.trim()) {
    errors.value.message = 'Message is required';
  } else if (form.message.trim().length < 10) {
    errors.value.message = 'Message must be at least 10 characters long';
  }
  
  return Object.keys(errors.value).length === 0;
};

// Step management
const selectInquiryType = (type) => {
  form.subject = type.id;
  currentStep.value = 'form';
};

const goBackToSelection = () => {
  currentStep.value = 'select';
};

const getSelectedInquiryType = () => {
  return inquiryTypes.find(type => type.id === form.subject);
};

// Icon component for different inquiry types
const getIconSvg = (iconName) => {
  const icons = {
    question: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
    'academic-cap': `<path d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l-9-5v9a9 9 0 0018 0v-9l-9 5z" />`,
    'hand-raised': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />`,
    handshake: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h1v-4a2 2 0 012-2h3V5a2 2 0 00-2-2H5zM19 5a2 2 0 012 2v3a2 2 0 01-2 2h-1v-4a2 2 0 00-2-2h-3V5a2 2 0 012-2h4z" />`,
    heart: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />`,
    star: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />`
  };
  return icons[iconName] || icons.question;
};

const handleSubmit = async () => {
  // Clear previous messages
  submitMessage.value = '';
  
  // Validate form
  if (!validateForm()) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    await submitContactForm({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject,
      message: form.message.trim(),
      timestamp: new Date().toISOString()
    });
    
    submitSuccess.value = true;
    submitMessage.value = 'Thank you for your message! We\'ll get back to you soon.';
    showForm.value = false; // Hide the form after successful submission
    currentStep.value = 'select'; // Reset to selection step for next time
    
    // Reset form (for potential future use)
    Object.keys(form).forEach(key => {
      if (key === 'subject') {
        form[key] = 'general';
      } else {
        form[key] = '';
      }
    });
    errors.value = {};
    
  } catch (error) {
    submitSuccess.value = false;
    submitMessage.value = error.message || 'Failed to send message. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Simple navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <router-link to="/" class="flex items-center">
            <img src="/sun.png" alt="Sun Logo" class="h-8 w-8" />
            <span class="ml-2 text-xl font-semibold text-gray-900">SunriseYouth</span>
          </router-link>
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-gray-600 hover:text-gray-900">Home</router-link>
            <router-link to="/login" class="text-gray-600 hover:text-gray-900">Admin</router-link>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <section class="py-24 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h1 
              class="font-display text-5xl md:text-6xl font-bold text-center mb-8 tracking-tight"
              data-aos="fade-up"
            >
              Get in Touch
            </h1>
            <p 
              class="text-xl text-gray-600 text-center mb-16 leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Have questions about our programs or want to get involved? We'd love to hear from you!
            </p>

            <!-- Success Message (shown when form is successfully submitted) -->
            <div 
              v-if="!showForm && submitSuccess" 
              class="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 p-12 rounded-2xl shadow-lg text-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div class="max-w-2xl mx-auto">
                <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h2 class="font-display text-4xl md:text-5xl font-bold text-green-800 mb-6">
                  Message Sent Successfully!
                </h2>
                <p class="text-xl text-green-700 mb-8 leading-relaxed">
                  {{ submitMessage }}
                </p>
                <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                  <p class="text-green-600 font-medium mb-2">
                    📧 What happens next?
                  </p>
                  <ul class="text-green-700 text-left space-y-2">
                    <li class="flex items-start">
                      <span class="text-green-500 mr-2">•</span>
                      We typically respond within 24 hours during business days
                    </li>
                    <li class="flex items-start">
                      <span class="text-green-500 mr-2">•</span>
                      Check your email (including spam folder) for our response
                    </li>

                  </ul>
                </div>
                <button 
                  @click="showForm = true; submitSuccess = false; submitMessage = ''; currentStep = 'select'"
                  class="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300"
                >
                  Send Another Message
                </button>
              </div>
            </div>

            <!-- Step 1: Inquiry Type Selection -->
            <div v-if="showForm && currentStep === 'select'" class="space-y-8">
              <div class="text-center mb-12">
                <h2 class="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  What can we help you with?
                </h2>
                <p class="text-lg text-gray-600">
                  Choose the topic that best matches your inquiry
                </p>
              </div>

              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <button 
                  v-for="(type, index) in inquiryTypes"
                  :key="type.id"
                  @click="selectInquiryType(type)"
                  class="group p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 text-left"
                  :data-aos="'fade-up'"
                  :data-aos-delay="index * 100"
                >
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIconSvg(type.icon)"></svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-display text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {{ type.title }}
                      </h3>
                      <p class="text-gray-600 text-sm leading-relaxed">
                        {{ type.description }}
                      </p>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Step 2: Contact Form -->
            <div v-if="showForm && currentStep === 'form'" class="max-w-2xl mx-auto">

              <!-- Contact Form -->
              <form 
                @submit.prevent="handleSubmit"
                class="space-y-6 bg-white p-8 rounded-xl shadow-lg"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <!-- Back Button and Header -->
                <div class="flex items-center justify-between mb-6">
                  <button 
                    type="button"
                    @click="goBackToSelection"
                    class="flex items-center text-gray-600 hover:text-primary transition-colors"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to topics
                  </button>
                  <h2 class="font-display text-2xl font-bold text-gray-900">Send us a message</h2>
                  <div class="w-20"></div> <!-- Spacer for center alignment -->
                </div>
                
                <!-- Selected Inquiry Type Display -->
                <div class="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIconSvg(getSelectedInquiryType()?.icon)"></svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-primary">You're inquiring about:</p>
                      <p class="font-semibold text-gray-900">{{ getSelectedInquiryType()?.title }}</p>
                    </div>
                    <button 
                      type="button"
                      @click="goBackToSelection"
                      class="ml-auto text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <!-- Name Field -->
                <div>
                  <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    v-model="form.name"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    :class="{ 'border-red-500': errors.name }"
                    placeholder="Your full name"
                    required
                  />
                  <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
                </div>

                <!-- Email Field -->
                <div>
                  <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    v-model="form.email"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    :class="{ 'border-red-500': errors.email }"
                    placeholder="your@email.com"
                    required
                  />
                  <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                </div>


                <!-- Message Field -->
                <div>
                  <label for="message" class="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="6"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                    :class="{ 'border-red-500': errors.message }"
                    placeholder="Tell us more about your inquiry..."
                    required
                  ></textarea>
                  <p v-if="errors.message" class="text-red-500 text-sm mt-1">{{ errors.message }}</p>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to text-white font-semibold py-4 px-8 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span v-if="!isSubmitting" class="flex items-center justify-center">
                    Send Message
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                </button>

                <!-- Success/Error Messages -->
                <div v-if="submitMessage" class="mt-6 p-4 rounded-lg" :class="submitSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'">
                  <div class="flex items-center">
                    <svg v-if="submitSuccess" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    {{ submitMessage }}
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
