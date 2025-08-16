import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// API client configuration
const apiClient = axios.create({
  baseURL: API,
  timeout: 120000, // 2 minutes for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Extract text from PDF file
export const extractPDFText = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await apiClient.post('/extract-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to extract PDF text');
  }
};

// Customize resume using AI
export const customizeResume = async (resumeText, jobDescription, sessionId = null) => {
  try {
    const response = await apiClient.post('/customize-resume', {
      resume_text: resumeText,
      job_description: jobDescription,
      session_id: sessionId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to customize resume');
  }
};

// Get processing history for a session
export const getProcessingHistory = async (sessionId) => {
  try {
    const response = await apiClient.get(`/history/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to get processing history');
  }
};

export default apiClient;