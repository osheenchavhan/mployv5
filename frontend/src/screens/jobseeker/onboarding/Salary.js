/**
 * @component Salary
 * @description A form component for collecting job seeker's salary expectations.
 * This is the final screen in the onboarding flow where users can specify their
 * salary preferences, including format (monthly/yearly), range, and minimum threshold.
 * 
 * Key Features:
 * - Toggle between monthly and yearly salary formats
 * - Set expected salary range with min/max values
 * - Interactive slider for minimum salary threshold
 * - Input validation for salary range
 * - Navigation to job swiping screen upon completion
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Chip from '../../../components/common/Chip';
import Slider from '@react-native-community/slider';
import { theme } from '../../../theme/theme';
import { useOnboarding } from '../../../context/OnboardingContext';

/** @constant {string[]} SALARY_FORMATS - Available salary format options */
const SALARY_FORMATS = ['Monthly', 'Yearly'];

/**
 * Salary Screen Component
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation prop for screen navigation
 * @returns {JSX.Element} Salary configuration screen
 */
const Salary = ({ navigation }) => {
  const { formData, updateFormData, getProgress, saveToFirestore } = useOnboarding();
  // State Management
  /** @state {string} salaryFormat - Selected salary format (Monthly/Yearly) */
  const [salaryFormat, setSalaryFormat] = useState('Monthly');
  /** @state {string} minSalary - Minimum expected salary */
  const [minSalary, setMinSalary] = useState('');
  /** @state {string} maxSalary - Maximum expected salary */
  const [maxSalary, setMaxSalary] = useState('');
  /** @state {number} minThreshold - Minimum salary threshold for job visibility */
  const [minThreshold, setMinThreshold] = useState(0);
  /** @state {Object} errors - Form validation errors */
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * Validates form and completes onboarding
   * @function handleFinish
   * @description
   * 1. Validates required fields and salary range logic
   * 2. If valid, resets navigation stack and moves to SwipeJobs screen
   * 3. If invalid, displays appropriate error messages
   */
  const handleFinish = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Update salary data in formData before saving
      updateFormData('salary', {
        format: salaryFormat,
        range: {
          min: Number(minSalary),
          max: Number(maxSalary)
        },
        threshold: minThreshold
      });
      
      await saveToFirestore();
      // Navigate to SwipeJobs screen within JobSeekerStack
      navigation.reset({
        index: 0,
        routes: [{ 
          name: 'JobSeekerStack',
          state: {
            routes: [{ name: 'SwipeJobs' }]
          }
        }],
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!minSalary) newErrors.minSalary = 'Minimum salary is required';
    if (!maxSalary) newErrors.maxSalary = 'Maximum salary is required';
    if (Number(minSalary) > Number(maxSalary)) {
      newErrors.maxSalary = 'Maximum salary should be greater than minimum salary';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.title}>Salary Expectations</Text>
        <Text style={styles.subtitle}>What are your salary expectations?</Text>
        
        <Text style={styles.label}>Salary Format</Text>
        <View style={styles.formatContainer}>
          {SALARY_FORMATS.map((format) => (
            <Chip
              key={format}
              label={format}
              variant="choice"
              selected={salaryFormat === format}
              onPress={() => setSalaryFormat(format)}
            />
          ))}
        </View>

        <Text style={styles.label}>Expected Salary Range</Text>
        <View style={styles.rangeContainer}>
          <View style={styles.salaryInput}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Input
              placeholder={salaryFormat === 'Monthly' ? "30,000" : "3,60,000"}
              value={minSalary}
              onChangeText={setMinSalary}
              keyboardType="numeric"
              error={errors.minSalary}
              style={{ flex: 1 }}
            />
          </View>
          <Text style={styles.toText}>to</Text>
          <View style={styles.salaryInput}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Input
              placeholder={salaryFormat === 'Monthly' ? "50,000" : "6,00,000"}
              value={maxSalary}
              onChangeText={setMaxSalary}
              keyboardType="numeric"
              error={errors.maxSalary}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <Text style={styles.label}>Minimum Salary Threshold</Text>
        <Text style={styles.thresholdNote}>Don't show jobs below this amount</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={Number(maxSalary) || 100000}
          value={minThreshold}
          onValueChange={setMinThreshold}
          minimumTrackTintColor={theme.colors.primary.main}
          maximumTrackTintColor={theme.colors.neutral.lightGrey}
          thumbTintColor={theme.colors.primary.main}
        />
        <Text style={styles.thresholdValue}>
          ₹{minThreshold.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </Text>

        <View style={styles.buttonContainer}>
          <Button 
            title="Back"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.button}
            disabled={loading}
          />
          <Button 
            title="Finish"
            onPress={handleFinish}
            style={styles.button}
            loading={loading}
          />
        </View>
        {errors.submit && (
          <Text style={styles.errorText}>{errors.submit}</Text>
        )}
      </View>
    </Container>
  );
};

/**
 * Component Styles
 * @constant styles
 * @description Defines the styling for all components in the Salary screen
 * Key sections:
 * - Container and spacing layout
 * - Typography for titles, labels, and values
 * - Input field customization
 * - Slider styling
 * - Button container layout
 * - Responsive spacing using theme variables
 */
const styles = StyleSheet.create({
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
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
    color: theme.colors.neutral.black,
  },
  formatContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  salaryInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: theme.typography.fontSize.lg,
    marginRight: theme.spacing.xs,
    color: theme.colors.neutral.darkGrey,
  },
  toText: {
    marginHorizontal: theme.spacing.sm,
    color: theme.colors.neutral.darkGrey,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: theme.spacing.sm,
  },
  thresholdNote: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.darkGrey,
    marginBottom: theme.spacing.sm,
  },
  thresholdValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary.main,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
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
  errorText: {
    color: theme.colors.accent.error,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.md,
    textAlign: 'center'
  },
});

export default Salary;
