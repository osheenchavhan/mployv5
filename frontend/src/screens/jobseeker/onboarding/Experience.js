/**
 * @component Experience
 * @description A comprehensive form component for collecting job seeker's work experience details.
 * This screen is part of the onboarding flow and handles both experienced and fresher candidates.
 * It captures details like total experience, current job details, salary information, and notice period.
 * 
 * Key Features:
 * - Toggle between experienced and fresher status
 * - Capture total years and months of experience
 * - Collect current/last job details including title, roles, and company
 * - Handle current employment status and notice period
 * - Manage salary information
 * - Validate all required fields before proceeding
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { theme } from '../../../theme/theme';
import { useOnboarding } from '../../../context/OnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';
import DropDownPicker from 'react-native-dropdown-picker';
import industriesData from '../../../data/experience/industries.json';
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

const JOB_ROLES = [
  'Digital Marketing',
  'Social Media Marketing',
  'Content Marketing',
  'Email Marketing',
  'SEO',
  'SEM',
  'Marketing Analytics',
  'Marketing Strategy',
  'Promotional Marketing',
  'Brand Strategy',
  'Branding'
];

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
  // State Management
  /** @state {boolean} hasExperience - Tracks if user has work experience */
  const [hasExperience, setHasExperience] = useState(true);
  /** @state {string} experienceYears - Total years of experience */
  const [experienceYears, setExperienceYears] = useState('');
  /** @state {string} experienceMonths - Additional months of experience */
  const [experienceMonths, setExperienceMonths] = useState('');
  /** @state {string} jobTitle - Current/Last job title */
  const [jobTitle, setJobTitle] = useState('');
  /** @state {Array<string>} selectedRoles - List of selected job roles (max 3) */
  const [selectedRoles, setSelectedRoles] = useState([]);
  /** @state {string} companyName - Current/Last company name */
  const [companyName, setCompanyName] = useState('');
  /** @state {string} industry - Selected industry */
  const [industry, setIndustry] = useState('');
  /** @state {boolean} openIndustry - Controls industry dropdown visibility */
  const [openIndustry, setOpenIndustry] = useState(false);
  /** @state {boolean} currentlyWorking - Indicates if user is currently employed */
  const [currentlyWorking, setCurrentlyWorking] = useState(true);
  /** @state {string} noticePeriod - Selected notice period */
  const [noticePeriod, setNoticePeriod] = useState('1 month');
  /** @state {string} currentSalary - Current/Last salary */
  const [currentSalary, setCurrentSalary] = useState('');
  /** @state {string} startMonth - Employment start month */
  const [startMonth, setStartMonth] = useState('');
  /** @state {string} startYear - Employment start year */
  const [startYear, setStartYear] = useState('');
  /** @state {boolean} openStartMonth - Controls start month dropdown visibility */
  const [openStartMonth, setOpenStartMonth] = useState(false);
  /** @state {boolean} openStartYear - Controls start year dropdown visibility */
  const [openStartYear, setOpenStartYear] = useState(false);
  /** @state {Object} errors - Form validation errors */
  const [errors, setErrors] = useState({});

  const { formData, updateFormData } = useOnboarding();

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
      if (selectedRoles.length === 0) newErrors.roles = 'Please select at least one role';
      if (!industry) newErrors.industry = 'Industry is required';
      if (currentlyWorking) {
        if (!noticePeriod) newErrors.noticePeriod = 'Notice period is required';
        if (!currentSalary) newErrors.salary = 'Current salary is required';
      }
      if (!startMonth || !startYear) newErrors.startDate = 'Start date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save experience data
    updateFormData({
      hasExperience,
      experienceYears,
      experienceMonths,
      jobTitle,
      selectedRoles,
      industry,
      currentlyWorking,
      noticePeriod,
      currentSalary,
      startDate: startMonth && startYear ? `${startMonth} ${startYear}` : null,
    }, 'Salary'); // Pass 'Salary' as the next step

    // Navigate to Salary screen
    navigation.navigate('Salary');
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

  return (
    <Container>
      <ScrollView style={styles.container}>
        <ProgressBar progress={0.6} />
        <Text style={styles.title}>Experience Details</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Do you have work experience?</Text>
          <View style={styles.toggleContainer}>
            <Chip
              label="Yes"
              variant="choice"
              selected={hasExperience}
              onPress={() => setHasExperience(true)}
            />
            <Chip
              label="No"
              variant="choice"
              selected={!hasExperience}
              onPress={() => setHasExperience(false)}
            />
          </View>

          {hasExperience && (
            <>
              <Text style={styles.label}>Total Years of Experience</Text>
              <View style={styles.experienceInputs}>
                <View style={styles.yearInput}>
                  <Input
                    placeholder="Years"
                    value={experienceYears}
                    onChangeText={setExperienceYears}
                    keyboardType="numeric"
                    error={errors.years}
                  />
                </View>
                <View style={styles.monthInput}>
                  <Input
                    placeholder="Months (Optional)"
                    value={experienceMonths}
                    onChangeText={setExperienceMonths}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
              </View>

              <Text style={styles.label}>Job Title</Text>
              <Input
                placeholder="e.g. Teacher"
                value={jobTitle}
                onChangeText={setJobTitle}
                error={errors.jobTitle}
              />

              <Text style={styles.label}>Job role</Text>
              <Text style={styles.subtitle}>Select up to 3 roles for this job</Text>
              <View style={styles.rolesContainer}>
                {JOB_ROLES.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    variant="choice"
                    selected={selectedRoles.includes(role)}
                    onPress={() => {
                      if (!selectedRoles.includes(role) && selectedRoles.length < 3) {
                        setSelectedRoles([...selectedRoles, role]);
                      } else if (selectedRoles.includes(role)) {
                        setSelectedRoles(selectedRoles.filter(r => r !== role));
                      }
                    }}
                  />
                ))}
              </View>
              {errors.roles && <Text style={styles.errorText}>{errors.roles}</Text>}

              <Text style={styles.label}>Company Name</Text>
              <Input
                placeholder="e.g. ApnaTime Tech"
                value={companyName}
                onChangeText={setCompanyName}
                error={errors.companyName}
              />

              <Text style={styles.label}>Industry</Text>
              <DropDownPicker
                open={openIndustry}
                value={industry}
                items={industriesData.industries.map(ind => ({
                  label: ind,
                  value: ind
                }))}
                setOpen={setOpenIndustry}
                setValue={setIndustry}
                placeholder="Select an option"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                searchable={true}
                zIndex={1500}
                error={errors.industry}
              />
              {errors.industry && <Text style={styles.errorText}>{errors.industry}</Text>}

              <Text style={styles.label}>Are you currently working in this company?</Text>
              <View style={styles.toggleContainer}>
                <Chip
                  label="Yes"
                  variant="choice"
                  selected={currentlyWorking}
                  onPress={() => setCurrentlyWorking(true)}
                />
                <Chip
                  label="No"
                  variant="choice"
                  selected={!currentlyWorking}
                  onPress={() => setCurrentlyWorking(false)}
                />
              </View>

              {currentlyWorking && (
                <>
                  <Text style={styles.label}>Notice Period</Text>
                  <View style={styles.noticePeriodContainer}>
                    {NOTICE_PERIODS.map((period) => (
                      <Chip
                        key={period}
                        label={period}
                        variant="choice"
                        selected={noticePeriod === period}
                        onPress={() => setNoticePeriod(period)}
                      />
                    ))}
                  </View>
                  {errors.noticePeriod && <Text style={styles.errorText}>{errors.noticePeriod}</Text>}

                  <Text style={styles.label}>Current Salary</Text>
                  <View style={styles.salaryInput}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <Input
                      placeholder="4,00,000"
                      value={currentSalary}
                      onChangeText={setCurrentSalary}
                      keyboardType="numeric"
                      error={errors.salary}
                      style={{ flex: 1 }}
                    />
                  </View>
                  <Text style={styles.salaryNote}>
                    Salary information is private, we use it only to show relevant jobs
                  </Text>
                </>
              )}

              <Text style={styles.label}>Start Date</Text>
              <View style={styles.dateContainer}>
                <View style={styles.datePickerContainer}>
                  <DropDownPicker
                    open={openStartMonth}
                    value={startMonth}
                    items={MONTHS.map(month => ({ label: month, value: month }))}
                    setOpen={setOpenStartMonth}
                    setValue={setStartMonth}
                    placeholder="Month"
                    style={styles.datePicker}
                    dropDownContainerStyle={styles.datePickerDropdown}
                    zIndex={3000}
                  />
                </View>
                <View style={styles.datePickerContainer}>
                  <DropDownPicker
                    open={openStartYear}
                    value={startYear}
                    items={YEARS}
                    setOpen={setOpenStartYear}
                    setValue={setStartYear}
                    placeholder="Year"
                    style={styles.datePicker}
                    dropDownContainerStyle={styles.datePickerDropdown}
                    zIndex={2000}
                  />
                </View>
              </View>
              {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={handleNextPress}
        />
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
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.sm,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  experienceInputs: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  yearInput: {
    flex: 1,
  },
  monthInput: {
    flex: 1,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    marginBottom: theme.spacing.sm,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  noticePeriodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  salaryInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    width: '100%',
  },
  currencySymbol: {
    fontSize: theme.typography.fontSize.lg,
    marginRight: theme.spacing.xs,
    color: theme.colors.neutral.darkGrey,
  },
  salaryNote: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.md,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  datePickerContainer: {
    flex: 1,
  },
  datePicker: {
    borderColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
  },
  datePickerDropdown: {
    borderColor: theme.colors.neutral.lightGrey,
  },
  dropdown: {
    borderColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
  },
  dropdownList: {
    borderColor: theme.colors.neutral.lightGrey,
  },
  errorText: {
    color: theme.colors.accent.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: -theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  buttonContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.neutral.white,
  },
});

export default Experience;
