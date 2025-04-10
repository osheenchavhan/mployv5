/**
 * Why this screen exists:
 * Location matters in job searching. This screen helps employers:
 * 1. Set up their workplace locations:
 *    - Main office address
 *    - Branch locations
 *    - Remote work options
 *    - Hybrid work possibilities
 * 
 * 2. Define their hiring reach:
 *    - Local hiring radius
 *    - Cities they operate in
 *    - Countries they can hire from
 *    - Remote work boundaries
 * 
 * Think of it as a map that:
 * - Shows job seekers where they might work
 * - Helps match jobs with local talent
 * - Makes commute planning easier
 * - Clarifies work arrangement options
 * 
 * Without this screen:
 * - Job seekers wouldn't know where jobs are located
 * - Remote work options would be unclear
 * - Location-based job matching wouldn't work
 * - Commute considerations would be missing
 * 
 * @fileoverview Manages company location information and work arrangement options
 * @package mployv5/screens/employer/onboarding
 * @lastModified 2024-12-10
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import { theme } from '../../../theme/theme';
import { useEmployerOnboarding } from '../../../context/EmployerOnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';

/**
 * @constant {Array<Object>} remoteOptions
 * @description Predefined options for remote work policy selection
 * @property {string} id - Unique identifier for the policy option
 * @property {string} icon - MaterialIcons name for the policy option
 * @property {string} title - Display title for the policy option
 * @property {string} description - Detailed description of the policy
 */
const remoteOptions = [
  {
    id: 'onsite',
    icon: 'business',
    title: 'On-site Only',
    description: 'Employees work exclusively from the office'
  },
  {
    id: 'hybrid',
    icon: 'home-work',
    title: 'Hybrid',
    description: 'Mix of remote and office work'
  },
  {
    id: 'remote',
    icon: 'laptop',
    title: 'Fully Remote',
    description: 'Work from anywhere'
  }
];

/**
 * @function Location
 * @description Component for managing company location and work arrangement preferences
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object for screen navigation
 * @returns {JSX.Element} Location and work policy selection UI
 */
const Location = ({ navigation }) => {
  const { formData, updateFormData, getProgress } = useEmployerOnboarding();
  const [selectedPolicy, setSelectedPolicy] = useState(formData.locationPreferences?.remoteWorkPolicy || null);
  const [address, setAddress] = useState(formData.locationPreferences?.primaryLocation?.address || '');

  /**
   * @function handlePolicySelect
   * @description Updates the selected remote work policy in form data
   * @param {string} policy - Selected policy ID ('onsite', 'hybrid', or 'remote')
   * @returns {void}
   */
  const handlePolicySelect = (policy) => {
    setSelectedPolicy(policy);
    updateFormData('locationPreferences', 'remoteWorkPolicy', policy);
  };

  /**
   * @function handleAddressChange
   * @description Updates the company address in form data
   * @param {string} text - New address text
   * @returns {void}
   */
  const handleAddressChange = (text) => {
    setAddress(text);
    updateFormData('locationPreferences', 'primaryLocation', {
      address: text,
      coordinates: null 
    });
  };

  /**
   * @function handleNext
   * @description Validates selections and navigates to verification screen
   * @returns {void}
   */
  const handleNext = () => {
    if (selectedPolicy) {
      navigation.navigate('Verification');
    }
  };

  return (
    <Container>
      <ProgressBar progress={getProgress()} style={styles.progress} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Company Location</Text>
        <Text style={styles.subtitle}>Where is your company located?</Text>
        
        {/* Simple Location Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputIcon}>
            <MaterialIcons name="location-on" size={24} color={theme.colors.primary.main} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter your company address"
            value={address}
            onChangeText={handleAddressChange}
            placeholderTextColor={theme.colors.neutral.grey}
          />
        </View>

        {/* Remote Work Policy */}
        <Text style={styles.sectionTitle}>Work Policy</Text>
        <Text style={styles.sectionSubtitle}>Select your company's work arrangement</Text>
        
        <View style={styles.optionsContainer}>
          {remoteOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.policyCard,
                selectedPolicy === option.id && styles.selectedCard
              ]}
              onPress={() => handlePolicySelect(option.id)}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons 
                  name={option.icon} 
                  size={24} 
                  color={selectedPolicy === option.id ? theme.colors.primary.main : theme.colors.neutral.grey} 
                />
              </View>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
              {selectedPolicy === option.id && (
                <View style={styles.selectedIndicator}>
                  <MaterialIcons name="check-circle" size={24} color={theme.colors.primary.main} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Back"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.button}
          />
          <Button 
            title="Next"
            onPress={handleNext}
            style={styles.button}
            disabled={!selectedPolicy}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  progress: {
    marginTop: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.md,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.regular,
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
  inputContainer: {
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: theme.spacing.lg,
    paddingLeft: theme.spacing['2xl'],
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkGrey,
    ...Platform.select({
      ios: theme.shadows.md,
      android: {
        elevation: theme.shadows.md.elevation,
      },
    }),
  },
  inputIcon: {
    position: 'absolute',
    left: theme.spacing.md,
    top: 13,
    zIndex: 2,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.darkGrey,
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.lg,
  },
  optionsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  policyCard: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: theme.shadows.md,
      android: {
        elevation: theme.shadows.md.elevation,
      },
    }),
  },
  selectedCard: {
    borderColor: theme.colors.primary.main,
    backgroundColor: `${theme.colors.primary.main}10`,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.darkGrey,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
  },
  selectedIndicator: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  button: {
    flex: 1,
  },
});

export default Location;
