import React, { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
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
