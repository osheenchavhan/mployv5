/**
 * Why this screen exists:
 * Job seekers need to know who they might work for. This screen helps employers:
 * 1. Share their company story:
 *    - Company name and website
 *    - Industry and company size
 *    - Mission and values
 *    - Company description that attracts talent
 * 
 * 2. Build their employer brand:
 *    - Upload company logo
 *    - Add photos of workplace
 *    - Highlight company culture
 *    - Show what makes them unique
 * 
 * Think of it as your company's digital business card that:
 * - Makes a great first impression on candidates
 * - Shows why someone would want to work there
 * - Helps job seekers recognize your brand
 * 
 * Without this screen:
 * - Job seekers wouldn't know anything about potential employers
 * - Companies couldn't showcase their unique culture
 * - Job posts would lack important context about the workplace
 * 
 * @fileoverview Collects and displays company profile information during employer onboarding
 * @package mployv5/screens/employer/onboarding
 * @lastModified 2024-12-10
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TextInput } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import DropDownPicker from 'react-native-dropdown-picker';
import { theme } from '../../../theme/theme';
import { useEmployerOnboarding } from '../../../context/EmployerOnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';
import * as ImagePicker from 'expo-image-picker';
import { industries } from '../../../data/experience/industries.json';

/**
 * @constant {Array<Object>} companySizes
 * @description Predefined options for company size selection
 * @property {string} label - Display text for the size option
 * @property {string} value - Value stored for the size option
 */
const companySizes = [
  { label: '1-10 employees', value: '1-10' },
  { label: '11-50 employees', value: '11-50' },
  { label: '51-200 employees', value: '51-200' },
  { label: '201-500 employees', value: '201-500' },
  { label: '500+ employees', value: '500+' }
];

/**
 * @constant {Array<Object>} industrySpecializations
 * @description Predefined options for industry and specialization selection
 * @property {string} label - Display text for the industry option
 * @property {string} value - Value stored for the industry option
 */
const industrySpecializations = [
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Education', value: 'education' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Retail', value: 'retail' },
  { label: 'Hospitality', value: 'hospitality' },
  { label: 'Construction', value: 'construction' },
  { label: 'Professional Services', value: 'professional_services' },
  { label: 'Other', value: 'other' }
];

/**
 * @function CompanyInfo
 * @description Component for collecting and managing company/agency information during onboarding
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object for screen navigation
 * @returns {JSX.Element} Company information form UI
 */
