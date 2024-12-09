import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Animated } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import { theme } from '../../../theme/theme';
import { useEmployerOnboarding } from '../../../context/EmployerOnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';
import { MaterialIcons } from '@expo/vector-icons';

const EmployerType = ({ navigation }) => {
  const { formData, updateFormData, getProgress, setCurrentStep } = useEmployerOnboarding();

  const handleTypeSelection = (value) => {
    updateFormData('employerType', 'type', value);
  };

  const handleNext = () => {
    if (formData.employerType.type) {
      setCurrentStep('CompanyInfo');
      navigation.navigate('CompanyInfo');
    }
  };

  const isSelected = (type) => formData.employerType.type === type;

  return (
    <Container>
      <ProgressBar progress={getProgress()} style={styles.progress} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Mploy!</Text>
        <Text style={styles.subtitle}>Let's start by understanding your role</Text>
        
        <View style={styles.boxesContainer}>
          <TouchableOpacity
            style={[styles.box, isSelected('direct') && styles.selectedBox]}
            onPress={() => handleTypeSelection('direct')}
            activeOpacity={0.9}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="business" size={40} color={theme.colors.primary.main} />
            </View>
            <Text style={[styles.boxTitle, isSelected('direct') && styles.selectedText]}>
              I'm hiring for my company
            </Text>
            <Text style={[styles.boxDescription, isSelected('direct') && styles.selectedDescription]}>
              You're looking to hire employees directly for your organization
            </Text>
            {isSelected('direct') && (
              <View style={styles.selectedIndicator}>
                <MaterialIcons name="check-circle" size={24} color={theme.colors.primary.main} />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.box, isSelected('agency') && styles.selectedBox]}
            onPress={() => handleTypeSelection('agency')}
            activeOpacity={0.9}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="people-alt" size={40} color={theme.colors.primary.main} />
            </View>
            <Text style={[styles.boxTitle, isSelected('agency') && styles.selectedText]}>
              I'm hiring for other companies
            </Text>
            <Text style={[styles.boxDescription, isSelected('agency') && styles.selectedDescription]}>
              You're a recruitment agency or hiring on behalf of other organizations
            </Text>
            {isSelected('agency') && (
              <View style={styles.selectedIndicator}>
                <MaterialIcons name="check-circle" size={24} color={theme.colors.primary.main} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Button
          title="Continue"
          onPress={handleNext}
          disabled={!formData.employerType.type}
          style={styles.button}
        />
      </View>
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
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  boxesContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    minHeight: 180,
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
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBox: {
    borderColor: theme.colors.primary.main,
    backgroundColor: `${theme.colors.primary.main}10`,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  iconContainer: {
    marginBottom: 16,
  },
  boxTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.neutral.dark,
  },
  selectedText: {
    color: theme.colors.primary.main,
  },
  boxDescription: {
    fontSize: 16,
    color: theme.colors.neutral.grey,
    lineHeight: 22,
  },
  selectedDescription: {
    color: theme.colors.primary.dark,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  button: {
    marginTop: theme.spacing.xl,
  },
});

export default EmployerType;
