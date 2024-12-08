import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { theme } from '../../../theme/theme';
import { useOnboarding } from '../../../context/OnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';

const Location = ({ navigation }) => {
  const { formData, updateFormData } = useOnboarding();
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {};
    if (!formData.location) {
      newErrors.location = 'Please enter your location';
    }
    if (!formData.preferredLocation) {
      newErrors.preferredLocation = 'Please enter your preferred work location';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigation.navigate('Education');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Container>
      <ProgressBar 
        progress={0.4}
        style={styles.progress}
      />
      
      <View style={styles.container}>
        <Text style={styles.title}>Location</Text>
        <Text style={styles.subtitle}>Where would you like to work?</Text>
        
        <Input
          label="Your Location"
          value={formData.location || ''}
          onChangeText={(value) => {
            updateFormData('location', value);
            if (errors.location) {
              setErrors(prev => ({ ...prev, location: '' }));
            }
          }}
          placeholder="Enter your current location"
          error={errors.location}
          style={styles.input}
          labelStyle={styles.label}
        />

        <Input
          label="Preferred Work Location"
          value={formData.preferredLocation || ''}
          onChangeText={(value) => {
            updateFormData('preferredLocation', value);
            if (errors.preferredLocation) {
              setErrors(prev => ({ ...prev, preferredLocation: '' }));
            }
          }}
          placeholder="Enter your preferred work location"
          error={errors.preferredLocation}
          style={styles.input}
          labelStyle={styles.label}
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Back"
            variant="outline"
            onPress={handleBack}
            style={styles.button}
          />
          <Button 
            title="Next"
            onPress={handleNext}
            style={styles.button}
          />
        </View>
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
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});

export default Location;
