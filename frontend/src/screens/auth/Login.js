/**
 * Why this file exists:
 * Accessing your account should be secure and seamless. This screen helps:
 * 1. Authenticate users:
 *    - Verify credentials
 *    - Protect account access
 *    - Handle login errors
 *    - Manage login state
 * 
 * 2. Guide user experience:
 *    - Direct to correct user flow
 *    - Provide password recovery
 *    - Enable account creation
 *    - Handle platform differences
 * 
 * Think of it as your secure entrance that:
 * - Keeps accounts protected
 * - Makes access convenient
 * - Guides users to help
 * - Maintains session state
 * 
 * Without this screen:
 * - Users couldn't access accounts
 * - Security would be compromised
 * - Recovery would be impossible
 * - User flows would be broken
 * 
 * @fileoverview Handles user authentication and login
 * @package mployv5/screens/auth
 * @lastModified 2024-12-10
 * 
 * @example
 * // Basic usage in navigation
 * navigation.navigate('Login');
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { theme } from '../../theme/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../../services/firebase/auth';
import { Alert } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';

/**
 * @function Login
 * @description Main login screen component
 * @returns {JSX.Element} Login form UI
 * @example
 * // Using in a navigation stack
 * <Stack.Screen
 *   name="Login"
 *   component={Login}
 *   options={{ headerShown: false }}
 * />
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  /**
   * @function handleLogin
   * @description Handles user login process
   * @returns {Promise<void>}
   * @throws {Error} When login fails
   * @example
   * // Called when login button is pressed
   * await handleLogin();
   */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    console.log('Attempting login...');
    setLoading(true);
    try {
      console.log('Calling loginUser with:', email);
      const user = await loginUser(email, password);
      console.log('Login successful:', user);
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      // Check user type and navigate to appropriate stack
      if (userData.userType === 'jobseeker') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'JobSeekerStack' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'EmployerStack' }],
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'Please check your email and password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Welcome to Mploy</Text>
            
            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                touched={true}
                required
                containerStyle={styles.inputContainer}
              />

              <View style={styles.passwordContainer}>
                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                  touched={true}
                  required
                  containerStyle={styles.inputContainer}
                />
              </View>

              <Button
                title="Login"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
                textStyle={styles.loginButtonText}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Button
                  title="Create Account"
                  variant="text"
                  onPress={() => navigation.navigate('Register')}
                  style={styles.createAccountButton}
                  textStyle={styles.createAccountButtonText}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing['5xl'],
    paddingBottom: theme.spacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing['3xl'],
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  passwordContainer: {
    marginBottom: theme.spacing.md,
  },
  loginButton: {
    width: '100%',
    marginBottom: theme.spacing['4xl'],
  },
  loginButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: theme.spacing['2xl'],
  },
  footerText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkGrey,
  },
  createAccountButton: {
    marginLeft: theme.spacing.xs,
  },
  createAccountButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default Login;
