// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Verification Constants
export const VERIFICATION_CONSTANTS = {
  GRACE_PERIOD_DAYS: 15,
  DOCUMENT_VERIFICATION_TIME: '24-48 hours',
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
};

// Error Messages
export const ERROR_MESSAGES = {
  EMAIL_SEND_FAILED: 'Failed to send verification email. Please try again.',
  DOCUMENT_UPLOAD_FAILED: 'Failed to upload documents. Please try again.',
  VERIFICATION_FAILED: 'Verification failed. Please try again.',
};
