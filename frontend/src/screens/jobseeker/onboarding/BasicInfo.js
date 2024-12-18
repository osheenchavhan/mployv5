/**
 * @fileoverview JobSeeker Basic Information Onboarding Screen
 * 
 * This screen is part of the job seeker onboarding flow, collecting essential
 * personal information from the user. It's typically the first screen in the
 * onboarding process, setting up the foundation for the user's profile.
 * 
 * Key Features:
 * - Personal information collection (name, DOB, gender, phone)
 * - Real-time form validation
 * - Progress tracking
 * - Smooth navigation between onboarding steps
 * 
 * Form Fields:
 * - First Name (required)
 * - Last Name (required)
 * - Date of Birth (required, must be in the past)
 * - Gender (required, options: male/female/other)
 * - Phone Number (required, 10 digits)
 * 
 * User Experience:
 * The screen features a clean, step-by-step form with clear labels and error messages.
 * A progress bar at the top helps users track their position in the onboarding flow.
 * Validation occurs in real-time, providing immediate feedback to users.
 * 
 * @example
 * // To navigate to the BasicInfo screen
 * navigation.navigate('BasicInfo');
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Container from '../../../components/common/Container';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import DatePicker from '../../../components/common/DatePicker';
import RadioGroup from '../../../components/common/RadioGroup';
import { theme } from '../../../theme/theme';
import { useOnboarding } from '../../../context/OnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';

/**
 * Gender options for the radio group selection
 * @constant
 * @type {Array<{label: string, value: string}>}
 */
const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
];

/**
 * BasicInfo screen component for job seeker onboarding
 * 
 * Collects and validates basic personal information from the user during
 * the onboarding process.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.navigation - Navigation object for screen transitions
 * @example
 * return (
 *   <BasicInfo navigation={navigation} />
 * )
 */
const BasicInfo = ({ navigation }) => {
  const { formData, updateFormData, setCurrentStep } = useOnboarding();
  const [errors, setErrors] = useState({});

  /**
   * Validates the form data before submission
   * Validation rules for First Name:
   * - Required field
   * - Must be 2-50 characters long
   * - Can only contain letters and spaces
   * 
   * Validation rules for Last Name:
   * - Required field
   * - Must be 2-50 characters long
   * - Can only contain letters and spaces
   * 
   * Validation rules for Date of Birth:
   * - Required field
   * - User must be at least 18 years old
   * - User must not be older than 100 years
   * - Cannot be a future date
   * 
   * Validation rules for Gender:
   * - Required field
   * - Must be one of: male, female, or other
   * 
   * Validation rules for Phone Number:
   * - Required field
   * - Must be 10 digits
   * 
   * @function
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    
    // First Name validation
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = 'First name cannot exceed 50 characters';
    } else if (!/^[a-zA-Z ]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters and spaces';
    }

    // Last Name validation
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Last name cannot exceed 50 characters';
    } else if (!/^[a-zA-Z ]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters and spaces';
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year
      const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
        ? age - 1 
        : age;

      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (adjustedAge < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      } else if (adjustedAge > 100) {
        newErrors.dateOfBirth = 'Age cannot exceed 100 years';
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    } else if (!['male', 'female', 'other'].includes(formData.gender)) {
      newErrors.gender = 'Please select a valid gender option';
    }

    // Phone Number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Indian mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles the next button press
   * 
   * Validates the form and if valid:
   * 1. Updates the current onboarding step
   * 2. Navigates to the Location screen
   * 
   * @function
   */
  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep('Location');
      navigation.navigate('Location');
    }
  };

  return (
    <Container>
      <ProgressBar 
        progress={20}
        style={styles.progress}
      />
      
      <View style={styles.container}>
        <Text style={styles.title}>Basic Info</Text>
        <Text style={styles.subtitle}>Let's get to know you better</Text>
        
        <Input
          label="First Name"
          value={formData.firstName || ''}
          onChangeText={(value) => {
            updateFormData('firstName', value);
            if (errors.firstName) {
              setErrors(prev => ({ ...prev, firstName: '' }));
            }
          }}
          placeholder="Enter your first name"
          error={errors.firstName}
          touched={true}
          required
          style={styles.input}
          labelStyle={styles.label}
        />

        <Input
          label="Last Name"
          value={formData.lastName || ''}
          onChangeText={(value) => {
            updateFormData('lastName', value);
            if (errors.lastName) {
              setErrors(prev => ({ ...prev, lastName: '' }));
            }
          }}
          placeholder="Enter your last name"
          error={errors.lastName}
          touched={true}
          required
          style={styles.input}
          labelStyle={styles.label}
        />

        <DatePicker
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(value) => {
            updateFormData('dateOfBirth', value);
            if (errors.dateOfBirth) {
              setErrors(prev => ({ ...prev, dateOfBirth: '' }));
            }
          }}
          error={errors.dateOfBirth}
          touched={true}
          required
          style={styles.input}
          labelStyle={styles.label}
          maximumDate={new Date()}  // Prevent future date selection
        />

        <RadioGroup
          label="Gender"
          options={genderOptions}
          value={formData.gender}
          onChange={(value) => {
            updateFormData('gender', value);
            if (errors.gender) {
              setErrors(prev => ({ ...prev, gender: '' }));
            }
          }}
          error={errors.gender}
          direction='horizontal'
          touched={true}
          required
          style={styles.input}
          labelStyle={styles.label}
        />

        <Input
          label="Phone Number"
          value={formData.phoneNumber || ''}
          onChangeText={(value) => {
            updateFormData('phoneNumber', value);
            if (errors.phoneNumber) {
              setErrors(prev => ({ ...prev, phoneNumber: '' }));
            }
          }}
          placeholder="Enter your phone number"
          error={errors.phoneNumber}
          touched={true}
          required
          variant="phone"
          style={styles.input}
          labelStyle={styles.label}
        />

        <Button 
          title="Next"
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </Container>
  );
};

/**
 * Styles for the BasicInfo component
 * 
 * @constant
 * @type {Object}
 */
const styles = StyleSheet.create({
  progress: {
    marginTop: Platform.OS === 'ios' ? 50 : 20,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.xl,
  },
  input: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
  },
  button: {
    marginTop: 'auto',
  },
});

export default BasicInfo;
