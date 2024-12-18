/**
 * Why this file exists:
 * Creating new accounts needs to be secure yet simple. This screen helps:
 * 1. Register new users:
 *    - Choose user type (job seeker or employer)
 *    - Provide basic information
 *    - Set up secure credentials
 *    - Validate user input
 * 
 * 2. Ensure data quality:
 *    - Validate email format
 *    - Enforce password requirements
 *    - Prevent duplicate accounts
 *    - Handle registration errors
 * 
 * Think of it as your account creation gateway that:
 * - Makes joining the platform easy
 * - Ensures user data is valid
 * - Guides users to the right experience
 * - Protects user security
 * 
 * Without this screen:
 * - Users couldn't join the platform
 * - Data quality would be poor
 * - User types would be mixed up
 * - Security would be compromised
 * 
 * @fileoverview Handles user registration and account creation
 * @package mployv5/screens/auth
 * @lastModified 2024-12-10
 * 
 * @example
 * // Basic usage in navigation
 * navigation.navigate('Register');
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Container from '../../components/common/Container';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { theme } from '../../theme/theme';
import { registerUser } from '../../services/firebase/auth';

/**
 * @function UserTypeButton
 * @description Button component for selecting user type (job seeker or employer)
 * @param {Object} props - Component props
 * @param {string} props.title - Button text
 * @param {boolean} props.selected - Whether this type is selected
 * @param {Function} props.onPress - Click handler
 * @returns {JSX.Element} User type selection button
 * @example
 * <UserTypeButton
 *   title="Job Seeker"
 *   selected={userType === 'jobseeker'}
 *   onPress={() => setUserType('jobseeker')}
 * />
 */
const UserTypeButton = ({ title, selected, onPress }) => (
  <Button
    title={title}
    variant={selected ? 'primary' : 'outline'}
    onPress={onPress}
    style={styles.userTypeButton}
  />
);

/**
 * @function Register
 * @description Main registration screen component
 * @returns {JSX.Element} Registration form UI
 * @example
 * // Using in a navigation stack
 * <Stack.Screen
 *   name="Register"
 *   component={Register}
 *   options={{ headerShown: false }}
 * />
 */
const Register = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    userType: null,
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * @function validateForm
   * @description Validates registration form data
   * @returns {boolean} Whether the form is valid
   * @example
   * if (validateForm()) {
   *   // Proceed with registration
   * }
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.userType) {
      newErrors.userType = 'Please select user type';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * @function handleRegister
   * @description Handles user registration process
   * @returns {Promise<void>}
   * @throws {Error} When registration fails
   * @example
   * // Called when register button is pressed
   * await handleRegister();
   */
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = {
        userType: formData.userType,
        email: formData.email,
        onboardingComplete: false,
      };

      await registerUser(formData.email, formData.password, userData);
      // Navigation will be handled by AppNavigator based on auth state
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
      setErrors({
        ...errors,
        general: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Mploy today</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>I am a</Text>
            <View style={styles.userTypeContainer}>
              <UserTypeButton
                title="Job Seeker"
                selected={formData.userType === 'jobseeker'}
                onPress={() => setFormData({ ...formData, userType: 'jobseeker' })}
              />
              <UserTypeButton
                title="Employer"
                selected={formData.userType === 'employer'}
                onPress={() => setFormData({ ...formData, userType: 'employer' })}
              />
            </View>
            {errors.userType && (
              <Text style={styles.errorText}>{errors.userType}</Text>
            )}

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={errors.email}
              touched={true}
              required
            />

            <Input
              label="Password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              placeholder="Create a password"
              secureTextEntry
              error={errors.password}
              touched={true}
              required
            />

            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
              touched={true}
              required
            />

            {errors.general && (
              <Text style={styles.errorText}>{errors.general}</Text>
            )}

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Button
              title="Login"
              variant="outline"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
            />
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
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
  },
  form: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral.darkGrey,
    marginBottom: theme.spacing.md,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  userTypeButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  errorText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent.error,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: theme.spacing.lg,
  },
  footer: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  footerText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.sm,
  },
  loginButton: {
    width: '100%',
  },
});

export default Register;
