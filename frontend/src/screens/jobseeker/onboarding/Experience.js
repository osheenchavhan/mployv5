/**
 * @fileoverview JobSeeker Experience Onboarding Screen
 * 
 * This screen is part of the job seeker onboarding flow, collecting detailed
 * work experience information. It supports both experienced and fresher candidates
 * with a dynamic form interface that adapts based on user selection.
 * 
 * Key Features:
 * - Toggle between experienced and fresher status
 * - Dynamic form fields based on experience status
 * - Multiple job role selection (up to 3)
 * - Industry selection from predefined list
 * - Employment duration tracking
 * - Notice period and salary information
 * 
 * Form Fields:
 * - Experience Status (required)
 * - Years and Months of Experience
 * - Job Title (required)
 * - Job Roles (required, max 3)
 * - Company Name (required)
 * - Industry (required)
 * - Current Employment Status
 * - Notice Period
 * - Current/Last Salary
 * - Start Date (Month/Year)
 * 
 * Data Sources:
 * - Industries from industries.json
 * - Predefined job roles and notice periods
 * 
 * User Experience:
 * The screen uses a clean, intuitive layout with chips for selections
 * and clear form validation feedback.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { theme } from '../../../theme/theme';
import { useOnboarding } from '../../../context/OnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';
import DropDownPicker from 'react-native-dropdown-picker';
import industriesData from '../../../data/experience/industries.json';
import skillsData from '../../../data/experience/skills.json';
import Chip from '../../../components/common/Chip';

// Constants for dropdown options
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = Array.from({ length: 50 }, (_, i) => ({
  label: `${new Date().getFullYear() - i}`,
  value: `${new Date().getFullYear() - i}`
}));

const NOTICE_PERIODS = [
  'No notice period',
  'Less than 15 days',
  '1 month',
  '2 months',
  '3 or more months'
];

/**
 * Experience Screen Component
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation prop for screen navigation
 * @returns {JSX.Element} Experience form screen
 */
