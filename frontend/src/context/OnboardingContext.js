import React, { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    gender: '',
    phone: '',
    
    // Location
    location: '',
    preferredLocation: '',
    
    // Other sections to be added later
    education: null,
    experience: null,
    salary: null,
  });

  const [currentStep, setCurrentStep] = useState('BasicInfo');
  const steps = ['BasicInfo', 'Location', 'Education', 'Experience', 'Salary'];

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
    steps
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default OnboardingProvider;
