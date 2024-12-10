/**
 * @fileoverview Reusable Button component for the Mploy application
 * @package mployv5/components/common
 * @lastModified 2024-12-10
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { theme } from '../../theme/theme';

/**
 * @component Button
 * @description A customizable button component that supports different variants, sizes, and states
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onPress - Callback function triggered when button is pressed
 * @param {string} props.title - Text to display inside the button
 * @param {('primary'|'secondary'|'outline')} [props.variant='primary'] - Visual style variant of the button
 *    - primary: Filled button with primary color
 *    - secondary: Filled button with secondary color
 *    - outline: Outlined button with transparent background
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Size variant of the button
 *    - sm: Small button (height: 3xl spacing)
 *    - md: Medium button (height: 3xl spacing)
 *    - lg: Large button (height: 4xl spacing)
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.loading=false] - Whether to show loading spinner
 * @param {Object} [props.style] - Additional styles for the button container
 * @param {Object} [props.textStyle] - Additional styles for the button text
 * 
 * @example
 * // Primary button
 * <Button 
 *   onPress={() => console.log('pressed')}
 *   title="Submit"
 * />
 * 
 * // Disabled secondary button
 * <Button 
 *   variant="secondary"
 *   disabled={true}
 *   title="Cannot Click"
 * />
 * 
 * // Loading outline button
 * <Button 
 *   variant="outline"
 *   loading={true}
 *   title="Loading..."
 * />
 */
const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    const baseStyle = [styles.button, styles[`${size}Button`]];
    
    if (variant === 'primary') {
      baseStyle.push({
        backgroundColor: disabled ? theme.colors.neutral.grey : theme.colors.primary.main,
      });
    } else if (variant === 'secondary') {
      baseStyle.push({
        backgroundColor: disabled ? theme.colors.neutral.grey : theme.colors.secondary.main,
      });
    } else if (variant === 'outline') {
      baseStyle.push({
        backgroundColor: theme.colors.neutral.transparent,
        borderWidth: 1,
        borderColor: theme.colors.primary.main,
      });
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyles = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];

    if (variant === 'outline') {
      baseStyle.push({
        color: disabled ? theme.colors.neutral.grey : theme.colors.primary.main,
      });
    } else {
      baseStyle.push({
        color: theme.colors.neutral.white,
      });
    }

    if (textStyle) {
      baseStyle.push(textStyle);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyles()}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.neutral.white} />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * @constant styles
 * @description StyleSheet for the Button component
 * 
 * Styles are organized into categories:
 * 1. Base Styles:
 *    - button: Common styles for all buttons
 *    - text: Common text styles
 * 
 * 2. Size Variants:
 *    - smButton: Small button dimensions
 *    - mdButton: Medium button dimensions
 *    - lgButton: Large button dimensions
 *    - smText: Small text size
 *    - mdText: Medium text size
 *    - lgText: Large text size
 * 
 * 3. State Styles:
 *    - disabled: Styles applied to disabled state
 * 
 * Note: All measurements use the theme's spacing and typography system
 */
const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.regular,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto'
    }),
  },
  smButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    height: theme.spacing['3xl'],
  },
  mdButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    height: theme.spacing['3xl'],
  },
  lgButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    height: theme.spacing['4xl'],
  },
  smText: {
    fontSize: theme.typography.fontSize.sm,
  },
  mdText: {
    fontSize: theme.typography.fontSize.md,
  },
  lgText: {
    fontSize: theme.typography.fontSize.lg,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
