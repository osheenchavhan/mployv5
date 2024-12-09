import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import { theme } from '../../../theme/theme';
import { useEmployerOnboarding } from '../../../context/EmployerOnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';

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

const Location = ({ navigation }) => {
  const { formData, updateFormData, getProgress } = useEmployerOnboarding();
  const [selectedPolicy, setSelectedPolicy] = useState(formData.locationPreferences?.remoteWorkPolicy || null);
  const [address, setAddress] = useState(formData.locationPreferences?.primaryLocation?.address || '');

  const handlePolicySelect = (policy) => {
    setSelectedPolicy(policy);
    updateFormData('locationPreferences', 'remoteWorkPolicy', policy);
  };

  const handleAddressChange = (text) => {
    setAddress(text);
    updateFormData('locationPreferences', 'primaryLocation', {
      address: text,
      coordinates: null 
    });
  };

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
  inputContainer: {
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: theme.spacing.lg,
    paddingLeft: 40,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkGrey,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
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
    borderRadius: 16,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
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
