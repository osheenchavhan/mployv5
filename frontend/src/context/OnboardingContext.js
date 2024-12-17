/**
 * Why this file exists:
 * When a new job seeker signs up, we need to collect their information step by step
 * (like basic info, location, education, etc.). This file helps us:
 * 1. Keep track of what information they've filled out
 * 2. Save their progress as they move between steps
 * 3. Show them how far along they are in the process
 * 
 * Think of it like a form wizard that remembers your answers as you go through multiple pages.
 * Without this file, users would lose their progress if they accidentally closed the app
 * or needed to come back later.
 * 
 * @fileoverview Manages the step-by-step collection of new job seeker information
 * @package mployv5/context
 * @lastModified 2024-12-10
 */

import React, { createContext, useContext, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { useUser } from './UserContext';

/**
 * @context OnboardingContext
 * @description Context for managing the multi-step onboarding process state
 */
const OnboardingContext = createContext();

/**
 * @component OnboardingProvider
 * @description Provider component that manages onboarding state and navigation
 * Features:
 * - Multi-step form data management
 * - Progress tracking
 * - Step navigation
 * - Form data validation
 * 
 * Form Sections:
 * 1. Basic Info: Personal details
 * 2. Location: Geographic preferences
 * 3. Education: Academic background
 * 4. Experience: Work history
 * 5. Salary: Compensation expectations
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * 
 * @example
 * // Wrap your app or a section with the provider
 * <OnboardingProvider>
 *   <OnboardingFlow />
 * </OnboardingProvider>
 * 
 * // Use the context in a child component
 * const { formData, updateFormData, currentStep } = useOnboarding();
 */
export const OnboardingProvider = ({ children }) => {
  const { user } = useUser();
  const initialFormData = {
    // Basic Info
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    // Location
    location: null, // Will store {latitude, longitude}
    searchRadius: 10, // Default 10km radius
    // Other sections to be added later
    education: null,
    experience: null,
    salary: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [currentStep, setCurrentStep] = useState('BasicInfo');
  const steps = ['BasicInfo', 'Location', 'Education', 'Experience', 'Salary'];

  const saveToFirestore = async () => {
    if (!user?.uid) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        jobSeeker: {
          basicInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            phoneNumber: formData.phoneNumber,
          },
          location: formData.location,
          searchRadius: formData.searchRadius,
          education: formData.education,
          experience: formData.experience,
          salary: formData.salary,
        },
        onboardingComplete: true,
        profileComplete: true,
        updatedAt: new Date().toISOString(),
      });
      console.log('Successfully saved jobseeker profile to Firestore');
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getProgress = () => {
    const currentIndex = steps.indexOf(currentStep);
    return (currentIndex + 1) / steps.length;
  };

  const value = {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    getProgress,
    steps,
    saveToFirestore
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

/**
 * @hook useOnboarding
 * @description Custom hook to access onboarding context
 * @returns {Object} Onboarding context object containing:
 *   - formData: Current form state
 *   - updateFormData: Function to update form fields
 *   - currentStep: Current active step
 *   - setCurrentStep: Function to navigate between steps
 *   - getProgress: Function to calculate completion progress
 *   - steps: Array of available steps
 *   - saveToFirestore: Function to save form data to Firestore
 * 
 * @throws {Error} If used outside of OnboardingProvider
 * 
 * @example
 * const {
 *   formData,
 *   updateFormData,
 *   currentStep,
 *   getProgress
 * } = useOnboarding();
 * 
 * // Update a form field
 * updateFormData('firstName', 'John');
 * 
 * // Get current progress
 * const progress = getProgress(); // Returns value between 0 and 1
 */
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default OnboardingProvider;
