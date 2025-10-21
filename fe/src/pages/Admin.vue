<template>
  <AdminLayout>
    <div class="px-4 py-6 sm:px-0">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Landing Page Editor</h1>
          <p class="mt-2 text-sm text-gray-600">Edit your website's landing page content here.</p>
        </div>

        <div v-if="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading content...</p>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-8 pb-24">
          <!-- Branding Section -->
          <div class="section-card">
            <h2 class="section-title">Branding</h2>
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label class="form-label">Logo Path</label>
                <ImagePreview
                  v-model="formData.branding.logo"
                  placeholder="Enter logo path"
                  :alt="formData.branding.alt"
                />
              </div>
              <div>
                <label class="form-label">Logo Alt Text</label>
                <input
                  v-model="formData.branding.alt"
                  type="text"
                  placeholder="Enter logo alt text"
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Navigation Section -->
          <div class="section-card">
            <h2 class="section-title">Navigation</h2>
            
            <!-- Logo Settings -->
            <div class="mb-8">
              <h3 class="subsection-title">Logo Settings</h3>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="form-label">Logo Image</label>
                  <ImagePreview
                    v-model="formData.navigation.logo.image"
                    placeholder="Enter logo image path"
                    :alt="formData.navigation.logo.alt"
                  />
                </div>
                <div>
                  <label class="form-label">Logo Text</label>
                  <input
                    v-model="formData.navigation.logo.text"
                    type="text"
                    placeholder="Enter logo text"
                    class="form-input"
                  />
                </div>
                <div>
                  <label class="form-label">Logo Alt Text</label>
                  <input
                    v-model="formData.navigation.logo.alt"
                    type="text"
                    placeholder="Enter logo alt text"
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <!-- Navigation Links -->
            <div class="mb-8">
              <div class="flex justify-between items-center mb-4">
                <h3 class="subsection-title mb-0">Navigation Links</h3>
                <button
                  type="button"
                  @click="addNavigationLink"
                  class="add-button"
                >
                  <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Link
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="(link, index) in formData.navigation.links" :key="index" class="array-item">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="form-label">Text</label>
                      <input
                        v-model="link.text"
                        type="text"
                        placeholder="Enter link text"
                        class="form-input"
                      />
                    </div>
                    <div class="relative">
                      <label class="form-label">Link</label>
                      <div class="flex">
                        <input
                          v-model="link.href"
                          type="text"
                          placeholder="Enter URL or path"
                          class="form-input"
                        />
                        <button
                          type="button"
                          @click="removeNavigationLink(index)"
                          class="remove-button ml-2"
                        >
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <div>
              <h3 class="subsection-title">Call to Action</h3>
              <div class="array-item">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Text</label>
                    <input
                      v-model="formData.navigation.cta.text"
                      type="text"
                      placeholder="Enter CTA text"
                      class="form-input"
                    />
                  </div>
                  <div>
                    <label class="form-label">Link</label>
                    <input
                      v-model="formData.navigation.cta.href"
                      type="text"
                      placeholder="Enter CTA URL or path"
                      class="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hero Section -->
          <div class="bg-white shadow sm:rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Hero Section</h2>
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input
                  v-model="formData.hero.title"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  v-model="formData.hero.subtitle"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <!-- Hero Buttons -->
              <div>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-medium text-gray-900">Buttons</h3>
                  <button
                    type="button"
                    @click="addHeroButton"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Button
                  </button>
                </div>
                <div v-for="(button, index) in formData.hero.buttons" :key="index" class="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Text</label>
                    <input
                      v-model="button.text"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Link</label>
                    <input
                      v-model="button.href"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="relative">
                    <label class="block text-sm font-medium text-gray-700">Type</label>
                    <div class="flex">
                      <select
                        v-model="button.type"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                      </select>
                      <button
                        type="button"
                        @click="removeHeroButton(index)"
                        class="ml-2 mt-1 inline-flex items-center p-1.5 border border-transparent rounded-md text-red-600 bg-red-100 hover:bg-red-200"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- About Section -->
          <div class="bg-white shadow sm:rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">About Section</h2>
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input
                  v-model="formData.about.title"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  v-model="formData.about.subtitle"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <!-- Paragraphs -->
              <div>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-medium text-gray-900">Paragraphs</h3>
                  <button
                    type="button"
                    @click="addParagraph"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Paragraph
                  </button>
                </div>
                <div v-for="(paragraph, index) in formData.about.paragraphs" :key="index" class="mb-4">
                  <div class="flex">
                    <textarea
                      v-model="formData.about.paragraphs[index]"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    ></textarea>
                    <button
                      type="button"
                      @click="removeParagraph(index)"
                      class="ml-2 mt-1 inline-flex items-center p-1.5 border border-transparent rounded-md text-red-600 bg-red-100 hover:bg-red-200"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Callout -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Callout</h3>
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      v-model="formData.about.callout.title"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                      v-model="formData.about.callout.content"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Programs Section -->
          <div class="bg-white shadow sm:rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Programs</h2>
              <button
                type="button"
                @click="addProgram"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                Add Program
              </button>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4">Title</label>
              <input
                v-model="formData.programs.title"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div class="mt-6 space-y-6">
              <div v-for="(program, index) in formData.programs.items" :key="index" class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-lg font-medium text-gray-900">Program {{ index + 1 }}</h3>
                  <button
                    type="button"
                    @click="removeProgram(index)"
                    class="inline-flex items-center p-1.5 border border-transparent rounded-md text-red-600 bg-red-100 hover:bg-red-200"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Icon</label>
                    <input
                      v-model="program.icon"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      v-model="program.title"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      v-model="program.description"
                      rows="2"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                  <div v-if="program.link" class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Link Text</label>
                      <input
                        v-model="program.link.text"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Link URL</label>
                      <input
                        v-model="program.link.href"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Section -->
          <div class="bg-white shadow sm:rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Footer</h2>
            
            <!-- Branding -->
            <div class="mb-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Branding</h3>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    v-model="formData.footer.branding.title"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Tagline</label>
                  <input
                    v-model="formData.footer.branding.tagline"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <!-- Quick Links -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium text-gray-900">Quick Links</h3>
                <button
                  type="button"
                  @click="addQuickLink"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                >
                  Add Link
                </button>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  v-model="formData.footer.quickLinks.title"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div class="mt-4 space-y-4">
                <div v-for="(link, index) in formData.footer.quickLinks.links" :key="index" class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Text</label>
                    <input
                      v-model="link.text"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="relative">
                    <label class="block text-sm font-medium text-gray-700">Link</label>
                    <div class="flex">
                      <input
                        v-model="link.href"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        @click="removeQuickLink(index)"
                        class="ml-2 mt-1 inline-flex items-center p-1.5 border border-transparent rounded-md text-red-600 bg-red-100 hover:bg-red-200"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed Save Button -->
          <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div class="flex justify-end items-center space-x-4">
                <p 
                  v-if="saveStatus" 
                  :class="{
                    'text-green-600': saveStatus === 'Saved successfully!',
                    'text-red-600': saveStatus === 'Failed to save. Please try again.',
                    'text-gray-600': saveStatus === 'Saving...'
                  }"
                  class="text-sm font-medium"
                >
                  {{ saveStatus }}
                </p>
                <button
                  type="submit"
                  :disabled="saveStatus === 'Saving...'"
                  class="save-button"
                >
                  <svg 
                    v-if="saveStatus === 'Saving...'" 
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ saveStatus === 'Saving...' ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </div>
        </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '../components/AdminLayout.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout, isAuthenticated } from '../utils/auth'