const CompanyInfo = ({ navigation }) => {
  const { formData, updateFormData, getProgress } = useEmployerOnboarding();
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSpecializationsOpen, setIsSpecializationsOpen] = useState(false);
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const isDirectEmployer = formData.employerType.type === 'direct';
  const MAX_DESCRIPTION_LENGTH = 1000;

  // Convert industries array to dropdown format
  const industryOptions = industries.map(industry => ({
    label: industry,
    value: industry
  }));

  /**
   * @function handleImagePick
   * @description Handles company logo image selection from device gallery
   * @async
   * @throws {Error} When permission is denied or image selection fails
   * @returns {Promise<void>}
   */
  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      updateFormData('companyInfo', 'logo', result.assets[0].uri);
    }
  };

  /**
   * @function validateForm
   * @description Validates all company/agency information fields
   * @returns {boolean} True if all required fields are valid
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Required for both types
    if (!formData.companyInfo.name?.trim()) {
      newErrors.name = `${isDirectEmployer ? 'Company' : 'Agency'} name is required`;
    }
    if (!formData.companyInfo.description?.trim()) {
      newErrors.description = `${isDirectEmployer ? 'Company' : 'Agency'} description is required`;
    }
    if (!formData.companyInfo.size) {
      newErrors.size = `${isDirectEmployer ? 'Company' : 'Agency'} size is required`;
    }
    
    // Website validation if provided
    if (formData.companyInfo.website && !formData.companyInfo.website.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    
    // Direct employer specific validation
    if (isDirectEmployer) {
      if (!formData.companyInfo.primaryIndustry?.trim()) {
        newErrors.primaryIndustry = 'Industry is required';
      }
    } else {
      // Agency specific validation
      if (!formData.companyInfo.specializations || formData.companyInfo.specializations.length === 0) {
        newErrors.specializations = 'At least one specialization is required';
      }
    }

    setErrors(newErrors);
    console.log('Validation Errors:', newErrors);
    console.log('Form Data:', formData.companyInfo);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * @function handleNext
   * @description Validates form and navigates to next screen based on employer type
   * @returns {void}
   */
  const handleNext = () => {
    if (validateForm()) {
      if (isDirectEmployer) {
        navigation.navigate('Location');
      } else {
        // For agencies, navigate to Verification after validation
        navigation.navigate('Verification');
      }
    }
  };

  return (
    <Container>
      <ProgressBar progress={getProgress()} style={styles.progress} />
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <Text style={styles.title}>
          {isDirectEmployer ? 'Company Information' : 'Agency Information'}
        </Text>
        <Text style={styles.subtitle}>
          {isDirectEmployer 
            ? 'Tell us about your company' 
            : 'Tell us about your recruitment agency'}
        </Text>

        <View style={styles.form}>
          <Input
            label={isDirectEmployer ? 'Company Name' : 'Agency Name'}
            value={formData.companyInfo.name}
            onChangeText={(value) => updateFormData('companyInfo', 'name', value)}
            error={errors.name}
            placeholder={isDirectEmployer ? 'Enter company name' : 'Enter agency name'}
          />

          <View style={styles.textAreaContainer}>
            <Text style={styles.label}>
              Description
              {errors.description && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={[
              styles.textAreaWrapper,
              errors.description && styles.inputError
            ]}>
              <TextInput
                value={formData.companyInfo.description}
                onChangeText={(value) => {
                  if (value.length <= MAX_DESCRIPTION_LENGTH) {
                    updateFormData('companyInfo', 'description', value);
                  }
                }}
                placeholder={isDirectEmployer 
                  ? 'Brief description of your company, culture, and what makes you unique...' 
                  : 'Brief description of your agency, services, and what sets you apart...'}
                placeholderTextColor={theme.colors.neutral.gray}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                style={styles.textArea}
              />
            </View>
            <View style={styles.characterCount}>
              <Text style={[
                styles.characterCountText,
                formData.companyInfo.description?.length === MAX_DESCRIPTION_LENGTH && 
                styles.characterCountWarning
              ]}>
                {`${formData.companyInfo.description?.length || 0}/${MAX_DESCRIPTION_LENGTH}`}
              </Text>
            </View>
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          <View style={[styles.dropdownContainer, { zIndex: 3000 }]}>
            <Text style={styles.dropdownLabel}>
              {isDirectEmployer ? 'Company Size' : 'Agency Size'}
            </Text>
            <DropDownPicker
              open={isDropdownOpen}
              value={formData.companyInfo.size}
              items={companySizes}
              setOpen={setIsDropdownOpen}
              setValue={(callback) => {
                const value = callback(formData.companyInfo.size);
                updateFormData('companyInfo', 'size', value);
              }}
              style={styles.dropdown}
              dropDownContainerStyle={[styles.dropdownList, { 
                position: 'relative',
                top: 0,
                marginTop: -1
              }]}
              placeholder="Select size"
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
                contentContainerStyle: {
                  paddingBottom: 0
                }
              }}
              flatListProps={{
                contentContainerStyle: {
                  paddingBottom: 0
                }
              }}
              zIndex={3000}
            />
            {errors.size && <Text style={styles.errorText}>{errors.size}</Text>}
          </View>

          <Input
            label="Website (Optional)"
            value={formData.companyInfo.website}
            onChangeText={(value) => updateFormData('companyInfo', 'website', value)}
            error={errors.website}
            placeholder="https://www.example.com"
            keyboardType="url"
          />

          {isDirectEmployer ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Industry</Text>
                <DropDownPicker
                  open={isIndustryDropdownOpen}
                  value={formData.companyInfo.primaryIndustry}
                  items={industryOptions}
                  setOpen={setIsIndustryDropdownOpen}
                  setValue={(callback) => {
                    const value = callback(formData.companyInfo.primaryIndustry);
                    updateFormData('companyInfo', 'primaryIndustry', value);
                  }}
                  style={styles.dropdown}
                  dropDownContainerStyle={[styles.dropdownList, { 
                    position: 'relative',
                    top: 0,
                    marginTop: -1
                  }]}
                  placeholder="Select industry"
                  listMode="SCROLLVIEW"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                    contentContainerStyle: {
                      paddingBottom: 0
                    }
                  }}
                  flatListProps={{
                    contentContainerStyle: {
                      paddingBottom: 0
                    }
                  }}
                  zIndex={2000}
                />
                {errors.primaryIndustry && (
                  <Text style={styles.errorText}>{errors.primaryIndustry}</Text>
                )}
              </View>
              
              <Input
                label="Company Email Domain (Optional). We need this to verify your account."
                value={formData.companyInfo.emailDomain}
                onChangeText={(value) => updateFormData('companyInfo', 'emailDomain', value)}
                placeholder="e.g., company.com"
                keyboardType="email-address"
              />
            </>
          ) : (
            <>
              <View style={[styles.dropdownContainer, { zIndex: 2000 }]}>
                <Text style={styles.dropdownLabel}>
                  Specializations
                </Text>
                <DropDownPicker
                  open={isSpecializationsOpen}
                  value={formData.companyInfo.specializations}
                  items={industrySpecializations}
                  setOpen={setIsSpecializationsOpen}
                  setValue={(callback) => {
                    const value = callback(formData.companyInfo.specializations);
                    updateFormData('companyInfo', 'specializations', value);
                  }}
                  style={styles.dropdown}
                  dropDownContainerStyle={[styles.dropdownList, { position: 'relative' }]}
                  placeholder="Select specializations"
                  multiple={true}
                  zIndex={2000}
                  listMode="SCROLLVIEW"
                />
                {errors.specializations && <Text style={styles.errorText}>{errors.specializations}</Text>}
              </View>
              
              <Input
                label="Years in Business (Optional)"
                value={formData.companyInfo.yearsInBusiness?.toString() || ''}
                onChangeText={(value) => updateFormData('companyInfo', 'yearsInBusiness', parseInt(value) || '')}
                placeholder="e.g., 5"
                keyboardType="number-pad"
              />
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="outline"
            title="Back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Button
            title="Next"
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </ScrollView>
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
  form: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    position: 'relative',
    zIndex: 1000,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
  dropdownContainer: {
    marginBottom: theme.spacing.md,
  },
  dropdownLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.xs,
  },
  dropdown: {
    borderColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
    minHeight: 45,
    backgroundColor: theme.colors.neutral.white,
  },
  dropdownList: {
    borderColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.white,
  },
  errorText: {
    color: theme.colors.accent.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
  textAreaContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.accent.error,
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.white,
    ...Platform.select({
      ios: theme.shadows.sm,
      android: {
        elevation: theme.shadows.sm.elevation,
      },
    }),
  },
  textArea: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkGrey,
    padding: theme.spacing.lg,
    minHeight: theme.spacing['6xl'],
  },
  inputError: {
    borderColor: theme.colors.accent.error,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: theme.spacing.xs,
  },
  characterCountText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
  },
  characterCountWarning: {
    color: theme.colors.accent.warning,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent.error,
    marginTop: theme.spacing.xs,
  },
});

export default CompanyInfo;
