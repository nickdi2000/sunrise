<template>
  <AdminLayout>
    <div class="px-4 py-6 sm:px-0">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">QR Code Management</h1>
        <p class="mt-2 text-sm text-gray-600">Create and manage QR codes that redirect to external URLs.</p>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="statusMessage" class="mb-6">
        <div 
          :class="{
            'bg-green-50 border-green-200 text-green-800': statusType === 'success',
            'bg-red-50 border-red-200 text-red-800': statusType === 'error'
          }"
          class="border rounded-lg p-4 flex items-center justify-between"
        >
          <div class="flex items-center">
            <svg 
              v-if="statusType === 'success'"
              class="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg 
              v-else
              class="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{{ statusMessage }}</span>
          </div>
          <button @click="clearStatus" class="text-gray-500 hover:text-gray-700">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading QR codes...</p>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Create New QR Code Button -->
        <div class="mb-6">
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
          >
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New QR Code
          </button>
        </div>

        <!-- QR Codes List -->
        <div v-if="qrCodes.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No QR codes</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new QR code.</p>
        </div>

        <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul class="divide-y divide-gray-200">
            <li v-for="qr in qrCodes" :key="qr.id" class="hover:bg-gray-50 transition-colors">
              <div class="px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div class="h-10 w-10 rounded bg-indigo-100 flex items-center justify-center">
                          <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2">
                          <h3 class="text-sm font-medium text-gray-900 truncate">{{ qr.code }}</h3>
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {{ qr.clickCount || 0 }} clicks
                          </span>
                        </div>
                        <p v-if="qr.description" class="mt-1 text-sm text-gray-500 truncate">{{ qr.description }}</p>
                        <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <div class="flex items-center">
                            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <a :href="qr.link" target="_blank" class="hover:text-indigo-600 truncate max-w-xs">{{ qr.link }}</a>
                          </div>
                          <div class="flex items-center">
                            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span class="font-mono text-xs">{{ qr.qrUrl }}</span>
                            <button
                              @click="copyToClipboard(qr.qrUrl)"
                              class="ml-2 text-indigo-600 hover:text-indigo-800"
                              title="Copy QR URL"
                            >
                              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 ml-4">
                    <button
                      @click="viewQRCode(qr)"
                      class="inline-flex items-center px-3 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors"
                    >
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      View QR
                    </button>
                    <button
                      @click="openEditModal(qr)"
                      class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      @click="confirmDelete(qr)"
                      class="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                    >
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditMode ? 'Edit QR Code' : 'Create New QR Code' }}
            </h3>
          </div>
          <form @submit.prevent="handleSubmit" class="px-6 py-4 space-y-4">
            <!-- Code Field (disabled in edit mode) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Code <span class="text-red-500">*</span>
                <span v-if="isEditMode" class="text-gray-500 text-xs">(cannot be changed)</span>
              </label>
              <input
                v-model="formData.code"
                type="text"
                :disabled="isEditMode"
                :class="{
                  'bg-gray-100 cursor-not-allowed': isEditMode
                }"
                placeholder="e.g., youth-signup"
                class="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-gray-900 placeholder-gray-500"
                required
              />
              <p class="mt-1 text-xs text-gray-500">Only letters, numbers, hyphens, and underscores allowed</p>
              <p class="mt-1 text-xs text-indigo-600 font-medium">
                QR URL will be: https://evolvecommunities.com/qr/{{ formData.code || 'your-code' }}
              </p>
            </div>

            <!-- Link Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Redirect Link <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.link"
                type="url"
                placeholder="https://example.com/destination"
                class="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-gray-900 placeholder-gray-500"
                required
              />
              <p class="mt-1 text-xs text-gray-500">Must start with http:// or https://</p>
            </div>

            <!-- Description Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                v-model="formData.description"
                rows="3"
                placeholder="Brief description of what this QR code is for..."
                class="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-gray-900 placeholder-gray-500"
              ></textarea>
            </div>

            <!-- Modal Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg 
                  v-if="isSaving" 
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSaving ? 'Saving...' : (isEditMode ? 'Update QR Code' : 'Create QR Code') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50" @click.self="cancelDelete">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Delete QR Code</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete the QR code "{{ qrToDelete?.code }}"? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              @click="cancelDelete"
              class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="isSaving"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg 
                v-if="isSaving" 
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSaving ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>

      <!-- QR Code Viewer Modal -->
      <div v-if="showQRModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50" @click.self="closeQRModal">
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">QR Code: {{ viewingQR?.code }}</h3>
              <button @click="closeQRModal" class="text-gray-400 hover:text-gray-600">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="px-6 py-6">
            <div class="text-center">
              <!-- QR Code Canvas -->
              <div class="flex justify-center mb-4">
                <canvas ref="qrCanvas" class="border-4 border-gray-200 rounded-lg"></canvas>
              </div>
              
              <!-- QR Details -->
              <div class="space-y-2 text-sm text-left bg-gray-50 rounded-lg p-4 mb-4">
                <div>
                  <span class="font-medium text-gray-700">Code:</span>
                  <span class="ml-2 text-gray-900 font-mono">{{ viewingQR?.code }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">URL:</span>
                  <a :href="viewingQR?.qrUrl" target="_blank" class="ml-2 text-indigo-600 hover:text-indigo-800 font-mono break-all">
                    {{ viewingQR?.qrUrl }}
                  </a>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Redirects to:</span>
                  <a :href="viewingQR?.link" target="_blank" class="ml-2 text-indigo-600 hover:text-indigo-800 break-all">
                    {{ viewingQR?.link }}
                  </a>
                </div>
                <div v-if="viewingQR?.description">
                  <span class="font-medium text-gray-700">Description:</span>
                  <span class="ml-2 text-gray-900">{{ viewingQR?.description }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Clicks:</span>
                  <span class="ml-2 text-gray-900">{{ viewingQR?.clickCount || 0 }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-3">
                <button
                  @click="downloadQRCode('png')"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
                >
                  <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PNG
                </button>
                <button
                  @click="downloadQRCode('svg')"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download SVG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '../components/AdminLayout.vue'
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated } from '../utils/auth'
import { getQRCodes, createQRCode, updateQRCode, deleteQRCode } from '../api/api'
import QRCode from 'qrcode'

const router = useRouter()
const isLoading = ref(true)
const isSaving = ref(false)
const qrCodes = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const showQRModal = ref(false)
const isEditMode = ref(false)
const qrToDelete = ref(null)
const viewingQR = ref(null)
const qrCanvas = ref(null)

const statusMessage = ref('')
const statusType = ref('success') // 'success' or 'error'

const formData = ref({
  code: '',
  link: '',
  description: ''
})

const editingQR = ref(null)

onMounted(async () => {
  console.log('QRCodes component mounting...')

  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to login')
    router.push('/login')
    return
  }

  await loadQRCodes()
})

const loadQRCodes = async () => {
  try {
    isLoading.value = true
    console.log('Fetching QR codes...')
    const data = await getQRCodes()
    console.log('QR codes data:', JSON.stringify(data))
    qrCodes.value = data.qrCodes || []
  } catch (error) {
    console.error('Failed to load QR codes:', {
      error,
      message: error.message,
      stack: error.stack
    })
    showStatus('Failed to load QR codes: ' + error.message, 'error')
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  isEditMode.value = false
  formData.value = {
    code: '',
    link: '',
    description: ''
  }
  editingQR.value = null
  showModal.value = true
}

const openEditModal = (qr) => {
  isEditMode.value = true
  formData.value = {
    code: qr.code,
    link: qr.link,
    description: qr.description || ''
  }
  editingQR.value = qr
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    code: '',
    link: '',
    description: ''
  }
  editingQR.value = null
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    
    if (isEditMode.value) {
      // Update existing QR code (only link and description)
      await updateQRCode(editingQR.value.id, {
        link: formData.value.link,
        description: formData.value.description
      })
      showStatus('QR code updated successfully!', 'success')
    } else {
      // Create new QR code
      await createQRCode({
        code: formData.value.code,
        link: formData.value.link,
        description: formData.value.description
      })
      showStatus('QR code created successfully!', 'success')
    }
    
    closeModal()
    await loadQRCodes()
  } catch (error) {
    console.error('Failed to save QR code:', {
      error,
      message: error.message,
      stack: error.stack
    })
    showStatus(error.message, 'error')
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = (qr) => {
  qrToDelete.value = qr
  showDeleteModal.value = true
}

const cancelDelete = () => {
  qrToDelete.value = null
  showDeleteModal.value = false
}

const handleDelete = async () => {
  try {
    isSaving.value = true
    await deleteQRCode(qrToDelete.value.id)
    showStatus('QR code deleted successfully!', 'success')
    cancelDelete()
    await loadQRCodes()
  } catch (error) {
    console.error('Failed to delete QR code:', {
      error,
      message: error.message,
      stack: error.stack
    })
    showStatus(error.message, 'error')
  } finally {
    isSaving.value = false
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showStatus('URL copied to clipboard!', 'success')
  } catch (error) {
    console.error('Failed to copy:', error)
    showStatus('Failed to copy URL', 'error')
  }
}

const showStatus = (message, type = 'success') => {
  statusMessage.value = message
  statusType.value = type
  
  // Auto-clear success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      clearStatus()
    }, 5000)
  }
}