import { getContent, updateContent } from '../api/api'
import ImagePreview from '../components/ImagePreview.vue'

const router = useRouter()
const isLoading = ref(true)
const saveStatus = ref('')
const isMenuOpen = ref(false)

// Simple default content structure - no complex merging needed
const defaultContent = {
  branding: { logo: '', alt: 'Logo' },
  navigation: { logo: { image: '', text: '', alt: 'Logo' }, links: [], cta: { text: '', href: '#' } },
  hero: { title: '', subtitle: '', buttons: [] },
  about: { title: '', subtitle: '', paragraphs: [], callout: { title: '', content: '' } },
  programs: { title: '', items: [] },
  cta: { title: '', subtitle: '', buttons: [] },
  footer: { branding: { title: '', tagline: '' }, quickLinks: { title: '', links: [] } }
};

const formData = ref({ ...defaultContent });

onMounted(async () => {
  console.log('Admin component mounting...');
  console.log('Initial formData:', formData.value);

  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to login');
    router.push('/login')
    return
  }

  // Only fetch if we haven't loaded content yet
  if (isLoading.value) {
    try {
      console.log('Fetching content from API...');
      const content = await getContent();
      console.log('Received content from API:', content);

      // Simple assignment - use API content directly with fallback to defaults
      formData.value = {
        ...defaultContent,
        ...content
      };
      
      console.log('Updated formData:', formData.value);
    } catch (error) {
      console.error('Failed to load content:', {
        error,
        message: error.message,
        stack: error.stack
      });
    } finally {
      isLoading.value = false;
    }
  } else {
    console.log('Content already loaded, using cached formData:', formData.value);
  }
})

