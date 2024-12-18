/**
 * @fileoverview JobSeeker Education Onboarding Screen
 * 
 * This screen is part of the job seeker onboarding flow, collecting detailed
 * educational background information. It supports multiple education entries
 * and various education levels, with dynamic form validation and a user-friendly
 * interface.
 * 
 * Key Features:
 * - Multiple education level support (10th to Post Graduate)
 * - Dynamic form fields based on education level
 * - Multiple education entries for post-graduates
 * - Real-time form validation
 * - Progress tracking
 * - Searchable institution selection
 * 
 * Form Fields for Each Education Entry:
 * - Education Level (required)
 * - Currently Pursuing Status
 * - Degree (required)
 * - Specialization (required)
 * - Institution (required, searchable)
 * - Completion Date (required)
 *   - Month (dropdown)
 *   - Year (numeric input)
 * 
 * Data Sources:
 * - Degrees and specializations from degrees.json
 * - Institutions from institutions.json
 * 
 * User Experience:
 * The screen uses a card-based layout for multiple education entries,
 * with intuitive dropdowns and input fields. Post-graduate users can
 * add up to two education entries. The interface includes clear error
 * messages and real-time validation.
 * 
 * @example
 * // To navigate to the Education screen
 * navigation.navigate('Education');
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { theme } from '../../../theme/theme';
import { useOnboarding } from '../../../context/OnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialIcons } from '@expo/vector-icons';
import educationData from '../../../data/education/degrees.json';
import institutionsData from '../../../data/education/institutions.json';

/**
 * Available education levels for selection
 * @constant
 * @type {Array<string>}
 */
const EDUCATION_LEVELS = [
  '10th or Below 10th',
  '12th Pass',
  'Diploma',
  'ITI',
  'Graduate',
  'Post Graduate'
];

/**
 * Months for completion date selection
 * @constant
 * @type {Array<string>}
 */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Education screen component for job seeker onboarding
 * 
 * Manages the collection and validation of educational background information.
 * Supports multiple education entries for post-graduates and various education
 * levels with corresponding degree and specialization options.
 * 
 * State Management:
 * - educationList: Array of education entries
 * - educationLevel: Selected highest education level
 * - errors: Validation error messages
 * - openStates: Dropdown open/close states
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.navigation - Navigation object for screen transitions
 * @example
 * return (
 *   <EducationScreen navigation={navigation} />
 * )
 */
