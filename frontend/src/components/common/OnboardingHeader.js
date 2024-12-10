/**
 * @fileoverview Header component for onboarding screens with navigation
 * @package mployv5/components/common
 * @lastModified 2024-12-10
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * @component OnboardingHeader
 * @description A header component specifically designed for onboarding screens
 * Features:
 * - Optional back button with navigation
 * - Large title text
 * - Consistent spacing and typography
 * - Enhanced touch targets for better UX
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Title text to display in the header
 * @param {boolean} [props.showBack=true] - Whether to show the back button
 * 
 * @example
 * // Basic usage with back button
 * <OnboardingHeader
 *   title="Create Account"
 * />
 * 
 * // Without back button (first screen)
 * <OnboardingHeader
 *   title="Welcome"
 *   showBack={false}
 * />
 * 
 * Note: This component automatically handles navigation using React Navigation's
 * useNavigation hook. No need to pass navigation prop manually.
 */
const OnboardingHeader = ({ title, showBack = true }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          hitSlop={{ 
            top: theme.spacing.sm, 
            bottom: theme.spacing.sm, 
            left: theme.spacing.sm, 
            right: theme.spacing.sm 
          }}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.neutral.black} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

/**
 * @constant styles
 * @description StyleSheet for the OnboardingHeader component
 * 
 * Styles include:
 * 1. Container Layout:
 *    - Flex row layout for back button and title
 *    - Consistent padding from theme
 *    - Proper alignment of elements
 * 
 * 2. Back Button:
 *    - Proper spacing from title
 *    - Enhanced hit slop for better touch target
 *    - Consistent icon sizing
 * 
 * 3. Title Typography:
 *    - Large font size for emphasis
 *    - Medium font weight for readability
 *    - Theme-consistent colors
 * 
 * Note: All measurements and styles follow theme guidelines
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral.black,
  },
});

export default OnboardingHeader;
