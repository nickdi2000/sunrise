import axios from 'axios';

const apiBaseUrl = 'http://localhost:3033/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testGetContent() {
  try {
    console.log('Making request to:', `${apiBaseUrl}/content`);
    const response = await api.get('/content');
    console.log('Raw response status:', response.status);
    console.log('Raw response headers:', response.headers);
    console.log('Raw response data type:', typeof response.data);
    console.log('Raw response data keys:', Object.keys(response.data || {}));
    console.log('Full response data:', JSON.stringify(response.data, null, 2));
    
    // Simulate the processing that happens in the API layer
    const backendResponse = response.data;
    
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
      
      console.log('Final content data keys:', Object.keys(contentData));
      console.log('Has branding?', !!contentData.branding);
      console.log('Has navigation?', !!contentData.navigation);
      console.log('Has hero?', !!contentData.hero);
      console.log('Hero title:', contentData.hero?.title);
      console.log('Hero subtitle:', contentData.hero?.subtitle);
      
      return contentData;
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testGetContent();