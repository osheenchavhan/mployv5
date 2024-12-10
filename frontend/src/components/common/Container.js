/**
 * @fileoverview Container component that handles safe area, keyboard, and status bar
 * @package mployv5/components/common
 * @lastModified 2024-12-10
 */

import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../theme/theme';

/**
 * @component Container
 * @description A wrapper component that provides consistent layout handling for screens
 * Features:
 * - Safe area handling for notched devices
 * - Keyboard avoiding behavior
 * - Status bar configuration
 * - Consistent padding
 * - Background color management
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered inside the container
 * @param {Object} [props.style] - Additional styles for the container
 * @param {boolean} [props.withScrollView=false] - Whether to wrap content in ScrollView (currently unused)
 * @param {string} [props.backgroundColor=theme.colors.neutral.background] - Background color for the container
 * 
 * @example
 * // Basic usage
 * <Container>
 *   <Text>Screen content</Text>
 * </Container>
 * 
 * // With custom background color
 * <Container backgroundColor={theme.colors.primary.light}>
 *   <Text>Custom background</Text>
 * </Container>
 * 
 * // With additional styles
 * <Container style={{ paddingTop: theme.spacing.xl }}>
 *   <Text>Custom padding</Text>
 * </Container>
 */
const Container = ({
  children,
  style,
  withScrollView = false,
  backgroundColor = theme.colors.neutral.background,
}) => {
  const content = (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor }, style]}
    >
      {children}
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      {content}
    </SafeAreaView>
  );
};

/**
 * @constant styles
 * @description StyleSheet for the Container component
 * 
 * Styles include:
 * 1. Safe Area Container:
 *    - Fills entire screen with flex: 1
 *    - Handles device-specific safe areas
 * 
 * 2. Content Container:
 *    - Fills remaining space with flex: 1
 *    - Consistent padding from theme
 *    - Adapts to keyboard behavior
 * 
 * Note: Uses theme spacing for consistent layout across the app
 */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
});

export default Container;
