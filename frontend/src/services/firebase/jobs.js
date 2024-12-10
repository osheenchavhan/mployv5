/**
 * @fileoverview Firebase Jobs Service
 * 
 * This service handles all job-related operations with Firebase Firestore.
 * It provides functionality for creating, updating, and querying job postings,
 * with support for filtering and ordering results.
 * 
 * Key Features:
 * - Job posting creation and updates
 * - Individual job retrieval
 * - Employer-specific job listings
 * - Status-based filtering
 * - Chronological ordering
 * 
 * @package services/firebase
 * @lastModified 2024-12-10
 */

import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './config';

/** @constant {string} JOBS_COLLECTION - Name of the Firestore collection for jobs */
const JOBS_COLLECTION = 'jobs';

/**
 * Creates a new job posting in Firestore
 * @async
 * @function addJob
 * @param {Object} jobData - Job posting data
 * @param {string} jobData.title - Job title
 * @param {string} jobData.description - Job description
 * @param {string} jobData.employerId - ID of the employer posting the job
 * @param {string} jobData.location - Job location
 * @param {string} jobData.type - Employment type (full-time, part-time, etc.)
 * @param {Object} jobData.salary - Salary information
 * @param {string} jobData.status - Job posting status
 * @returns {Promise<string>} ID of the created job document
 * @throws {Error} If job creation fails
 * 
 * @example
 * try {
 *   const jobData = {
 *     title: 'Software Engineer',
 *     description: 'Developing web applications...',
 *     employerId: 'emp123',
 *     location: 'Remote',
 *     type: 'full-time',
 *     salary: { min: 80000, max: 120000 },
 *     status: 'active'
 *   };
 *   const jobId = await addJob(jobData);
 *   console.log('Job created:', jobId);
 * } catch (error) {
 *   console.error(error);
 * }
 */
export const addJob = async (jobData) => {
  try {
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), jobData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding job:', error);
    throw error;
  }
};

/**
 * Updates an existing job posting
 * @async
 * @function updateJob
 * @param {string} jobId - ID of the job to update
 * @param {Object} jobData - Updated job data
 * @returns {Promise<string>} ID of the updated job
 * @throws {Error} If job update fails
 * 
 * @example
 * try {
 *   const updates = { status: 'closed' };
 *   await updateJob('job123', updates);
 *   console.log('Job updated successfully');
 * } catch (error) {
 *   console.error(error);
 * }
 */
export const updateJob = async (jobId, jobData) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(jobRef, jobData);
    return jobId;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

/**
 * Retrieves a specific job posting by ID
 * @async
 * @function getJob
 * @param {string} jobId - ID of the job to retrieve
 * @returns {Promise<Object>} Job data including ID
 * @throws {Error} If job is not found or retrieval fails
 * 
 * @example
 * try {
 *   const job = await getJob('job123');
 *   console.log('Job details:', job);
 * } catch (error) {
 *   console.error(error);
 * }
 */
export const getJob = async (jobId) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    const jobSnap = await getDoc(jobRef);
    if (jobSnap.exists()) {
      return { id: jobSnap.id, ...jobSnap.data() };
    }
    throw new Error('Job not found');
  } catch (error) {
    console.error('Error getting job:', error);
    throw error;
  }
};

/**
 * Retrieves all jobs posted by a specific employer
 * @async
 * @function getEmployerJobs
 * @param {string} employerId - ID of the employer
 * @param {string} [status=null] - Optional status filter
 * @returns {Promise<Array<Object>>} Array of job objects
 * @throws {Error} If retrieval fails
 * 
 * @example
 * // Get all active jobs for an employer
 * try {
 *   const activeJobs = await getEmployerJobs('emp123', 'active');
 *   console.log('Active jobs:', activeJobs);
 * } catch (error) {
 *   console.error(error);
 * }
 * 
 * // Get all jobs regardless of status
 * try {
 *   const allJobs = await getEmployerJobs('emp123');
 *   console.log('All jobs:', allJobs);
 * } catch (error) {
 *   console.error(error);
 * }
 */
export const getEmployerJobs = async (employerId, status = null) => {
  try {
    let jobsQuery = query(
      collection(db, JOBS_COLLECTION),
      where('employerId', '==', employerId),
      orderBy('createdAt', 'desc')
    );

    if (status) {
      jobsQuery = query(
        collection(db, JOBS_COLLECTION),
        where('employerId', '==', employerId),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(jobsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting employer jobs:', error);
    throw error;
  }
};
