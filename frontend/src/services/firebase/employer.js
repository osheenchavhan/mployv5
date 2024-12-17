/**
 * @fileoverview Firebase service for employer-related operations
 */

import { doc, updateDoc } from 'firebase/firestore';
import { db } from './config';

/**
 * Save employer data to Firestore
 * @param {string} userId - Firebase user ID
 * @param {Object} data - Employer data to save
 * @param {Object} data.employerType - Type of employer (direct/agency)
 * @param {Object} data.companyInfo - Company information
 * @param {Object} [data.locationPreferences] - Location preferences (for direct employers)
 * @returns {Promise<void>}
 */
export const saveEmployerData = async (userId, data) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const userRef = doc(db, 'users', userId);
  
  const employerData = {
    ...data,
    onboardingComplete: true,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(userRef, employerData);
};
