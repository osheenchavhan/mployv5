/**
 * @fileoverview Reusable Input component with validation and secure text entry support
 * @package mployv5/components/common
 * @lastModified 2024-12-10
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { theme } from '../../theme/theme';

/**
 * @component Input
 * @description A versatile input component with built-in validation and secure text entry
 * Features:
 * - Label with optional required indicator
 * - Error state handling with validation
 * - Secure text entry with toggle visibility
 * - Platform-specific shadows
 * - Customizable styles
 * 
 * @param {Object} props - Component props
 * @param {string} [props.label] - Label text above the input
 * @param {string} [props.value] - Current input value
 * @param {Function} props.onChangeText - Callback when text changes
 * @param {string} [props.placeholder] - Placeholder text when empty
 * @param {boolean} [props.secureTextEntry] - Whether to hide input text (for passwords)
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.touched] - Whether the input has been interacted with
 * @param {string} [props.keyboardType='default'] - Keyboard type to display
 * @param {string} [props.autoCapitalize='none'] - Auto-capitalization behavior
 * @param {Object} [props.style] - Additional styles for container
 * @param {Object} [props.labelStyle] - Additional styles for label
 * @param {boolean} [props.required=false] - Whether to show required indicator
 * 
 * @example
 * // Basic text input
 * <Input
 *   label="Username"
 *   value={username}
 *   onChangeText={setUsername}
 *   placeholder="Enter username"
 * />
 * 
 * // Password input with validation
 * <Input
 *   label="Password"
 *   value={password}
 *   onChangeText={setPassword}
 *   secureTextEntry
 *   error={passwordError}
 *   touched={passwordTouched}
 *   required
 * />
 * 
 * // Email input with validation
 * <Input
 *   label="Email"
 *   value={email}
 *   onChangeText={setEmail}
 *   keyboardType="email-address"
 *   error={emailError}
 *   touched={emailTouched}
 * />
 */
const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  touched,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  labelStyle,
  required = false,
}) => {
  const [isSecureTextVisible, setIsSecureTextVisible] = useState(false);

  const toggleSecureText = () => {
    setIsSecureTextVisible(!isSecureTextVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[
        styles.inputContainer,
        touched && error && styles.errorInput,
      ]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.neutral.grey}
          secureTextEntry={secureTextEntry && !isSecureTextVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={styles.input}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={toggleSecureText} style={styles.eyeIcon}>
            <Text>{isSecureTextVisible ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {touched && error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

/**
 * @constant styles
 * @description StyleSheet for the Input component
 * 
 * Styles include:
 * 1. Container Layout:
 *    - Proper spacing between inputs
 *    - Flexible container structure
 * 
 * 2. Label Styling:
 *    - Consistent typography from theme
 *    - Required indicator styling
 *    - Proper spacing for visual hierarchy
 * 
 * 3. Input Field:
 *    - Platform-specific shadows
 *    - Border styling for different states
 *    - Proper height and padding
 *    - Flex layout for text and icon
 * 
 * 4. Error Handling:
 *    - Error border color
 *    - Error message styling
 * 
 * 5. Secure Text Entry:
 *    - Eye icon positioning
 *    - Touch target sizing
 * 
 * Note: Uses theme for consistent styling across the app
 */
const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral.black,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.accent.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.white,
    height: theme.spacing['3xl'],
    ...Platform.select({
      ios: theme.shadows.sm,
      android: {
        elevation: theme.shadows.sm.elevation,
      },
    }),
    paddingHorizontal: theme.spacing.lg,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkGrey,
    height: '100%',
  },
  eyeIcon: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  errorInput: {
    borderColor: theme.colors.accent.error,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent.error,
    marginTop: theme.spacing.xs,
  },
});

export default Input;
