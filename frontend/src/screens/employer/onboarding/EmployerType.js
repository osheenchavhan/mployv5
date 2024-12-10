/**
 * Why this screen exists:
 * Different types of employers have different needs. This screen helps:
 * 1. Identify employer categories:
 *    - Direct employers (companies hiring for themselves)
 *    - Recruitment agencies (hiring for clients)
 *    - Startups vs established companies
 * 
 * 2. Customize the experience based on type:
 *    - Show relevant features and tools
 *    - Adjust verification requirements
 *    - Provide appropriate pricing plans
 *    - Tailor the job posting process
 * 
 * Think of it as a sorting system that:
 * - Makes sure employers get the right tools for their needs
 * - Helps job seekers understand who they're dealing with
 * - Keeps the hiring process transparent
 * 
 * Without this screen:
 * - We couldn't customize the experience for different employer types
 * - Job seekers wouldn't know if they're talking to a company or agency
 * - The platform would be less efficient for specific employer needs
 * 
 * @fileoverview Determines the type of employer during onboarding to customize their experience
 * @package mployv5/screens/employer/onboarding
 * @lastModified 2024-12-10
 */

import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Animated } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import { theme } from '../../../theme/theme';
import { useEmployerOnboarding } from '../../../context/EmployerOnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * @function EmployerType
 * @description Component for selecting the type of employer during onboarding
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object for screen navigation
 * @returns {JSX.Element} Employer type selection UI
 */
const EmployerType = ({ navigation }) => {
  const { formData, updateFormData, getProgress, setCurrentStep } = useEmployerOnboarding();

  /**
   * @function handleTypeSelection
   * @description Updates the employer type in form data when user selects an option
   * @param {string} value - Selected employer type ('direct' or 'agency')
   * @returns {void}
   */
  const handleTypeSelection = (value) => {
    updateFormData('employerType', 'type', value);
  };

  /**
   * @function handleNext
   * @description Validates selection and navigates to company info screen
   * @returns {void}
   */
  const handleNext = () => {
    if (formData.employerType.type) {
      setCurrentStep('CompanyInfo');
      navigation.navigate('CompanyInfo');
    }
  };

  /**
   * @function isSelected
   * @description Checks if the given employer type is currently selected
   * @param {string} type - Employer type to check ('direct' or 'agency')
   * @returns {boolean} True if the type is selected
   */
  const isSelected = (type) => formData.employerType.type === type;

  return (
    <Container>
      <ProgressBar progress={getProgress()} style={styles.progress} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Mploy!</Text>
        <Text style={styles.subtitle}>Let's start by understanding your role</Text>
        
        <View style={styles.boxesContainer}>
          <TouchableOpacity
            style={[styles.box, isSelected('direct') && styles.selectedBox]}
            onPress={() => handleTypeSelection('direct')}
            activeOpacity={0.9}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="business" size={40} color={theme.colors.primary.main} />
            </View>
            <Text style={[styles.boxTitle, isSelected('direct') && styles.selectedText]}>
              I'm hiring for my company
            </Text>
            <Text style={[styles.boxDescription, isSelected('direct') && styles.selectedDescription]}>
              You're looking to hire employees directly for your organization
            </Text>
            {isSelected('direct') && (
              <View style={styles.selectedIndicator}>
                <MaterialIcons name="check-circle" size={24} color={theme.colors.primary.main} />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.box, isSelected('agency') && styles.selectedBox]}
            onPress={() => handleTypeSelection('agency')}
            activeOpacity={0.9}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="people-alt" size={40} color={theme.colors.primary.main} />
            </View>
            <Text style={[styles.boxTitle, isSelected('agency') && styles.selectedText]}>
              I'm hiring for other companies
            </Text>
            <Text style={[styles.boxDescription, isSelected('agency') && styles.selectedDescription]}>
              You're a recruitment agency or hiring on behalf of other organizations
            </Text>
            {isSelected('agency') && (
              <View style={styles.selectedIndicator}>
                <MaterialIcons name="check-circle" size={24} color={theme.colors.primary.main} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Button
          title="Continue"
          onPress={handleNext}
          disabled={!formData.employerType.type}
          style={styles.button}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  progress: {
    marginTop: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.md,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral.darkGrey,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  boxesContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    minHeight: 180,
    ...Platform.select({
      ios: theme.shadows.md,
      android: {
        elevation: theme.shadows.md.elevation,
      },
    }),
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBox: {
    borderColor: theme.colors.primary.main,
    backgroundColor: `${theme.colors.primary.main}10`,
    ...Platform.select({
      ios: theme.shadows.lg,
      android: {
        elevation: theme.shadows.lg.elevation,
      },
    }),
  },
  iconContainer: {
    marginBottom: theme.spacing.sm,
  },
  boxTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.neutral.dark,
  },
  selectedText: {
    color: theme.colors.primary.main,
  },
  boxDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
    lineHeight: theme.typography.lineHeight.md,
  },
  selectedDescription: {
    color: theme.colors.primary.dark,
  },
  selectedIndicator: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  button: {
    marginTop: theme.spacing.xl,
  },
});

export default EmployerType;