const clearStatus = () => {
  statusMessage.value = ''
}

const viewQRCode = async (qr) => {
  viewingQR.value = qr
  showQRModal.value = true
  
  // Wait for the modal to render and the canvas to be available
  await nextTick()
  
  // Generate QR code on the canvas
  if (qrCanvas.value) {
    try {
      await QRCode.toCanvas(qrCanvas.value, qr.qrUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      console.log('QR code generated successfully')
    } catch (error) {
      console.error('Failed to generate QR code:', {
        error,
        message: error.message,
        stack: error.stack
      })
      showStatus('Failed to generate QR code', 'error')
    }
  }
}

const closeQRModal = () => {
  showQRModal.value = false
  viewingQR.value = null
}

const downloadQRCode = async (format) => {
  if (!viewingQR.value) return
  
  try {
    const filename = `qr-${viewingQR.value.code}.${format}`
    
    if (format === 'png') {
      // Download as PNG from canvas
      if (qrCanvas.value) {
        const url = qrCanvas.value.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = filename
        link.href = url
        link.click()
        showStatus('QR code downloaded as PNG!', 'success')
      }
    } else if (format === 'svg') {
      // Generate and download as SVG
      const svgString = await QRCode.toString(viewingQR.value.qrUrl, {
        type: 'svg',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = filename
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
      showStatus('QR code downloaded as SVG!', 'success')
    }
  } catch (error) {
    console.error('Failed to download QR code:', {
      error,
      message: error.message,
      stack: error.stack
    })
    showStatus('Failed to download QR code', 'error')
  }
}
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style>

