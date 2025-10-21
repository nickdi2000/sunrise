<template>
  <AdminLayout>
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="font-display text-4xl font-bold text-gray-900 mb-2">Messages</h1>
            <p class="text-lg text-gray-600">Manage contact form submissions from your website</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-primary">{{ pagination?.totalCount || 0 }}</p>
            <p class="text-sm text-gray-600">Total Messages</p>
          </div>
        </div>
      </div>

      <!-- Filters and Controls -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <!-- Toggle Button -->
        <button 
          @click="isFiltersExpanded = !isFiltersExpanded"
          class="w-full px-6 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span class="font-medium text-gray-700 flex items-center space-x-2">
            <svg 
              :class="{'rotate-180': isFiltersExpanded}"
              class="w-5 h-5 text-gray-500 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            <span>Filters and Controls</span>
          </span>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span v-if="hasActiveFilters" class="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
              Filters Active
            </span>
            <span class="text-gray-400">{{ isFiltersExpanded ? 'Hide' : 'Show' }}</span>
          </div>
        </button>

        <!-- Filters Content -->
        <div 
          v-show="isFiltersExpanded"
          class="p-6 border-t border-gray-200"
        >
          <div class="grid md:grid-cols-4 gap-4">
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                v-model="filters.status" 
                @change="loadMessages(1)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <!-- Subject Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select 
                v-model="filters.subject" 
                @change="loadMessages(1)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">All Subjects</option>
                <option value="general">General Inquiry</option>
                <option value="programs">Programs</option>
                <option value="volunteer">Volunteer</option>
                <option value="partnership">Partnership</option>
                <option value="support">Support/Donations</option>
                <option value="sponsorships">Sponsorships</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Sort Options -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select 
                v-model="filters.sort" 
                @change="loadMessages(1)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="submittedAt">Date Submitted</option>
                <option value="status">Status</option>
                <option value="subject">Subject</option>
                <option value="name">Name</option>
              </select>
            </div>

            <!-- Order Options -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select 
                v-model="filters.order" 
                @change="loadMessages(1)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <!-- Stats Summary -->
          <div v-if="stats" class="mt-6 pt-4 border-t border-gray-200">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-red-600">{{ stats.new }}</div>
                <div class="text-sm text-gray-600">New</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ stats.read }}</div>
                <div class="text-sm text-gray-600">Read</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ stats.responded }}</div>
                <div class="text-sm text-gray-600">Responded</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-600">{{ stats.archived }}</div>
                <div class="text-sm text-gray-600">Archived</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages List -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-primary bg-white">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading messages...
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-8 text-center">
          <div class="text-red-600 mb-4">
            <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="font-semibold">Failed to load messages</p>
            <p class="text-sm text-gray-600 mt-2">{{ error }}</p>
          </div>
          <button 
            @click="loadMessages()" 
            class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Messages Table -->
        <div v-else-if="messages.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="message in messages" :key="message.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-start space-x-3">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2">
                        <p class="text-sm font-medium text-gray-900">{{ message.name }}</p>
                        <span v-if="message.status === 'new'" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          New
                        </span>
                      </div>
                      <p class="text-sm text-gray-600">{{ message.email }}</p>
                      <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ truncateMessage(message.message) }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {{ message.subjectLabel }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select 
                    :value="message.status" 
                    @change="updateStatus(message.id, $event.target.value)"
                    class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary focus:border-primary"
                    :class="getStatusClass(message.status)"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(message.submittedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="viewMessage(message)" 
                    class="text-primary hover:text-primary-dark mr-3"
                  >
                    View
                  </button>
                  <button 
                    @click="deleteMessage(message.id)" 
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="p-8 text-center">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p class="text-gray-500">No contact form messages match your current filters.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="mt-6 flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="loadMessages(pagination.page - 1)"
            :disabled="!pagination.hasPrevPage"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            @click="loadMessages(pagination.page + 1)"
            :disabled="!pagination.hasNextPage"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing page <span class="font-medium">{{ pagination.page }}</span> of <span class="font-medium">{{ pagination.totalPages }}</span>
              ({{ pagination.totalCount }} total {{ pagination.totalCount === 1 ? 'message' : 'messages' }})
            </p>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="loadMessages(1)"
              :disabled="pagination.page === 1"
              class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button 
              @click="loadMessages(pagination.page - 1)"
              :disabled="!pagination.hasPrevPage"
              class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              @click="loadMessages(pagination.page + 1)"
              :disabled="!pagination.hasNextPage"
              class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button 
              @click="loadMessages(pagination.totalPages)"
              :disabled="pagination.page === pagination.totalPages"
              class="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Message Detail Modal -->
    <div 
      v-if="selectedMessage" 
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
      @click="closeModal"
    ></div>

    <div
      v-if="selectedMessage"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeModal"
    >
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl"
          @click.stop
        >
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-xl font-semibold leading-6 text-gray-900 mb-1">
                      {{ selectedMessage.name }}
                    </h3>
                    <p class="text-sm text-gray-600">{{ selectedMessage.email }}</p>
                  </div>
                  <div class="ml-4">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(selectedMessage.status)"
                    >
                      {{ selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1) }}
                    </span>
                  </div>
                </div>

                <div class="mt-4">
                  <div class="flex justify-between items-center mb-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {{ selectedMessage.subjectLabel }}
                    </span>
                    <span class="text-sm text-gray-500">
                      {{ formatDate(selectedMessage.submittedAt) }}
                    </span>
                  </div>
                  <div class="mt-4 bg-gray-50 rounded-lg p-4">
                    <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ selectedMessage.message }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark sm:ml-3 sm:w-auto"
              @click="closeModal"
            >
              Close
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              @click="updateStatus(selectedMessage.id, 'responded')"
            >
              Mark as Responded
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '../components/AdminLayout.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { getMessages, updateMessageStatus } from '../api/api'

