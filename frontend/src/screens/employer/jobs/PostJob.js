/**
 * Why this file exists:
 * Creating job posts needs to be thorough yet simple. This screen helps:
 * 1. Create job listings:
 *    - Enter job details
 *    - Set requirements
 *    - Specify compensation
 *    - Define location preferences
 * 
 * 2. Manage job posts:
 *    - Save as drafts
 *    - Publish listings
 *    - Edit existing posts
 *    - Track post status
 * 
 * Think of it as your job creation hub that:
 * - Makes posting jobs straightforward
 * - Ensures all key details are included
 * - Helps write better job descriptions
 * - Maintains posting consistency
 * 
 * Without this screen:
 * - Job posts would lack structure
 * - Important details might be missed
 * - Posting jobs would be confusing
 * - Managing drafts would be difficult
 * 
 * @fileoverview Manages creation and editing of job postings
 * @package mployv5/screens/employer
 * @lastModified 2024-12-10
 * 
 * @example
 * // Creating a new job post
 * <PostJob />
 * 
 * // Editing an existing job
 * <PostJob jobId="existing-job-id" />
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, TextInput, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useJobPosting } from '../../../context/JobPostingContext';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Chip from '../../../components/common/Chip';
import Select from '../../../components/common/Select';
import { theme } from '../../../theme/theme';
import Container from '../../../components/common/Container';
import OnboardingHeader from '../../../components/common/OnboardingHeader';
import DropDownPicker from 'react-native-dropdown-picker';

/**
 * @constant {string[]} employmentTypes
 * @description Available employment type options for job postings
 * @example
 * // Using employment types in a select component
 * <Select
 *   options={employmentTypes.map(type => ({
 *     label: type.charAt(0).toUpperCase() + type.slice(1),
 *     value: type
 *   }))}
 * />
 */
const employmentTypes = [
  'full-time',
  'part-time',
  'contract',
  'internship'
];

/**
 * @constant {string[]} experienceLevels
 * @description Available experience level options for job postings
 * @example
 * // Using experience levels in a select component
 * <Select
 *   options={experienceLevels.map(level => ({
 *     label: level.charAt(0).toUpperCase() + level.slice(1),
 *     value: level
 *   }))}
 * />
 */
const experienceLevels = [
  'entry',
  'mid',
  'senior',
  'executive'
];

/**
 * @function PostJob
 * @description Main component for creating and editing job postings
 * @param {Object} props - Component props
 * @param {string} [props.jobId] - Optional ID of existing job to edit
 * @returns {JSX.Element} Job posting form UI
 * @example
 * // Creating a new job
 * const NewJobScreen = () => (
 *   <PostJob />
 * );
 * 
 * // Editing an existing job
 * const EditJobScreen = () => (
 *   <PostJob jobId="job-123" />
 * );
 */