const handleLogout = () => {
  logout()
  router.push('/')
}

const handleSubmit = async () => {
  try {
    saveStatus.value = 'Saving...'
    await updateContent(formData.value)
    saveStatus.value = 'Saved successfully!'
    setTimeout(() => {
      saveStatus.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to save content:', error)
    saveStatus.value = 'Failed to save. Please try again.'
  }
}

// Navigation Links
const addNavigationLink = () => {
  formData.value.navigation.links.push({ text: '', href: '' })
}

const removeNavigationLink = (index) => {
  formData.value.navigation.links.splice(index, 1)
}

// Hero Buttons
const addHeroButton = () => {
  formData.value.hero.buttons.push({ text: '', href: '', type: 'primary' })
}

const removeHeroButton = (index) => {
  formData.value.hero.buttons.splice(index, 1)
}

// About Paragraphs
const addParagraph = () => {
  formData.value.about.paragraphs.push('')
}

const removeParagraph = (index) => {
  formData.value.about.paragraphs.splice(index, 1)
}

// Programs
const addProgram = () => {
  formData.value.programs.items.push({
    icon: '',
    title: '',
    description: '',
    link: {
      text: '',
      href: '',
      external: false
    }
  })
}

const removeProgram = (index) => {
  formData.value.programs.items.splice(index, 1)
}

// Quick Links
const addQuickLink = () => {
  formData.value.footer.quickLinks.links.push({ text: '', href: '' })
}

const removeQuickLink = (index) => {
  formData.value.footer.quickLinks.links.splice(index, 1)
}
</script>

<style>
/* Custom form styles */
.form-input {
  @apply block w-full rounded-md border-2 border-gray-300 shadow-sm 
         focus:border-indigo-500 focus:ring-indigo-500
         px-3 py-2 text-gray-900 placeholder-gray-500
         hover:border-gray-400 transition-colors duration-200;
}

.form-textarea {
  @apply block w-full rounded-md border-2 border-gray-300 shadow-sm 
         focus:border-indigo-500 focus:ring-indigo-500
         px-3 py-2 text-gray-900 placeholder-gray-500
         hover:border-gray-400 transition-colors duration-200;
}

.form-select {
  @apply block w-full rounded-md border-2 border-gray-300 shadow-sm 
         focus:border-indigo-500 focus:ring-indigo-500
         px-3 py-2 text-gray-900
         hover:border-gray-400 transition-colors duration-200;
}

.section-card {
  @apply bg-white shadow-md rounded-lg p-6 border border-gray-100
         hover:shadow-lg transition-shadow duration-200;
}

.section-title {
  @apply text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200;
}

.subsection-title {
  @apply text-lg font-medium text-gray-900 mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.array-item {
  @apply bg-gray-50 p-4 rounded-lg border border-gray-200 
         hover:border-gray-300 transition-colors duration-200;
}

.add-button {
  @apply inline-flex items-center px-3 py-1.5 border border-transparent 
         text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 
         hover:bg-indigo-200 transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}

.remove-button {
  @apply inline-flex items-center p-1.5 border border-transparent rounded-md 
         text-red-600 bg-red-100 hover:bg-red-200 transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500;
}

.save-button {
  @apply inline-flex items-center px-4 py-2 border border-transparent 
         text-sm font-medium rounded-md shadow-sm text-white 
         bg-indigo-600 hover:bg-indigo-700 
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-colors duration-200;
}
</style>