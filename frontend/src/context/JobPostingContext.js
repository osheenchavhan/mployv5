import React, { createContext, useContext, useState } from 'react';
import { addJob, updateJob } from '../services/firebase/jobs';
import { useUser } from './UserContext';

const JobPostingContext = createContext();

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

export const useJobPosting = () => {
  const context = useContext(JobPostingContext);
  if (!context) {
    throw new Error('useJobPosting must be used within a JobPostingProvider');
  }
  return context;
};
