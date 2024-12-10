/**
 * @fileoverview Application Constants
 * 
 * This file defines global constants used throughout the Mploy application.
 * It includes configuration for API endpoints, verification settings, and
 * standardized error messages.
 * 
 * Key Features:
 * - API endpoint configuration
 * - Document verification settings
 * - Standardized error messages
 * - File upload constraints
 * 
 * Usage:
 * ```javascript
 * import { API_BASE_URL, VERIFICATION_CONSTANTS } from './constants';
 * 
 * // Using API URL
 * fetch(`${API_BASE_URL}/endpoint`);
 * 
 * // Checking file size
 * if (fileSize > VERIFICATION_CONSTANTS.MAX_DOCUMENT_SIZE) {
 *   throw new Error('File too large');
 * }
 * ```
 * 
 * @package config
 * @lastModified 2024-12-10
 */

/**
 * Base URL for API endpoints
 * Falls back to localhost if environment variable is not set
 * @constant {string}
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Constants related to user and document verification
 * @constant {Object}
 * @property {number} GRACE_PERIOD_DAYS - Number of days allowed for document submission
 * @property {string} DOCUMENT_VERIFICATION_TIME - Expected verification processing time
 * @property {string[]} ALLOWED_DOCUMENT_TYPES - List of accepted file types
 * @property {number} MAX_DOCUMENT_SIZE - Maximum allowed file size in bytes
 */
export const VERIFICATION_CONSTANTS = {
  GRACE_PERIOD_DAYS: 15,
  DOCUMENT_VERIFICATION_TIME: '24-48 hours',
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
};

/**
 * Standardized error messages for common error scenarios
 * @constant {Object}
 * @property {string} EMAIL_SEND_FAILED - Error message for email sending failures
 * @property {string} DOCUMENT_UPLOAD_FAILED - Error message for document upload failures
 * @property {string} VERIFICATION_FAILED - Error message for verification process failures
 */
export const ERROR_MESSAGES = {
  EMAIL_SEND_FAILED: 'Failed to send verification email. Please try again.',
  DOCUMENT_UPLOAD_FAILED: 'Failed to upload documents. Please try again.',
  VERIFICATION_FAILED: 'Verification failed. Please try again.',
};
