/**
 * @fileoverview Email Service for handling all email-related operations
 * 
 * This service manages email verification flows in the application, particularly
 * for business verification processes. It provides a centralized way to handle
 * email operations with proper error handling and type safety.
 * 
 * Key Features:
 * - Business email verification
 * - Email token verification
 * - Centralized error handling
 * - Axios instance configuration
 * 
 * @package services
 * @lastModified 2024-12-10
 */

import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

/**
 * Axios instance configured for email service operations
 * @constant {AxiosInstance}
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for adding authentication tokens
 * @description Currently prepared for future auth implementation
 */
api.interceptors.request.use(
  (config) => {
    // You can add auth token here when authentication is implemented
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Sends a verification email to a business email address
 * @async
 * @function sendVerificationEmail
 * @param {string} email - The business email address to verify
 * @param {string} companyName - Name of the company for email personalization
 * @returns {Promise<Object>} Object containing success status and message
 * @throws {Error} If email sending fails
 * 
 * @example
 * try {
 *   const result = await sendVerificationEmail('business@company.com', 'Tech Corp');
 *   console.log(result.message); // "Verification email sent successfully"
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
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

/**
 * Verifies an email token received from verification email
 * @async
 * @function verifyEmailToken
 * @param {string} token - The verification token received via email
 * @returns {Promise<Object>} Object containing success status and message
 * @throws {Error} If token verification fails
 * 
 * @example
 * try {
 *   const result = await verifyEmailToken('verification-token-123');
 *   console.log(result.message); // "Email verified successfully"
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
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
