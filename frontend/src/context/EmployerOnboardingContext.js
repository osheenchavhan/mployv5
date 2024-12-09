import React, { createContext, useContext, useState } from 'react';

const EmployerOnboardingContext = createContext();

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

export const useEmployerOnboarding = () => {
  const context = useContext(EmployerOnboardingContext);
  if (context === undefined) {
    throw new Error('useEmployerOnboarding must be used within an EmployerOnboardingProvider');
  }
  return context;
};

export default EmployerOnboardingProvider;
