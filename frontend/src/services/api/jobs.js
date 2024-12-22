/**
 * Jobs API Service
 * 
 * This service handles all job-related API calls to our backend server.
 * It provides a clean interface for job operations while maintaining
 * Firebase as a fallback option.
 */

import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import { getEmployerJobs as getFirebaseEmployerJobs } from '../firebase/jobs';
import { auth } from '../firebase/config';

/**
 * Jobs API service object containing all job-related API operations
 */
export const jobsApi = {
  /**
   * Get all jobs for the current employer
   * @async
   * @function getEmployerJobs
   * @param {string} employerId - ID of the employer
   * @param {string} [status] - Optional status filter
   * @returns {Promise<Array>} Array of job objects
   * @throws {Error} If fetching fails from both API and Firebase
   */
  getEmployerJobs: async (employerId, status) => {
    console.log('[JobsAPI] Starting getEmployerJobs:', employerId);
    try {
      // Get the current user's ID token
      const idToken = await auth.currentUser.getIdToken();
      console.log('[JobsAPI] Got Firebase token:', { tokenLength: idToken.length });
      
      // Using proper API endpoint with employerId and auth token
      const response = await axios.get(`${API_BASE_URL}/api/jobs/employer/${employerId}`, {
        params: { status },
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      console.log('[JobsAPI] Success response:', { status: response.status, jobsCount: response.data?.data?.length });
      return response.data.data; // API returns { status: 'success', data: [...jobs] }
    } catch (error) {
      console.error('[JobsAPI] Request failed:', { 
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      console.warn('API fallback to Firebase:', error.message);
      return getFirebaseEmployerJobs(employerId, status);
    }
  }
};
