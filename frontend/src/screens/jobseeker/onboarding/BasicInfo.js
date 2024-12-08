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

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
];

const BasicInfo = ({ navigation }) => {
  const { formData, updateFormData, setCurrentStep } = useOnboarding();
  const [errors, setErrors] = useState({});

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
