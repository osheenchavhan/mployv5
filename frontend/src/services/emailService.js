import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    // You can add auth token here when authentication is implemented
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const sendVerificationEmail = async (email, companyName) => {
  try {
    const response = await api.post('/api/auth/send-verification', {
      email,
      companyName,
      type: 'business_verification'
    });
    
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to send verification email';
    console.error('Error sending verification email:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const verifyEmailToken = async (token) => {
  try {
    const response = await api.post('/api/auth/verify-email', {
      token
    });
    
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to verify email';
    console.error('Error verifying email:', errorMessage);
    throw new Error(errorMessage);
  }
};
