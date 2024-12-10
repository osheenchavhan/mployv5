/**
 * @fileoverview Firebase Authentication Service
 * 
 * This service handles all authentication-related operations using Firebase Auth.
 * It provides a centralized way to manage user authentication, including registration,
 * login, logout, and password reset functionality. The service also handles storing
 * additional user data in Firestore upon registration.
 * 
 * Key Features:
 * - User registration with additional data storage
 * - Email/password authentication
 * - Password reset functionality
 * - Comprehensive error handling
 * - Firestore integration for user data
 * 
 * @package services/firebase
 * @lastModified 2024-12-10
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

/**
 * Registers a new user with email and password
 * @async
 * @function registerUser
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {Object} userData - Additional user data to store in Firestore
 * @returns {Promise<Object>} Firebase user object
 * @throws {Error} If registration fails
 * 
 * @example
 * try {
 *   const userData = {
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     userType: 'jobseeker'
 *   };
 *   const user = await registerUser('john@example.com', 'password123', userData);
 *   console.log('User registered:', user.uid);
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
export const registerUser = async (email, password, userData) => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Authenticates a user with email and password
 * @async
 * @function loginUser
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Firebase user object
 * @throws {Error} If login fails with specific error message
 * 
 * @example
 * try {
 *   const user = await loginUser('john@example.com', 'password123');
 *   console.log('User logged in:', user.uid);
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
export const loginUser = async (email, password) => {
  try {
    console.log('Attempting to sign in with email:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Sign in successful:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error.code, error.message);
    let errorMessage;
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password.';
        break;
      default:
        errorMessage = 'Failed to login. Please try again.';
    }
    throw new Error(errorMessage);
  }
};

/**
 * Signs out the current user
 * @async
 * @function logoutUser
 * @returns {Promise<void>}
 * @throws {Error} If logout fails
 * 
 * @example
 * try {
 *   await logoutUser();
 *   console.log('User logged out successfully');
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Sends a password reset email to the user
 * @async
 * @function resetPassword
 * @param {string} email - Email address to send reset link to
 * @returns {Promise<void>}
 * @throws {Error} If password reset fails
 * 
 * @example
 * try {
 *   await resetPassword('john@example.com');
 *   console.log('Password reset email sent');
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Maps Firebase error codes to user-friendly messages
 * @function getErrorMessage
 * @param {Object} error - Firebase error object
 * @param {string} error.code - Firebase error code
 * @returns {string} User-friendly error message
 * @private
 */
const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    default:
      return error.message;
  }
};
