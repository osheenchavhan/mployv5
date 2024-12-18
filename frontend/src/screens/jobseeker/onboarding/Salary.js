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
 * 
 * Database Storage:
 * - All salary values are stored in yearly format for consistency
 * - Monthly values are converted to yearly (x12) before saving
 * - Display values are converted based on user's selected format
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Chip from '../../../components/common/Chip';
import Slider from '@react-native-community/slider';
import { theme } from '../../../theme/theme';
import { useOnboarding } from '../../../context/OnboardingContext';

/** @constant {string[]} SALARY_FORMATS - Available salary format options */
const SALARY_FORMATS = ['Monthly', 'Yearly'];

/** @constant {Object} THRESHOLD_STEPS - Predefined steps for salary threshold */
const THRESHOLD_STEPS = {
  Monthly: [
    { value: 10000, label: '₹10k' },
    { value: 15000, label: '₹15k' },
    { value: 20000, label: '₹20k' },
    { value: 25000, label: '₹25k' },
    { value: 30000, label: '₹30k' },
    { value: 40000, label: '₹40k' },
    { value: 50000, label: '₹50k' },
    { value: 75000, label: '₹75k' },
    { value: 100000, label: '₹1L' }
  ],
  Yearly: [
    { value: 120000, label: '₹1.2L' },
    { value: 180000, label: '₹1.8L' },
    { value: 240000, label: '₹2.4L' },
    { value: 300000, label: '₹3L' },
    { value: 360000, label: '₹3.6L' },
    { value: 480000, label: '₹4.8L' },
    { value: 600000, label: '₹6L' },
    { value: 900000, label: '₹9L' },
    { value: 1200000, label: '₹12L' }
  ]
};

/**
 * Converts salary between monthly and yearly formats
 * @function convertSalary
 * @param {number} value - Salary value to convert
 * @param {string} fromFormat - Current format ('Monthly' or 'Yearly')
 * @param {string} toFormat - Target format ('Monthly' or 'Yearly')
 * @returns {number} Converted salary value
 */
const convertSalary = (value, fromFormat, toFormat) => {
  if (!value) return value;
  if (fromFormat === toFormat) return value;
  return fromFormat === 'Monthly' ? value * 12 : Math.round(value / 12);
};

/**
 * Salary Screen Component
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation prop for screen navigation
 * @returns {JSX.Element} Salary configuration screen
 */
const Salary = ({ navigation }) => {
  const { formData, updateFormData, saveToFirestore } = useOnboarding();
  
  // State Management
  const [salaryFormat, setSalaryFormat] = useState('Monthly');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [minThreshold, setMinThreshold] = useState(THRESHOLD_STEPS.Monthly[0].value);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentThresholdSteps, setCurrentThresholdSteps] = useState(THRESHOLD_STEPS.Monthly);

  // Update threshold steps when salary format changes
  useEffect(() => {
    const newSteps = THRESHOLD_STEPS[salaryFormat];
    setCurrentThresholdSteps(newSteps);
    // Convert threshold value to new format
    const convertedThreshold = convertSalary(
      minThreshold,
      salaryFormat === 'Monthly' ? 'Yearly' : 'Monthly',
      salaryFormat
    );
    setMinThreshold(convertedThreshold);
  }, [salaryFormat]);

  // Update minSalary if it's less than threshold
  useEffect(() => {
    if (minThreshold && minSalary && Number(minSalary) < minThreshold) {
      setMinSalary(minThreshold.toString());
    }
  }, [minThreshold]);

  const handleFormatChange = (newFormat) => {
    if (newFormat === salaryFormat) return;

    // Convert existing salary values to new format
    if (minSalary) {
      setMinSalary(convertSalary(Number(minSalary), salaryFormat, newFormat).toString());
    }
    if (maxSalary) {
      setMaxSalary(convertSalary(Number(maxSalary), salaryFormat, newFormat).toString());
    }

    setSalaryFormat(newFormat);
  };

  const handleFinish = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Convert all values to yearly format for storage
      const yearlyMinSalary = convertSalary(Number(minSalary), salaryFormat, 'Yearly');
      const yearlyMaxSalary = convertSalary(Number(maxSalary), salaryFormat, 'Yearly');
      const yearlyThreshold = convertSalary(minThreshold, salaryFormat, 'Yearly');

      const salaryData = {
        format: salaryFormat,
        range: {
          min: yearlyMinSalary,
          max: yearlyMaxSalary
        },
        threshold: yearlyThreshold
      };

      console.log('Saving salary data:', salaryData);

      // Update salary data in formData before saving
      updateFormData('salary', salaryData);
      
      // Save to Firestore and wait for completion
      await saveToFirestore();

      console.log('Successfully saved all data, navigating to SwipeJobs');

      // Add a small delay to ensure Firestore update is complete
      setTimeout(() => {
        // Reset navigation stack and navigate to SwipeJobs
        navigation.reset({
          index: 0,
          routes: [{ 
            name: 'JobSeekerStack',
            state: {
              routes: [{ name: 'SwipeJobs' }]
            }
          }],
        });
      }, 500);
    } catch (error) {
      console.error('Error in handleFinish:', error);
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const min = Number(minSalary);
    const max = Number(maxSalary);

    if (!minSalary) newErrors.minSalary = 'Minimum salary is required';
    if (!maxSalary) newErrors.maxSalary = 'Maximum salary is required';
    if (min < minThreshold) {
      newErrors.minSalary = `Minimum salary cannot be less than threshold (${minThreshold})`;
    }
    if (min > max) {
      newErrors.maxSalary = 'Maximum salary should be greater than minimum salary';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const formatSalaryDisplay = (value) => {
    if (!value) return '';
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}k`;
  };

  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.title}>Salary Expectations</Text>
        <Text style={styles.subtitle}>What are your salary expectations?</Text>
        
        <Text style={styles.label}>Salary Format</Text>
        <View style={styles.toggleContainer}>
          {SALARY_FORMATS.map((format) => (
            <TouchableOpacity
              key={format}
              style={[
                styles.toggleButton,
                salaryFormat === format && styles.toggleButtonSelected
              ]}
              onPress={() => handleFormatChange(format)}
            >
              <Text style={[
                styles.toggleButtonText,
                salaryFormat === format && styles.toggleButtonTextSelected
              ]}>
                {format}
              </Text>
            </TouchableOpacity>
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
          maximumValue={currentThresholdSteps.length - 1}
          step={1}
          value={currentThresholdSteps.findIndex(step => step.value === minThreshold)}
          onValueChange={(index) => {
            const newThreshold = currentThresholdSteps[index].value;
            setMinThreshold(newThreshold);
          }}
          minimumTrackTintColor={theme.colors.primary.main}
          maximumTrackTintColor={theme.colors.neutral.lightGrey}
          thumbTintColor={theme.colors.primary.main}
        />
        <View style={styles.thresholdLabelsContainer}>
          {currentThresholdSteps.map((step, index) => (
            <Text
              key={index}
              style={[
                styles.thresholdLabel,
                minThreshold === step.value && styles.thresholdLabelSelected
              ]}
            >
              {step.label}
            </Text>
          ))}
        </View>

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
  toggleContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  toggleButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.neutral.lightGrey,
    backgroundColor: theme.colors.neutral.white,
  },
  toggleButtonSelected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  toggleButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
  },
  toggleButtonTextSelected: {
    color: theme.colors.neutral.white,
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
  thresholdLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  thresholdLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral.darkGrey,
    transform: [{ rotate: '-45deg' }],
  },
  thresholdLabelSelected: {
    color: theme.colors.primary.main,
    fontWeight: '600',
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