const Experience = ({ navigation }) => {
  // Get formData first
  const { formData, updateFormData } = useOnboarding();

  // State Management
  /** @state {boolean} hasExperience - Tracks if user has work experience */
  const [hasExperience, setHasExperience] = useState(formData?.experience?.hasExperience || false);
  /** @state {string} experienceYears - Total years of experience */
  const [experienceYears, setExperienceYears] = useState(formData?.experience?.experienceYears || '');
  /** @state {string} experienceMonths - Additional months of experience */
  const [experienceMonths, setExperienceMonths] = useState(formData?.experience?.experienceMonths || '');
  /** @state {string} jobTitle - Current/Last job title */
  const [jobTitle, setJobTitle] = useState(formData?.experience?.jobTitle || '');
  /** @state {string} companyName - Current/Last company name */
  const [companyName, setCompanyName] = useState(formData?.experience?.companyName || '');
  /** @state {string} industry - Selected industry */
  const [industry, setIndustry] = useState(formData?.experience?.industry || null);
  /** @state {boolean} openIndustry - Controls industry dropdown visibility */
  const [openIndustry, setOpenIndustry] = useState(false);
  /** @state {boolean} currentlyWorking - Indicates if user is currently employed */
  const [currentlyWorking, setCurrentlyWorking] = useState(formData?.experience?.currentlyWorking || false);
  /** @state {string} noticePeriod - Selected notice period */
  const [noticePeriod, setNoticePeriod] = useState(formData?.experience?.noticePeriod || null);
  /** @state {string} currentSalary - Current/Last salary */
  const [currentSalary, setCurrentSalary] = useState(formData?.experience?.currentSalary || '');
  /** @state {string} startMonth - Employment start month */
  const [startMonth, setStartMonth] = useState(formData?.experience?.startMonth || '');
  /** @state {string} startYear - Employment start year */
  const [startYear, setStartYear] = useState(formData?.experience?.startYear || '');
  /** @state {boolean} openStartMonth - Controls start month dropdown visibility */
  const [openStartMonth, setOpenStartMonth] = useState(false);
  /** @state {boolean} openStartYear - Controls start year dropdown visibility */
  const [openStartYear, setOpenStartYear] = useState(false);
  /** @state {boolean} openNoticePeriod - Controls notice period dropdown visibility */
  const [openNoticePeriod, setOpenNoticePeriod] = useState(false);
  /** @state {Object} errors - Form validation errors */
  const [errors, setErrors] = useState({});

  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(formData?.experience?.skills || []);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  /**
   * Handles form validation and navigation to next screen
   * @function handleNextPress
   * @description 
   * 1. Validates all required fields based on user's experience status
   * 2. If validation fails, displays appropriate error messages
   * 3. If validation passes, updates form data and navigates to Salary screen
   */
  const handleNextPress = () => {
    const newErrors = {};

    if (hasExperience) {
      if (!experienceYears) newErrors.years = 'Years of experience is required';
      if (!jobTitle) newErrors.jobTitle = 'Job title is required';
      if (!industry) newErrors.industry = 'Industry is required';
      if (currentlyWorking) {
        if (!noticePeriod) newErrors.noticePeriod = 'Notice period is required';
        if (!currentSalary) newErrors.salary = 'Current salary is required';
      }
      if (!startMonth || !startYear) newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Save experience data
      updateFormData({
        experience: {
          hasExperience,
          experienceYears,
          experienceMonths,
          jobTitle,
          companyName,
          industry,
          currentlyWorking,
          noticePeriod,
          currentSalary,
          startMonth,
          startYear,
          skills
        }
      }, 'Salary');

      // Navigate to Salary screen
      navigation.navigate('Salary');
    }
  };

  /**
   * Toggles selection of job roles
   * @function toggleRole
   * @param {string} role - Role to toggle
   * @description
   * - Adds or removes a role from selectedRoles array
   * - Maintains maximum limit of 3 selected roles
   */
  const toggleRole = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else if (selectedRoles.length < 3) {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  /**
   * Handles skill input changes and filters suggestions
   * @param {string} text - Input text
   */
  const handleSkillInput = (text) => {
    setSkillInput(text);
    if (text.trim()) {
      const filtered = skillsData.skills.filter(
        skill => skill.toLowerCase().includes(text.toLowerCase()) && 
        !skills.includes(skill)
      );
      setFilteredSkills(filtered);
      setShowSkillSuggestions(true);
    } else {
      setFilteredSkills([]);
      setShowSkillSuggestions(false);
    }
  };

  /**
   * Adds a skill from suggestions
   * @param {string} skill - Selected skill
   */
  const addSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setSkillInput('');
    setShowSkillSuggestions(false);
  };

  /**
   * Removes a skill from selected skills
   * @param {string} skillToRemove - Skill to remove
   */
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <Container>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          <ProgressBar progress={0.6 * 100} />
          
          <Text style={styles.header}>Experience</Text>
          <Text style={styles.subHeader}>Tell us about your professional journey</Text>

          {/* Experience Toggle */}
          <View style={styles.section}>
            <Text style={styles.label}>Do you have work experience?</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[
                  styles.toggleButton,
                  hasExperience && styles.toggleButtonSelected
                ]}
                onPress={() => setHasExperience(true)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  hasExperience && styles.toggleButtonTextSelected
                ]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.toggleButton,
                  !hasExperience && styles.toggleButtonSelected
                ]}
                onPress={() => setHasExperience(false)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  !hasExperience && styles.toggleButtonTextSelected
                ]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {hasExperience && (
            <>
              {/* Experience Duration */}
              <View style={styles.section}>
                <Text style={styles.label}>Total Experience</Text>
                <View style={styles.row}>
                  <View style={[styles.inputContainer, { flex: 1, marginRight: theme.spacing.small }]}>
                    <Input
                      placeholder="Years"
                      value={experienceYears}
                      onChangeText={setExperienceYears}
                      keyboardType="numeric"
                      error={errors.years}
                    />
                  </View>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Input
                      placeholder="Months"
                      value={experienceMonths}
                      onChangeText={setExperienceMonths}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>
              </View>

              {/* Job Details */}
              <View style={styles.section}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Job Title</Text>
                  <Input
                    placeholder="Enter your job title"
                    value={jobTitle}
                    onChangeText={setJobTitle}
                    error={errors.jobTitle}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Company Name</Text>
                  <Input
                    placeholder="Enter company name"
                    value={companyName}
                    onChangeText={setCompanyName}
                    error={errors.companyName}
                  />
                </View>

                <View style={[styles.dropdownContainer, { zIndex: 3000 }]}>
                  <Text style={styles.label}>Industry</Text>
                  <DropDownPicker
                    open={openIndustry}
                    value={industry}
                    items={industriesData.industries.map(ind => ({ label: ind, value: ind }))}
                    setOpen={setOpenIndustry}
                    setValue={setIndustry}
                    placeholder="Select Industry"
                    style={styles.dropdown}
                    dropDownContainerStyle={[styles.dropdownList, { position: 'relative' }]}
                    listMode="MODAL"
                    modalProps={{
                      animationType: "slide"
                    }}
                    zIndex={3000}
                  />
                  {errors.industry && <Text style={styles.error}>{errors.industry}</Text>}
                </View>

                {/* Employment Status */}
                <View style={[styles.section, { zIndex: 2000 }]}>
                  <Text style={styles.label}>Currently Working Here?</Text>
                  <View style={styles.toggleContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.toggleButton,
                        currentlyWorking && styles.toggleButtonSelected
                      ]}
                      onPress={() => setCurrentlyWorking(true)}
                    >
                      <Text style={[
                        styles.toggleButtonText,
                        currentlyWorking && styles.toggleButtonTextSelected
                      ]}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.toggleButton,
                        !currentlyWorking && styles.toggleButtonSelected
                      ]}
                      onPress={() => setCurrentlyWorking(false)}
                    >
                      <Text style={[
                        styles.toggleButtonText,
                        !currentlyWorking && styles.toggleButtonTextSelected
                      ]}>No</Text>
                    </TouchableOpacity>
                  </View>

                  {currentlyWorking && (
                    <View style={[styles.dropdownContainer, { zIndex: 2000 }]}>
                      <Text style={styles.label}>Notice Period</Text>
                      <DropDownPicker
                        open={openNoticePeriod}
                        value={noticePeriod}
                        items={NOTICE_PERIODS.map(period => ({ label: period, value: period }))}
                        setOpen={setOpenNoticePeriod}
                        setValue={setNoticePeriod}
                        placeholder="Select Notice Period"
                        style={styles.dropdown}
                        dropDownContainerStyle={[styles.dropdownList, { position: 'relative' }]}
                        listMode="MODAL"
                        modalProps={{
                          animationType: "slide"
                        }}
                        zIndex={2000}
                      />
                    </View>
                  )}
                </View>

                {/* Start Date */}
                <View style={[styles.section, { zIndex: 1000 }]}>
                  <Text style={styles.label}>Start Date</Text>
                  <View style={styles.row}>
                    <View style={[styles.dropdownContainer, { flex: 1, marginRight: theme.spacing.small, zIndex: 1000 }]}>
                      <DropDownPicker
                        open={openStartMonth}
                        value={startMonth}
                        items={MONTHS.map(month => ({ label: month, value: month }))}
                        setOpen={setOpenStartMonth}
                        setValue={setStartMonth}
                        placeholder="Month"
                        style={styles.dropdown}
                        dropDownContainerStyle={[styles.dropdownList, { position: 'relative' }]}
                        listMode="MODAL"
                        modalProps={{
                          animationType: "slide"
                        }}
                        zIndex={1000}
                      />
                    </View>
                    <View style={[styles.dropdownContainer, { flex: 1, zIndex: 1000 }]}>
                      <DropDownPicker
                        open={openStartYear}
                        value={startYear}
                        items={YEARS}
                        setOpen={setOpenStartYear}
                        setValue={setStartYear}
                        placeholder="Year"
                        style={styles.dropdown}
                        dropDownContainerStyle={[styles.dropdownList, { position: 'relative' }]}
                        listMode="MODAL"
                        modalProps={{
                          animationType: "slide"
                        }}
                        zIndex={1000}
                      />
                    </View>
                  </View>
                  {errors.startDate && <Text style={styles.error}>{errors.startDate}</Text>}
                </View>

                {/* Current Salary - Moved below Start Date */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Current Salary (₹)</Text>
                  <Input
                    placeholder="Enter current salary"
                    value={currentSalary}
                    onChangeText={setCurrentSalary}
                    keyboardType="numeric"
                    error={errors.salary}
                  />
                </View>
              </View>
            </>
          )}

          {/* Skills Section - Always visible */}
          <View style={[styles.section, { zIndex: 1 }]}>
            <Text style={styles.label}>Skills</Text>
            <Text style={styles.subLabel}>Start typing to see suggestions</Text>
            <Input
              value={skillInput}
              onChangeText={handleSkillInput}
              placeholder="Type a skill..."
            />
            {showSkillSuggestions && filteredSkills.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={filteredSkills}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => addSkill(item)}
                    >
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.suggestionsList}
                  nestedScrollEnabled
                />
              </View>
            )}
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{skill}</Text>
                  <TouchableOpacity onPress={() => removeSkill(skill)}>
                    <Text style={styles.removeIcon}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <Button
            title="Back"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.backButton}
          />
          <Button
            title={hasExperience ? "Next" : "I'm a Fresher"}
            onPress={handleNextPress}
            variant="primary"
            style={styles.nextButton}
          />
        </View>
      </View>
    </Container>
  );
};

/**
 * Component Styles
 * @constant styles
 * @description Defines the styling for all components in the Experience screen
 * Key sections:
 * - Container and card layouts
 * - Typography styles for titles, labels, and notes
 * - Input field customizations
 * - Dropdown and date picker styles
 * - Responsive spacing and margins
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    color: theme.colors.primary.main,
  },
  subHeader: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    marginBottom: theme.spacing.sm,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  chip: {
    marginBottom: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  dropdownContainer: {
    marginBottom: theme.spacing.md,
  },
  dropdown: {
    borderColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
  },
  dropdownList: {
    borderColor: theme.colors.neutral.lightGrey,
  },
  error: {
    color: theme.colors.accent.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: -theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  buttonContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.lightGrey,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },
  skillChipText: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSize.sm,
  },
  removeIcon: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSize.lg,
    marginLeft: theme.spacing.xs,
    marginTop: -2, // Slight adjustment for visual alignment
  },
  subLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
  },
  suggestionsContainer: {
    maxHeight: 150,
    marginTop: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.white,
  },
  suggestionsList: {
    flexGrow: 0,
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
});

export default Experience;