const EducationScreen = ({ navigation }) => {
  const { formData, updateFormData } = useOnboarding();
  
  /**
   * State for managing education entries
   * @type {Array<Object>}
   * @property {boolean} isCurrentlyPursuing - Whether the education is ongoing
   * @property {string} degree - Selected degree
   * @property {string} specialization - Selected specialization
   * @property {string} institution - Selected institution
   * @property {Object} completionDate - Completion date info
   * @property {string} completionDate.month - Completion month
   * @property {number} completionDate.year - Completion year
   */
  const [educationList, setEducationList] = useState(
    formData.education?.list || [{
      isCurrentlyPursuing: false,
      degree: null,
      specialization: null,
      institution: '',
      completionDate: {
        month: '',
        year: null
      }
    }]
  );
  
  /**
   * State for managing the highest education level
   * @type {string}
   */
  const [educationLevel, setEducationLevel] = useState(formData.education?.level || '');
  
  /**
   * State for managing validation errors
   * @type {Object}
   */
  const [errors, setErrors] = useState({});

  /**
   * State for managing dropdown open/close states
   * Each education entry has its own set of dropdown states
   * @type {Array<Object>}
   */
  const [openStates, setOpenStates] = useState(
    educationList.map(() => ({
      degree: false,
      specialization: false,
      institution: false,
      month: false,
    }))
  );

  /**
   * Handles the open/close state of dropdowns
   * Ensures only one dropdown is open at a time to prevent overlapping
   * 
   * @function
   * @param {number} index - Index of the education entry
   * @param {string} field - Field name (degree, specialization, institution, month)
   * @param {boolean} value - New open state
   */
  const handleOpenStateChange = (index, field, value) => {
    const newOpenStates = openStates.map((state, i) => {
      if (i === index) {
        return { ...state, [field]: value };
      }
      // Close other dropdowns to prevent overlapping
      return { ...state, degree: false, specialization: false, institution: false, month: false };
    });
    setOpenStates(newOpenStates);
  };

  /**
   * Adds a new education entry for post-graduate users
   * Only allows up to 2 education entries for post-graduates
   * 
   * @function
   * @example
   * // Add a new education entry
   * addEducation();
   */
  const addEducation = () => {
    if (educationLevel === 'Post Graduate' && educationList.length < 2) {
      setEducationList([...educationList, {
        isCurrentlyPursuing: false,
        degree: null,
        specialization: null,
        institution: '',
        completionDate: {
          month: '',
          year: null
        }
      }]);
      setOpenStates([...openStates, { degree: false, specialization: false, institution: false, month: false }]);
    }
  };

  /**
   * Removes an education entry
   * Prevents removing the last entry to ensure at least one education record
   * 
   * @function
   * @param {number} index - Index of the education entry to remove
   */
  const removeEducation = (index) => {
    if (educationList.length > 1) {
      const newList = educationList.filter((_, i) => i !== index);
      setEducationList(newList);
      const newOpenStates = openStates.filter((_, i) => i !== index);
      setOpenStates(newOpenStates);
    }
  };

  /**
   * Updates a specific field in an education entry
   * Handles different field types and clears corresponding errors
   * 
   * @function
   * @param {number} index - Index of the education entry
   * @param {string} field - Field to update (degree, specialization, institution, completionDate)
   * @param {*} value - New value for the field
   */
  const handleEducationChange = (index, field, value) => {
    console.log('Updating education:', { index, field, value });
    const newList = [...educationList];
    if (field === 'degree' || field === 'specialization') {
      newList[index] = {
        ...newList[index],
        [field]: value
      };
    } else if (field === 'completionDate') {
      newList[index] = {
        ...newList[index],
        completionDate: value
      };
    } else {
      newList[index] = {
        ...newList[index],
        [field]: value
      };
    }
    console.log('Updated education list:', newList);
    setEducationList(newList);
    
    // Clear errors for the changed field
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }
  };

  /**
   * Validates all form fields
   * Checks for required fields and proper formats
   * 
   * Validation Rules:
   * - Education level must be selected
   * - Each education entry must have:
   *   - Degree
   *   - Specialization
   *   - Institution
   *   - Completion year
   * 
   * @function
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!educationLevel) {
      newErrors.educationLevel = 'Education level is required';
      isValid = false;
    }

    educationList.forEach((education, index) => {
      if (!education.degree) {
        newErrors[`${index}-degree`] = 'Degree is required';
        isValid = false;
      }
      if (!education.specialization) {
        newErrors[`${index}-specialization`] = 'Specialization is required';
        isValid = false;
      }
      if (!education.institution) {
        newErrors[`${index}-institution`] = 'Institution is required';
        isValid = false;
      }
      if (!education.completionDate.year) {
        newErrors[`${index}-year`] = 'Year is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handles form submission and navigation
   * Validates form and updates context data before proceeding
   * 
   * @function
   */
  const handleNext = () => {
    if (validateForm()) {
      updateFormData('education', {
        level: educationLevel,
        list: educationList
      });
      navigation.navigate('Experience');
    }
  };

  /**
   * Renders an education entry card
   * Includes all form fields and validation for a single education entry
   * 
   * @function
   * @param {Object} education - Education entry data
   * @param {number} index - Index of the education entry
   * @returns {React.ReactElement} Education card component
   */
  const renderEducationCard = (education, index) => (
    <View key={index} style={[styles.card, { zIndex: 3000 - (index * 10) }]}>
      <View style={[styles.cardHeader, { justifyContent: 'flex-end' }]}>
        {educationList.length > 1 && (
          <TouchableOpacity onPress={() => removeEducation(index)}>
            <MaterialIcons name="delete" size={24} color={theme.colors.accent.error} />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.inputGroup, { zIndex: 3 }]}>
        <Text style={styles.label}>Degree</Text>
        <DropDownPicker
          open={openStates[index].degree}
          value={education.degree}
          items={educationData.degrees.map(deg => ({
            label: deg.name,
            value: deg.name
          }))}
          setOpen={(value) => handleOpenStateChange(index, 'degree', value)}
          setValue={(callback) => {
            console.log('Degree setValue called with:', callback);
            const newList = [...educationList];
            if (typeof callback === 'function') {
              const newValue = callback(education.degree);
              console.log('New degree value (from function):', newValue);
              newList[index] = {
                ...newList[index],
                degree: newValue,
                specialization: null
              };
            } else {
              console.log('New degree value (direct):', callback);
              newList[index] = {
                ...newList[index],
                degree: callback,
                specialization: null
              };
            }
            setEducationList(newList);
          }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          placeholder="Select an option"
          listMode="SCROLLVIEW"
          zIndex={3}
        />
        {errors[`${index}-degree`] && (
          <Text style={styles.errorText}>{errors[`${index}-degree`]}</Text>
        )}
      </View>

      <View style={[styles.inputGroup, { marginTop: theme.spacing.lg, zIndex: 2 }]}>
        <Text style={styles.label}>Specialization</Text>
        <DropDownPicker
          open={openStates[index].specialization}
          value={education.specialization}
          items={education.degree
            ? (educationData.degrees.find(deg => deg.name === education.degree)?.specializations || [])
                .map(spec => ({
                  label: spec,
                  value: spec
                }))
            : []
          }
          setOpen={(value) => handleOpenStateChange(index, 'specialization', value)}
          setValue={(callback) => {
            if (typeof callback === 'function') {
              const newValue = callback(education.specialization);
              handleEducationChange(index, 'specialization', newValue);
            } else {
              handleEducationChange(index, 'specialization', callback);
            }
          }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          placeholder="Select an option"
          listMode="SCROLLVIEW"
          zIndex={2}
        />
        {errors[`${index}-specialization`] && (
          <Text style={styles.errorText}>{errors[`${index}-specialization`]}</Text>
        )}
      </View>

      <View style={[styles.inputGroup, { marginTop: theme.spacing.lg, zIndex: 1 }]}>
        <Text style={styles.label}>College Name</Text>
        <DropDownPicker
          open={openStates[index].institution}
          value={education.institution}
          items={institutionsData.institutions.map(inst => ({
            label: `${inst.name}, ${inst.city}`,
            value: inst.name
          }))}
          setOpen={(value) => handleOpenStateChange(index, 'institution', value)}
          setValue={(callback) => {
            const value = callback(education.institution);
            handleEducationChange(index, 'institution', value);
          }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          placeholder="Select your institution"
          searchable={true}
          listMode="SCROLLVIEW"
          zIndex={1}
        />
        {errors[`${index}-institution`] && (
          <Text style={styles.errorText}>{errors[`${index}-institution`]}</Text>
        )}
      </View>

      <View style={[styles.inputGroup, { marginTop: theme.spacing.lg }]}>
        <Text style={styles.label}>Completion Date (or expected)</Text>
        <View style={styles.dateContainer}>
          <View style={[styles.monthPicker, { zIndex: 0 }]}>
            <DropDownPicker
              open={openStates[index].month}
              value={education.completionDate.month}
              items={MONTHS.map(month => ({
                label: month,
                value: month
              }))}
              setOpen={(value) => handleOpenStateChange(index, 'month', value)}
              setValue={(callback) => {
                if (typeof callback === 'function') {
                  const newValue = callback(education.completionDate.month);
                  handleEducationChange(index, 'completionDate', {
                    ...education.completionDate,
                    month: newValue
                  });
                } else {
                  handleEducationChange(index, 'completionDate', {
                    ...education.completionDate,
                    month: callback
                  });
                }
              }}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownList}
              placeholder="Month"
              listMode="SCROLLVIEW"
              zIndex={0}
              dropDownDirection="BOTTOM"
            />
          </View>
          <View style={styles.yearInput}>
            <Input
              value={education.completionDate.year}
              onChangeText={(value) => {
                handleEducationChange(index, 'completionDate', {
                  ...education.completionDate,
                  year: value
                });
              }}
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
        </View>
        {(errors[`${index}-month`] || errors[`${index}-year`]) && (
          <Text style={styles.errorText}>
            {errors[`${index}-month`] || errors[`${index}-year`]}
          </Text>
        )}
      </View>
    </View>
  );

  /**
   * Renders the currently pursuing section
   * Allows users to indicate if they are currently studying
   * 
   * @function
   * @returns {React.ReactElement} Currently pursuing section
   */
  const renderCurrentlyPursuing = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Are you currently pursuing your education?</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            educationList[0].isCurrentlyPursuing && styles.toggleButtonSelected
          ]}
          onPress={() => handleEducationChange(0, 'isCurrentlyPursuing', true)}
        >
          <Text style={[
            styles.toggleButtonText,
            educationList[0].isCurrentlyPursuing && styles.toggleButtonTextSelected
          ]}>
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !educationList[0].isCurrentlyPursuing && styles.toggleButtonSelected
          ]}
          onPress={() => handleEducationChange(0, 'isCurrentlyPursuing', false)}
        >
          <Text style={[
            styles.toggleButtonText,
            !educationList[0].isCurrentlyPursuing && styles.toggleButtonTextSelected
          ]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Renders the education level selection section
   * Displays all available education levels as selectable pills
   * 
   * @function
   * @returns {React.ReactElement} Education levels section
   */
  const renderEducationLevels = () => (
    <View style={styles.educationLevelsContainer}>
      <Text style={styles.sectionTitle}>Select your highest education level</Text>
      <View style={styles.pillsContainer}>
        {EDUCATION_LEVELS.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.pill,
              educationLevel === level && styles.pillSelected
            ]}
            onPress={() => setEducationLevel(level)}
          >
            <Text style={[
              styles.pillText,
              educationLevel === level && styles.pillTextSelected
            ]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.educationLevel && (
        <Text style={styles.errorText}>{errors.educationLevel}</Text>
      )}
    </View>
  );

  return (
    <Container>
      <ProgressBar 
        progress={60}
        style={styles.progress}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Education</Text>
        <Text style={styles.subtitle}>Tell us about your education</Text>
        
        {renderCurrentlyPursuing()}
        {renderEducationLevels()}
        
        {educationList.map((education, index) => renderEducationCard(education, index))}
        
        {educationLevel === 'Post Graduate' && educationList.length < 2 && (
          <TouchableOpacity onPress={addEducation} style={styles.addButton}>
            <MaterialIcons name="add-circle" size={24} color={theme.colors.primary.main} />
            <Text style={styles.addButtonText}>Add Another Degree</Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonContainer}>
          <Button 
            title="Back"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.button}
          />
          <Button 
            title="Next"
            onPress={handleNext}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

/**
 * Styles for the Education screen
 * 
 * @constant
 * @type {Object}
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  progress: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkGrey,
    marginBottom: theme.spacing.md,
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
  educationLevelsContainer: {
    marginBottom: theme.spacing.xl,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  pill: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.neutral.lightGrey,
    backgroundColor: theme.colors.neutral.white,
  },
  pillSelected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  pillText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
  },
  pillTextSelected: {
    color: theme.colors.neutral.white,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent.error,
    marginTop: theme.spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  dropdownContainer: {
    zIndex: 1000,
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
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.xs,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  monthPicker: {
    flex: 1,
  },
  yearInput: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
    position: 'relative',
    overflow: 'visible'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  addButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    color: theme.colors.primary.main,
    marginLeft: theme.spacing.sm,
  },
});

export default EducationScreen;
