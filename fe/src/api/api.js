import axios from 'axios';

// API Response validation
class APIError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'APIError';
    this.details = details;
  }
}

const validateAPIResponse = (response) => {
  console.log('Validating API Response:', {
    responseType: typeof response,
    hasSuccess: response?.success !== undefined,
    hasData: response?.data !== undefined,
    hasError: response?.error !== undefined,
    fullResponse: response
  });

  if (!response || typeof response !== 'object') {
    throw new APIError('Invalid API response: not an object');
  }

  if (typeof response.success !== 'boolean') {
    throw new APIError('Invalid API response: missing success flag');
  }

  if (!response.data && !response.error) {
    throw new APIError('Invalid API response: missing data or error');
  }

  if (response.error && typeof response.error.message !== 'string') {
    throw new APIError('Invalid API response: invalid error format');
  }

  return response;
};

// Read raw base URL from env or fallback
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3033';

// Normalize by removing trailing slashes and any trailing "/api"
const normalizedBaseUrl = rawBaseUrl
  .replace(/\/+$/, '')       // trim trailing slashes
  .replace(/\/api$/, '');    // trim a single trailing /api

// Final API base always appends a single /api
const apiBaseUrl = `${normalizedBaseUrl}/api`;
console.log('API baseURL', apiBaseUrl);

// Create axios instance with normalized base URL
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Test endpoint
export const testApi = async () => {
  try {
    const response = await api.get('/health');
    const validatedResponse = validateAPIResponse(response.data);
    return validatedResponse.data;
  } catch (error) {
    if (error instanceof APIError) {
      console.error('API Response Validation Error:', error.message);
    } else {
      console.error('Test API Error:', error);
    }
    throw error;
  }
};

export const login = async (password) => {
  try {
    console.log('Sending login request...');
    const response = await api.post('/auth/login', { password });
    console.log('Raw login response:', response.data);
    
    // Simple and direct approach - extract token from the known backend structure
    const backendResponse = response.data;
    
    // Backend returns: { success: true, data: { token: "..." }, message: "..." }
    if (backendResponse && backendResponse.success && backendResponse.data && backendResponse.data.token) {
      const token = backendResponse.data.token;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      // Add token to default headers for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('Login successful, token stored');
      
      // Return exactly what the Login component expects
      return {
        token: token,
        success: true,
        message: backendResponse.message || 'Login successful'
      };
    } else {
      console.error('Invalid backend response structure:', backendResponse);
      throw new Error('Invalid login response from server');
    }
  } catch (error) {
    console.error('Login Error:', error);
    
    // If it's an HTTP error, try to extract a meaningful message
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error?.message || 'Login failed');
    } else {
      throw new Error(error.message || 'Login failed');
    }
  }
};

export const getContent = async () => {
  try {
    console.log('Fetching content...');
    const response = await api.get('/content');
    console.log('Raw API Response:', response.data);
    
    // Simple and direct approach - handle the known backend structure
    const backendResponse = response.data;
    
    // Backend returns: { success: true, data: { ...content OR data: {...} } }
    if (backendResponse && backendResponse.success && backendResponse.data) {
      let contentData = {};
      
      // Handle nested structure: data.data (what we're seeing in production)
      if (backendResponse.data.data && typeof backendResponse.data.data === 'object') {
        contentData = backendResponse.data.data;
        console.log('Using nested data structure');
      }
      // Handle direct structure: data contains the content directly
      else if (backendResponse.data.branding || backendResponse.data.navigation) {
        contentData = { ...backendResponse.data };
        delete contentData._metadata; // Remove metadata if present
        console.log('Using direct data structure');
      }
      // Fallback: use data as-is
      else {
        contentData = { ...backendResponse.data };
        console.log('Using fallback data structure');
      }
      
      console.log('Final content data:', {
        hasRequiredFields: Boolean(contentData.branding && contentData.navigation),
        contentKeys: Object.keys(contentData),
        sampleData: {
          hasHero: Boolean(contentData.hero),
          hasAbout: Boolean(contentData.about),
          hasPrograms: Boolean(contentData.programs)
        }
      });
      
      return contentData;
    } else {
      console.error('Invalid backend response structure:', backendResponse);
      throw new Error('Invalid content response from server');
    }
  } catch (error) {
    console.error('Get Content Error:', error);
    
    // If it's an HTTP error, try to extract a meaningful message
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error?.message || 'Failed to load content');
    } else {
      throw new Error(error.message || 'Failed to load content');
    }
  }
};

export const updateContent = async (content) => {
  try {
    const response = await api.put('/content', content);
    const validatedResponse = validateAPIResponse(response.data);
    return validatedResponse.data;
  } catch (error) {
    if (error instanceof APIError) {
      console.error('API Response Validation Error:', error.message);
    } else {
      console.error('Update Content Error:', error);
    }
    throw error;
  }
};

export const submitContactForm = async (formData) => {
  try {
    console.log('Submitting contact form...', formData);
    const response = await api.post('/contact', formData);
    console.log('Raw contact response:', response.data);
    
    // Simple and direct approach - handle the known backend structure
    const backendResponse = response.data;
    
    // Backend should return: { success: true, data: { ... }, message: "..." }
    if (backendResponse && backendResponse.success) {
      console.log('Contact form submitted successfully');
      return {
        success: true,
        message: backendResponse.message || 'Message sent successfully'
      };
    } else {
      console.error('Invalid backend response structure:', backendResponse);
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Contact Form Error:', error);
    
    // If it's an HTTP error, try to extract a meaningful message
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error?.message || 'Failed to send message');
    } else {
      throw new Error(error.message || 'Failed to send message');
    }
  }
};

// Initialize auth header from localStorage
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const getMessages = async (params = {}) => {
  try {
    console.log('Fetching messages...', params);
    
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.subject) queryParams.append('subject', params.subject);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/messages?${queryString}` : '/messages';
    
    const response = await api.get(url);
    console.log('Raw messages response:', response.data);
    
    // Simple and direct approach - handle the known backend structure
    const backendResponse = response.data;
    
    if (backendResponse && backendResponse.success && backendResponse.data) {
      console.log('Messages retrieved successfully');
      return backendResponse.data;
    } else {
      console.error('Invalid backend response structure:', backendResponse);
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Get Messages Error:', error);
    
    // If it's an HTTP error, try to extract a meaningful message
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error?.message || 'Failed to load messages');
    } else {
      throw new Error(error.message || 'Failed to load messages');
    }
  }
};

export const updateMessageStatus = async (messageId, status, adminNotes) => {
  try {
    console.log('Updating message status...', { messageId, status, adminNotes });
    
    const response = await api.patch(`/messages/${messageId}/status`, {
      status,
      adminNotes
    });
    console.log('Raw update response:', response.data);
    
    // Simple and direct approach - handle the known backend structure
    const backendResponse = response.data;
    
    if (backendResponse && backendResponse.success) {
      console.log('Message status updated successfully');
      return {
        success: true,
        message: backendResponse.message || 'Status updated successfully'
      };
    } else {
      console.error('Invalid backend response structure:', backendResponse);
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Update Message Status Error:', error);
    
    // If it's an HTTP error, try to extract a meaningful message
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error?.message || 'Failed to update message status');
    } else {
      throw new Error(error.message || 'Failed to update message status');
    }
  }
};

export default api;

