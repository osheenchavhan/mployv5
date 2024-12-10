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
   * Validates the form data
   * 
   * Checks all required fields and format requirements:
   * - First and last name must be provided
   * - Date of birth must be selected
   * - Gender must be selected
   * - Phone number must be 10 digits
   * 
   * @function
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
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
        progress={0.2}
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
          style={styles.input}
          labelStyle={styles.label}
          maximumDate={new Date()}
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
          direction="horizontal"
          style={styles.input}
        />

        <Input
          label="Phone Number"
          value={formData.phone || ''}
          onChangeText={(value) => {
            updateFormData('phone', value);
            if (errors.phone) {
              setErrors(prev => ({ ...prev, phone: '' }));
            }
          }}
          placeholder="Enter your phone number"
          error={errors.phone}
          keyboardType="phone-pad"
          maxLength={10}
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
