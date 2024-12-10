/**
 * @fileoverview Firebase Configuration and Initialization
 * 
 * This module handles the configuration and initialization of Firebase services
 * for the application. It manages environment variables, validates configuration,
 * and exports initialized Firebase instances for auth and Firestore.
 * 
 * Key Features:
 * - Environment variable management
 * - Configuration validation
 * - Firebase initialization
 * - Secure logging practices
 * - Service instance exports
 * 
 * Security Note:
 * This file handles sensitive configuration data. Always ensure:
 * 1. API keys and credentials are stored in environment variables
 * 2. Sensitive data is not logged in production
 * 3. Configuration is validated before initialization
 * 
 * @package services/firebase
 * @lastModified 2024-12-10
 */

// Import the functions you need from the SDKs you need
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from '@env';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration object
 * @constant {Object} firebaseConfig
 * @property {string} apiKey - Firebase API key from environment
 * @property {string} authDomain - Firebase auth domain
 * @property {string} projectId - Firebase project ID
 * @property {string} storageBucket - Firebase storage bucket
 * @property {string} messagingSenderId - Firebase messaging sender ID
 * @property {string} appId - Firebase application ID
 */
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

/**
 * Validates Firebase configuration
 * @function validateConfig
 * @throws {Error} If any required configuration field is missing
 * 
 * @example
 * try {
 *   validateConfig();
 *   console.log('Firebase configuration is valid');
 * } catch (error) {
 *   console.error('Firebase configuration error:', error.message);
 * }
 */
const validateConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];
  
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}. Please check your .env file.`);
  }
};

// Initialize Firebase with validation
validateConfig();
console.log('Initializing Firebase with config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey.substring(0, 5) + '...'  // Only log part of the API key for security
});

/**
 * Initialized Firebase application instance
 * @constant {FirebaseApp} app
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance
 * @constant {Auth}
 * @exports auth
 */
export const auth = getAuth(app);

/**
 * Firebase Firestore instance
 * @constant {Firestore}
 * @exports db
 */
export const db = getFirestore(app);

console.log('Firebase initialized successfully');

/**
 * Default export of initialized Firebase app
 * @exports app
 */
export default app;
