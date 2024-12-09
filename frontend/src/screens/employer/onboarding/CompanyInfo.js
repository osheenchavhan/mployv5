import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import DropDownPicker from 'react-native-dropdown-picker';
import { theme } from '../../../theme/theme';
import { useEmployerOnboarding } from '../../../context/EmployerOnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';
import * as ImagePicker from 'expo-image-picker';

const companySizes = [
  { label: '1-10 employees', value: '1-10' },
  { label: '11-50 employees', value: '11-50' },
  { label: '51-200 employees', value: '51-200' },
  { label: '201-500 employees', value: '201-500' },
  { label: '500+ employees', value: '500+' }
];

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

const CompanyInfo = ({ navigation }) => {
  const { formData, updateFormData, getProgress } = useEmployerOnboarding();
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSpecializationsOpen, setIsSpecializationsOpen] = useState(false);
  const isDirectEmployer = formData.employerType.type === 'direct';

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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

          <Input
            label="Description"
            value={formData.companyInfo.description}
            onChangeText={(value) => updateFormData('companyInfo', 'description', value)}
            error={errors.description}
            placeholder={isDirectEmployer 
              ? 'Brief description of your company' 
              : 'Brief description of your agency'}
            multiline
            numberOfLines={4}
          />

          <View style={styles.dropdownContainer}>
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
              dropDownContainerStyle={styles.dropdownList}
              placeholder="Select size"
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
              <Input
                label="Industry"
                value={formData.companyInfo.primaryIndustry}
                onChangeText={(value) => updateFormData('companyInfo', 'primaryIndustry', value)}
                error={errors.primaryIndustry}
                placeholder="e.g., Technology, Healthcare, Finance"
              />
              
              <Input
                label="Company Email Domain (Optional)"
                value={formData.companyInfo.emailDomain}
                onChangeText={(value) => updateFormData('companyInfo', 'emailDomain', value)}
                placeholder="e.g., company.com"
                keyboardType="email-address"
              />
            </>
          ) : (
            <>
              <View style={styles.dropdownContainer}>
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
                  dropDownContainerStyle={styles.dropdownList}
                  placeholder="Select specializations"
                  multiple={true}
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

        <Button 
          title={isDirectEmployer ? "Next" : "Finish"}
          onPress={handleNext}
          style={styles.button}
        />
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
  },
  button: {
    marginVertical: theme.spacing.xl,
  },
  dropdownContainer: {
    marginBottom: theme.spacing.md,
  },
  dropdownLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkGrey,
    marginBottom: theme.spacing.xs,
  },
  dropdown: {
    borderColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
  },
  dropdownList: {
    borderColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
  },
  errorText: {
    color: theme.colors.accent.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
});

export default CompanyInfo;
