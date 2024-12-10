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
import { View, ScrollView, StyleSheet, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useJobPosting } from '../../../context/JobPostingContext';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Chip from '../../../components/common/Chip';
import Select from '../../../components/common/Select';
import { theme } from '../../../theme/theme';

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Post a New Job</Text>

        {/* Job Title */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Job Title*</Text>
          <Input
            value={currentJob.title}
            onChangeText={(text) => updateJobField('title', text)}
            placeholder="Enter job title"
            error={errors.title}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Job Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Job Description*</Text>
          <Input
            value={currentJob.description}
            onChangeText={(text) => updateJobField('description', text)}
            placeholder="Enter job description"
            multiline
            numberOfLines={4}
            error={errors.description}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* Employment Type */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Employment Type*</Text>
          <Select
            value={currentJob.employmentType}
            onChange={(value) => updateJobField('employmentType', value)}
            options={employmentTypes.map((type) => ({
              label: type.charAt(0).toUpperCase() + type.slice(1),
              value: type,
            }))}
            placeholder="Select employment type"
          />
        </View>

        {/* Experience Level */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Experience Level*</Text>
          <Select
            value={currentJob.experienceLevel}
            onChange={(value) => updateJobField('experienceLevel', value)}
            options={experienceLevels.map((level) => ({
              label: level.charAt(0).toUpperCase() + level.slice(1),
              value: level,
            }))}
            placeholder="Select experience level"
          />
        </View>

        {/* Salary */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Salary*</Text>
          <View style={styles.salaryContainer}>
            <Input
              value={currentJob.salary.amount.toString()}
              onChangeText={(text) =>
                updateJobField('salary', {
                  ...currentJob.salary,
                  amount: parseInt(text) || 0,
                })
              }
              placeholder="Amount"
              keyboardType="numeric"
              style={styles.salaryInput}
              error={errors.salary}
            />
            <Button
              onPress={() =>
                updateJobField('salary', {
                  ...currentJob.salary,
                  type: currentJob.salary.type === 'monthly' ? 'annual' : 'monthly',
                })
              }
              style={styles.salaryTypeButton}
            >
              {currentJob.salary.type.charAt(0).toUpperCase() +
                currentJob.salary.type.slice(1)}
            </Button>
          </View>
          {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}
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
          <Text style={styles.label}>Required Skills*</Text>
          <Input
            value={currentJob.skills.join(', ')}
            onChangeText={(text) => {
              const skillsArray = text.split(',').map(skill => skill.trim()).filter(Boolean);
              updateJobField('skills', skillsArray);
            }}
            placeholder="Enter skills (comma separated)"
            error={errors.skills}
          />
          {errors.skills && <Text style={styles.errorText}>{errors.skills}</Text>}
          {currentJob.skills.length > 0 && (
            <View style={styles.chipContainer}>
              {currentJob.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => {
                    const newSkills = currentJob.skills.filter((_, i) => i !== index);
                    updateJobField('skills', newSkills);
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => handleSave('draft')}
            style={styles.draftButton}
            loading={loading}
          >
            Save as Draft
          </Button>
          <Button
            onPress={() => handleSave('active')}
            style={styles.publishButton}
            loading={loading}
          >
            Publish Job
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xl,
    color: theme.colors.primary.main,
  },
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
    color: theme.colors.neutral.darkGrey,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  chip: {
    backgroundColor: theme.colors.neutral.background,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.neutral.lightGrey,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  chipText: {
    color: theme.colors.neutral.darkGrey,
  },
  selectedChipText: {
    color: theme.colors.neutral.white,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salaryInput: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  salaryTypeButton: {
    backgroundColor: theme.colors.neutral.background,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing['2xl'],
  },
  draftButton: {
    flex: 1,
    marginRight: theme.spacing.xs,
    backgroundColor: theme.colors.neutral.background,
  },
  publishButton: {
    flex: 1,
    marginLeft: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xxs,
    color: theme.colors.accent.error,
  },
});

export default PostJob;