// State
const messages = ref([])
const pagination = ref(null)
const loading = ref(true)
const error = ref(null)
const isFiltersExpanded = ref(false)
const selectedMessage = ref(null)

// Filters
const filters = reactive({
  status: '',
  subject: '',
  sort: 'submittedAt',
  order: 'desc',
  limit: 20
})

// Load messages function
const loadMessages = async (page = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const params = {
      page,
      ...filters
    }
    
    const response = await getMessages(params)
    messages.value = response.messages || []
    pagination.value = response.pagination || null
    
    console.log('Messages loaded:', {
      count: messages.value.length,
      pagination: pagination.value
    })
  } catch (err) {
    error.value = err.message || 'Failed to load messages'
    console.error('Failed to load messages:', err)
  } finally {
    loading.value = false
  }
}

// Update message status
const updateStatus = async (messageId, newStatus) => {
  try {
    await updateMessageStatus(messageId, newStatus)
    
    // Update the message in the local list
    const messageIndex = messages.value.findIndex(m => m.id === messageId)
    if (messageIndex !== -1) {
      messages.value[messageIndex].status = newStatus
    }
    
    console.log(`Message ${messageId} status updated to ${newStatus}`)
  } catch (err) {
    console.error('Failed to update message status:', err)
    alert('Failed to update message status: ' + err.message)
  }
}

// Utility functions
const truncateMessage = (message) => {
  return message.length > 100 ? message.substring(0, 100) + '...' : message
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classes = {
    new: 'text-red-700 bg-red-50 border-red-300',
    read: 'text-blue-700 bg-blue-50 border-blue-300',
    responded: 'text-green-700 bg-green-50 border-green-300',
    archived: 'text-gray-700 bg-gray-50 border-gray-300'
  }
  return classes[status] || ''
}

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return filters.status !== '' || 
         filters.subject !== '' || 
         filters.sort !== 'submittedAt' || 
         filters.order !== 'desc'
})

// Compute stats from current messages
const stats = computed(() => {
  if (!messages.value.length) return null
  
  const statCounts = { new: 0, read: 0, responded: 0, archived: 0 }
  messages.value.forEach(msg => {
    statCounts[msg.status]++
  })
  
  return statCounts
})

// View message details
const viewMessage = (message) => {
  selectedMessage.value = message
  // If the message is new, mark it as read
  if (message.status === 'new') {
    updateStatus(message.id, 'read')
  }
}

// Close modal
const closeModal = () => {
  selectedMessage.value = null
}

// Delete message
const deleteMessage = (messageId) => {
  if (confirm('Are you sure you want to delete this message?')) {
    // TODO: Implement delete functionality
    console.log('Delete message:', messageId)
    alert('Delete functionality not yet implemented')
  }
}

// Load initial data
onMounted(() => {
  loadMessages()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>