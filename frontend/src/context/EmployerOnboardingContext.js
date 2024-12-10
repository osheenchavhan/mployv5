/**
 * Why this file exists:
 * When employers join the platform, we need to collect different information based on
 * whether they're a direct company or a recruiting agency. This file:
 * 1. Shows different questions based on employer type
 * 2. Validates their business email and website
 * 3. Saves their company information and preferences
 * 
 * For example:
 * - Direct employers need to provide company location and work policy
 * - Agencies need to specify their specializations and years in business
 * 
 * Think of it as a smart form that adapts its questions based on who's filling it out,
 * making sure we get the right information from each type of employer.
 * 
 * @fileoverview Handles the employer signup process with type-specific information collection
 * @package mployv5/context
 * @lastModified 2024-12-10
 */

import React, { createContext, useContext, useState } from 'react';

/**
 * @context EmployerOnboardingContext
 * @description Context for managing the employer onboarding process state
 */
const EmployerOnboardingContext = createContext();

/**
 * @component EmployerOnboardingProvider
 * @description Provider component that manages employer onboarding state and validation
 * Features:
 * - Multi-step form data management
 * - Separate flows for direct employers and agencies
 * - Email domain verification
 * - Progress tracking
 * 
 * Form Sections:
 * 1. Employer Type:
 *    - Direct employer or agency selection
 *    - Email verification status
 * 
 * 2. Company Info:
 *    Shared Fields:
 *    - Company name, logo, size
 *    - Description and website
 *    
 *    Direct Employer Fields:
 *    - Primary industry
 *    - Email domain
 *    
 *    Agency Fields:
 *    - Specializations
 *    - Years in business
 * 
 * 3. Location (Direct Employers Only):
 *    - Primary location with coordinates
 *    - Remote work policy
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * 
 * @example
 * // Wrap your employer onboarding flow
 * <EmployerOnboardingProvider>
 *   <EmployerOnboardingFlow />
 * </EmployerOnboardingProvider>
 * 
 * // Use in a child component
 * const { 
 *   formData,
 *   updateFormData,
 *   isBusinessEmail 
 * } = useEmployerOnboarding();
 */
export const EmployerOnboardingProvider = ({ children }) => {
  const initialState = {
    employerType: {
      type: null, // 'direct' | 'agency'
      isEmailVerified: false
    },
    companyInfo: {
      // Shared fields
      name: '',
      logo: null,
      size: '',
      description: '',
      website: '',
      
      // Direct Employer specific
      primaryIndustry: '',
      emailDomain: '',
      
      // Agency specific
      specializations: [],
      yearsInBusiness: null
    },
    locationPreferences: {  // Only for Direct Employers
      primaryLocation: {
        address: '',
        coordinates: null // {lat: number, lng: number}
      },
      remoteWorkPolicy: null // 'remote' | 'hybrid' | 'onsite'
    }
  };

  const [formData, setFormData] = useState(initialState);
  const [currentStep, setCurrentStep] = useState('EmployerType');
  
  // Steps for each employer type
  const directEmployerSteps = ['EmployerType', 'CompanyInfo', 'Location', 'Verification', 'Dashboard'];
  const agencySteps = ['EmployerType', 'CompanyInfo', 'Verification', 'Dashboard'];

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const getProgress = () => {
    const steps = formData.employerType.type === 'direct' ? directEmployerSteps : agencySteps;
    const currentIndex = steps.indexOf(currentStep);
    return (currentIndex + 1) / steps.length;
  };

  // Check if email is from business domain
  const isBusinessEmail = (email) => {
    const commonEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    return !commonEmailProviders.includes(domain);
  };

  // Verify email domain matches website
  const verifyEmailDomain = () => {
    if (!formData.companyInfo.website || !formData.companyInfo.emailDomain) return false;
    const websiteDomain = formData.companyInfo.website.replace(/^https?:\/\//, '').split('/')[0];
    return formData.companyInfo.emailDomain.includes(websiteDomain);
  };

  const value = {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    getProgress,
    isBusinessEmail,
    verifyEmailDomain,
    steps: formData.employerType.type === 'direct' ? directEmployerSteps : agencySteps
  };

  return (
    <EmployerOnboardingContext.Provider value={value}>
      {children}
    </EmployerOnboardingContext.Provider>
  );
};

/**
 * @hook useEmployerOnboarding
 * @description Custom hook to access employer onboarding context
 * @returns {Object} Context object containing:
 *   - formData: Current form state
 *   - updateFormData: Function to update form fields
 *   - currentStep: Current active step
 *   - setCurrentStep: Function to navigate between steps
 *   - getProgress: Function to calculate completion progress
 *   - isBusinessEmail: Function to validate business email domains
 *   - verifyEmailDomain: Function to verify email domain matches website
 *   - steps: Array of steps based on employer type
 * 
 * @throws {Error} If used outside of EmployerOnboardingProvider
 * 
 * @example
 * const {
 *   formData,
 *   updateFormData,
 *   verifyEmailDomain
 * } = useEmployerOnboarding();
 * 
 * // Update company info
 * updateFormData('companyInfo', 'name', 'Acme Inc');
 * 
 * // Verify email domain
 * const isValid = verifyEmailDomain();
 */
export const useEmployerOnboarding = () => {
  const context = useContext(EmployerOnboardingContext);
  if (context === undefined) {
    throw new Error('useEmployerOnboarding must be used within an EmployerOnboardingProvider');
  }
  return context;
};

export default EmployerOnboardingProvider;