const PostJob = ({ jobId }) => {
  const navigation = useNavigation();
  const { currentJob, updateJobField, errors, saveJob, loading } = useJobPosting();
  const [localErrors, setLocalErrors] = useState({});
  const [isEmploymentTypeOpen, setIsEmploymentTypeOpen] = useState(false);
  const [isExperienceLevelOpen, setIsExperienceLevelOpen] = useState(false);
  const [salaryType, setSalaryType] = useState('monthly');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /**
   * @function handleSave
   * @description Saves or publishes the job posting based on status
   * @param {string} status - Job status ('draft' or 'active')
   * @returns {Promise<void>}
   * @throws {Error} When saving job fails
   * @example
   * // Save as draft
   * await handleSave('draft');
   * 
   * // Publish job
   * await handleSave('active');
   */
  const handleSave = async (status) => {
    try {
      const success = await saveJob(status);
      if (success) {
        Alert.alert(
          'Success',
          status === 'draft' ? 'Job saved as draft' : 'Job posted successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const formatSalary = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const handleSkillInput = async (text) => {
    setSkillInput(text);
    
    if (text.length >= 2) {
      const staticSuggestions = [
        'React Native', 'JavaScript', 'Python', 'Java',
        'Digital Marketing', 'Content Writing', 'Sales',
        // ... more suggestions
      ].filter(skill => 
        skill.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 5);

      setSuggestions(staticSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <Container>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Post a New Job</Text>
          <Text style={styles.subtitle}>
            Create a job posting to find the perfect candidate
          </Text>

          <View style={styles.form}>
            {/* Job Title */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Job Title
                {errors.title && <Text style={styles.required}> *</Text>}
              </Text>
              <Input
                value={currentJob.title}
                onChangeText={(text) => updateJobField('title', text)}
                placeholder="Enter job title"
                error={errors.title}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            {/* Job Description */}
            <View style={styles.textAreaContainer}>
              <Text style={styles.label}>
                Job Description
                {errors.description && <Text style={styles.required}> *</Text>}
              </Text>
              <View style={[
                styles.textAreaWrapper,
                errors.description && styles.inputError
              ]}>
                <TextInput
                  value={currentJob.description}
                  onChangeText={(text) => updateJobField('description', text)}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  style={styles.textArea}
                />
              </View>
              <View style={styles.characterCount}>
                <Text style={styles.characterCountText}>
                  {`${currentJob.description?.length || 0}/1000`}
                </Text>
              </View>
              {errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
            </View>

            {/* Employment Type */}
            <View style={[styles.dropdownContainer, { zIndex: 3000 }]}>
              <Text style={styles.label}>Employment Type</Text>
              <DropDownPicker
                open={isEmploymentTypeOpen}
                value={currentJob.employmentType}
                items={employmentTypes.map((type) => ({
                  label: type.charAt(0).toUpperCase() + type.slice(1),
                  value: type,
                }))}
                setOpen={setIsEmploymentTypeOpen}
                setValue={(callback) => {
                  const value = callback(currentJob.employmentType);
                  updateJobField('employmentType', value);
                }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                placeholder="Select employment type"
                listMode="SCROLLVIEW"
                zIndex={3000}
              />
            </View>

            {/* Experience Level */}
            <View style={[styles.dropdownContainer, { zIndex: 2000 }]}>
              <Text style={styles.label}>Experience Level</Text>
              <DropDownPicker
                open={isExperienceLevelOpen}
                value={currentJob.experienceLevel}
                items={experienceLevels.map((level) => ({
                  label: level.charAt(0).toUpperCase() + level.slice(1),
                  value: level,
                }))}
                setOpen={setIsExperienceLevelOpen}
                setValue={(callback) => {
                  const value = callback(currentJob.experienceLevel);
                  updateJobField('experienceLevel', value);
                }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                placeholder="Select experience level"
                listMode="SCROLLVIEW"
                zIndex={2000}
              />
            </View>

            {/* Salary */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Salary</Text>
              <View style={styles.salaryContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <Input
                  value={salaryAmount}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setSalaryAmount(numericValue);
                    updateJobField('salary', {
                      amount: parseInt(numericValue) || 0,
                      type: salaryType
                    });
                  }}
                  placeholder="Amount"
                  keyboardType="numeric"
                  style={styles.salaryInput}
                />
              </View>
              
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    salaryType === 'monthly' && styles.toggleButtonSelected
                  ]}
                  onPress={() => {
                    setSalaryType('monthly');
                    updateJobField('salary', {
                      ...currentJob.salary,
                      type: 'monthly'
                    });
                  }}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    salaryType === 'monthly' && styles.toggleButtonTextSelected
                  ]}>
                    Monthly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    salaryType === 'yearly' && styles.toggleButtonSelected
                  ]}
                  onPress={() => {
                    setSalaryType('yearly');
                    updateJobField('salary', {
                      ...currentJob.salary,
                      type: 'yearly'
                    });
                  }}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    salaryType === 'yearly' && styles.toggleButtonTextSelected
                  ]}>
                    Yearly
                  </Text>
                </TouchableOpacity>
              </View>
              
              {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}
              <Text style={styles.salaryDisplay}>
                {salaryAmount ? `₹${formatSalary(salaryAmount)}/${salaryType}` : ''}
              </Text>
            </View>

            {/* Location */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location*</Text>
              <Input
                value={currentJob.location.locations[0] || ''}
                onChangeText={(text) =>
                  updateJobField('location', {
                    ...currentJob.location,
                    locations: [text],
                  })
                }
                placeholder="Enter job location"
                error={errors.location}
              />
              {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
            </View>

            {/* Skills */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Required Skills</Text>
              <View style={styles.skillInputContainer}>
                <Input
                  placeholder="Type a skill and press Enter"
                  value={skillInput}
                  onChangeText={handleSkillInput}
                  onSubmitEditing={() => {
                    if (skillInput.trim()) {
                      const newSkill = skillInput.trim();
                      if (!currentJob.skills.includes(newSkill)) {
                        updateJobField('skills', [...currentJob.skills, newSkill]);
                      }
                      setSkillInput('');
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }
                  }}
                  returnKeyType="done"
                />
              </View>

              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {suggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      style={styles.suggestionItem}
                      onPress={() => {
                        if (!currentJob.skills.includes(suggestion)) {
                          updateJobField('skills', [...currentJob.skills, suggestion]);
                        }
                        setSkillInput('');
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.skillsContainer}>
                {currentJob.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    variant="removable"
                    selected={true}
                    onRemove={() => {
                      const newSkills = currentJob.skills.filter(s => s !== skill);
                      updateJobField('skills', newSkills);
                    }}
                    style={styles.skillChip}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleSave('draft')}
              style={[styles.button, styles.backButton]}
            >
              <Text style={styles.buttonText}>Save as Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSave('active')}
              style={[styles.button, styles.nextButton]}
            >
              <Text style={[styles.buttonText, styles.nextButtonText]}>Publish Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
    zIndex: 2,
  },
  inputContainer: {
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
  textAreaContainer: {
    marginBottom: theme.spacing.md,
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
  dropdownContainer: {
    marginBottom: theme.spacing.md,
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
    position: 'relative',
    top: 0,
    marginTop: -1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
    position: 'relative',
    zIndex: 3,
  },
  button: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  nextButton: {
    backgroundColor: theme.colors.primary.main,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent.error,
    marginTop: theme.spacing.xs,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: theme.spacing.xs,
  },
  characterCountText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  currencySymbol: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral.darkGrey,
    marginRight: theme.spacing.xs,
  },
  salaryInput: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
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
  skillInputContainer: {
    marginBottom: theme.spacing.md,
  },
  suggestionsContainer: {
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.white,
    maxHeight: 200,
    ...theme.shadows.sm,
  },
  suggestionItem: {
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.lightGrey,
  },
  suggestionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.darkGrey,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  skillChip: {
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.light,
    borderColor: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  buttonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.main,
  },
  nextButtonText: {
    color: theme.colors.neutral.white,
  },
});

export default PostJob;
