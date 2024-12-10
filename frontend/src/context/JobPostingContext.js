/**
 * Why this file exists:
 * When employers want to post a new job, they need to:
 * 1. Save their progress while writing the job description
 * 2. Make sure all required information is filled out
 * 3. Keep the job as a draft until it's ready to publish
 * 
 * This file helps employers by:
 * - Automatically saving their work as they type
 * - Checking that salary, location, and skills are specified
 * - Allowing them to preview before publishing
 * - Keeping track of all their job posts
 * 
 * Think of it as a document editor that helps you write a complete job posting,
 * checks that you haven't missed anything important, and lets you decide when
 * it's ready to be seen by job seekers.
 * 
 * @fileoverview Manages the creation and editing of job postings
 * @package mployv5/context
 * @lastModified 2024-12-10
 */

import React, { createContext, useContext, useState } from 'react';
import { addJob, updateJob } from '../services/firebase/jobs';
import { useUser } from './UserContext';

/**
 * @context JobPostingContext
 * @description Context for managing job posting state and operations
 */
const JobPostingContext = createContext();

/**
 * @component JobPostingProvider
 * @description Provider component that manages job posting state and validation
 * Features:
 * - Job data management and validation
 * - Draft and publish functionality
 * - Error handling
 * - Loading state management
 * 
 * Job Data Structure:
 * 1. Basic Info:
 *    - Title
 *    - Description
 *    - Employment type
 *    - Experience level
 * 
 * 2. Location:
 *    - Type (onsite/remote/hybrid)
 *    - Multiple location support
 * 
 * 3. Compensation:
 *    - Salary amount
 *    - Payment frequency
 *    - Currency
 *    - Negotiation status
 * 
 * 4. Requirements:
 *    - Required skills
 * 
 * 5. Metadata:
 *    - Status (draft/published)
 *    - Timestamps
 *    - Employer ID
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * 
 * @example
 * // Wrap job posting related components
 * <JobPostingProvider>
 *   <JobPostingForm />
 * </JobPostingProvider>
 * 
 * // Use in a child component
 * const { 
 *   currentJob,
 *   updateJobField,
 *   saveJob 
 * } = useJobPosting();
 */
export const JobPostingProvider = ({ children }) => {
  const { user } = useUser();
  const [currentJob, setCurrentJob] = useState({
    title: '',
    description: '',
    location: {
      type: 'onsite',
      locations: [],
    },
    employmentType: 'full-time',
    experienceLevel: 'entry',
    salary: {
      amount: 0,
      type: 'monthly',
      currency: 'INR',
      isNegotiable: false,
    },
    skills: [],
    status: 'draft',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateJob = (jobData) => {
    const newErrors = {};

    // Required fields validation
    if (!jobData.title?.trim()) {
      newErrors.title = 'Job title is required';
    }
    if (!jobData.description?.trim()) {
      newErrors.description = 'Job description is required';
    }
    if (!jobData.location?.locations?.length) {
      newErrors.location = 'At least one location is required';
    }
    if (!jobData.salary?.amount) {
      newErrors.salary = 'Salary amount is required';
    }
    if (!jobData.skills?.length) {
      newErrors.skills = 'At least one skill is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveJob = async (status = 'draft') => {
    try {
      setLoading(true);
      const jobData = {
        ...currentJob,
        status,
        employerId: user.uid,
        updatedAt: new Date(),
        createdAt: currentJob.createdAt || new Date(),
      };

      if (!validateJob(jobData)) {
        throw new Error('Please fill in all required fields');
      }

      const jobId = currentJob.id;
      if (jobId) {
        await updateJob(jobId, jobData);
      } else {
        await addJob(jobData);
      }

      return true;
    } catch (error) {
      console.error('Error saving job:', error);
      setErrors({ submit: error.message });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateJobField = (field, value) => {
    setCurrentJob(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for the updated field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const resetJob = () => {
    setCurrentJob({
      title: '',
      description: '',
      location: {
        type: 'onsite',
        locations: [],
      },
      employmentType: 'full-time',
      experienceLevel: 'entry',
      salary: {
        amount: 0,
        type: 'monthly',
        currency: 'INR',
        isNegotiable: false,
      },
      skills: [],
      status: 'draft',
    });
    setErrors({});
  };

  return (
    <JobPostingContext.Provider
      value={{
        currentJob,
        setCurrentJob,
        errors,
        loading,
        saveJob,
        updateJobField,
        resetJob,
      }}
    >
      {children}
    </JobPostingContext.Provider>
  );
};

/**
 * @hook useJobPosting
 * @description Custom hook to access job posting context
 * @returns {Object} Context object containing:
 *   - currentJob: Current job posting data
 *   - setCurrentJob: Function to update entire job object
 *   - errors: Validation errors object
 *   - loading: Boolean indicating save operation status
 *   - saveJob: Function to save/publish job posting
 *   - updateJobField: Function to update individual job fields
 *   - resetJob: Function to clear job posting form
 * 
 * @throws {Error} If used outside of JobPostingProvider
 * 
 * @example
 * const {
 *   currentJob,
 *   updateJobField,
 *   saveJob,
 *   errors
 * } = useJobPosting();
 * 
 * // Update job title
 * updateJobField('title', 'Senior Developer');
 * 
 * // Save as draft
 * await saveJob('draft');
 * 
 * // Publish job
 * if (await saveJob('published')) {
 *   console.log('Job published successfully');
 * }
 */
export const useJobPosting = () => {
  const context = useContext(JobPostingContext);
  if (!context) {
    throw new Error('useJobPosting must be used within a JobPostingProvider');
  }
  return context;
};
