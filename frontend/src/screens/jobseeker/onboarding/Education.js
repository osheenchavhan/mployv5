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

const EDUCATION_LEVELS = [
  '10th or Below 10th',
  '12th Pass',
  'Diploma',
  'ITI',
  'Graduate',
  'Post Graduate'
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const EducationScreen = ({ navigation }) => {
  const { formData, updateFormData } = useOnboarding();
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
  const [educationLevel, setEducationLevel] = useState(formData.education?.level || '');
  const [errors, setErrors] = useState({});

  // Dropdown states for each education card
  const [openStates, setOpenStates] = useState(
    educationList.map(() => ({
      degree: false,
      specialization: false,
      institution: false,
      month: false,
    }))
  );

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

  const removeEducation = (index) => {
    if (educationList.length > 1) {
      const newList = educationList.filter((_, i) => i !== index);
      setEducationList(newList);
      const newOpenStates = openStates.filter((_, i) => i !== index);
      setOpenStates(newOpenStates);
    }
  };

  const handleEducationChange = (index, field, value) => {
    const newList = [...educationList];
    newList[index] = {
      ...newList[index],
      [field]: value
    };
    setEducationList(newList);
    
    // Clear errors for the changed field
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }
  };

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

  const handleNext = () => {
    if (validateForm()) {
      updateFormData('education', {
        level: educationLevel,
        list: educationList
      });
      navigation.navigate('Experience');
    }
  };

  const renderEducationCard = (education, index) => (
    <View key={index} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Education {index + 1}</Text>
        {educationList.length > 1 && (
          <TouchableOpacity onPress={() => removeEducation(index)}>
            <MaterialIcons name="delete" size={24} color={theme.colors.accent.error} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Degree</Text>
        <DropDownPicker
          open={openStates[index].degree}
          value={education.degree}
          items={(educationLevel && educationData[educationLevel]?.degrees) 
            ? educationData[educationLevel].degrees.map(deg => ({
                label: deg.name,
                value: deg.name
              }))
            : []
          }
          setOpen={(value) => handleOpenStateChange(index, 'degree', value)}
          setValue={(callback) => {
            const value = callback(education.degree);
            handleEducationChange(index, 'degree', value);
            // Reset specialization when degree changes
            handleEducationChange(index, 'specialization', null);
          }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          placeholder="Select an option"
          listMode="SCROLLVIEW"
          zIndex={3000 - (index * 3)}
        />
        {errors[`${index}-degree`] && (
          <Text style={styles.errorText}>{errors[`${index}-degree`]}</Text>
        )}
      </View>

      <View style={[styles.inputGroup, { marginTop: theme.spacing.lg }]}>
        <Text style={styles.label}>Specialization</Text>
        <DropDownPicker
          open={openStates[index].specialization}
          value={education.specialization}
          items={(educationLevel && education.degree && educationData[educationLevel]?.degrees) 
            ? (educationData[educationLevel].degrees.find(deg => deg.name === education.degree)?.specializations || [])
                .map(spec => ({
                  label: spec,
                  value: spec
                }))
            : []
          }
          setOpen={(value) => handleOpenStateChange(index, 'specialization', value)}
          setValue={(callback) => {
            const value = callback(education.specialization);
            handleEducationChange(index, 'specialization', value);
          }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          placeholder="Select an option"
          listMode="SCROLLVIEW"
          zIndex={2000 - (index * 3)}
        />
        {errors[`${index}-specialization`] && (
          <Text style={styles.errorText}>{errors[`${index}-specialization`]}</Text>
        )}
      </View>

      <View style={[styles.inputGroup, { marginTop: theme.spacing.lg }]}>
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
          zIndex={1000 - (index * 3)}
        />
        {errors[`${index}-institution`] && (
          <Text style={styles.errorText}>{errors[`${index}-institution`]}</Text>
        )}
      </View>

      <View style={[styles.inputGroup, { marginTop: theme.spacing.lg }]}>
        <Text style={styles.label}>Completion Date (or expected)</Text>
        <View style={styles.dateContainer}>
          <View style={styles.monthPicker}>
            <DropDownPicker
              open={openStates[index].month}
              value={education.completionDate.month}
              items={MONTHS.map(month => ({
                label: month,
                value: month
              }))}
              setOpen={(value) => handleOpenStateChange(index, 'month', value)}
              setValue={(callback) => {
                const value = callback(education.completionDate.month);
                handleEducationChange(index, 'completionDate', {
                  ...education.completionDate,
                  month: value
                });
              }}
              style={[styles.dropdown, { flex: 1 }]}
              dropDownContainerStyle={styles.dropdownList}
              placeholder="Month"
              listMode="SCROLLVIEW"
              zIndex={500 - (index * 3)}
            />
          </View>
          <View style={styles.yearInput}>
            <Input
              value={education.completionDate.year ? education.completionDate.year.toString() : ''}
              onChangeText={(text) => {
                handleEducationChange(index, 'completionDate', {
                  ...education.completionDate,
                  year: text ? parseInt(text) : null
                });
              }}
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
              error={errors[`${index}-year`]}
            />
          </View>
        </View>
      </View>
    </View>
  );

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
        progress={0.6}
        style={styles.progress}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Education Details</Text>
        <Text style={styles.subtitle}>Tell us about your education</Text>
        
        {renderCurrentlyPursuing()}
        {renderEducationLevels()}
        
        {educationList.map((education, index) => renderEducationCard(education, index))}
        
        {educationLevel === 'Post Graduate' && educationList.length < 2 && (
          <TouchableOpacity onPress={addEducation} style={styles.addButton}>
            <MaterialIcons name="add-circle" size={24} color={theme.colors.primary.main} />
            <Text style={styles.addButtonText}>Add Another Education</Text>
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
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.black,
    marginBottom: theme.spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  toggleButton: {
    paddingVertical: theme.spacing.sm,
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
    fontSize: theme.typography.fontSize.md,
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
    paddingVertical: theme.spacing.sm,
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
    fontSize: theme.typography.fontSize.md,
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
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.black,
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
