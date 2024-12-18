/**
 * @fileoverview Radio group component for single selection from multiple options
 * @package mployv5/components/common
 * @lastModified 2024-12-10
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

/**
 * @component RadioGroup
 * @description A flexible radio button group component for single selection
 * Features:
 * - Vertical or horizontal layout options
 * - Custom label support
 * - Error state handling
 * - Animated selection indicator
 * - Consistent theme-based styling
 * 
 * @param {Object} props - Component props
 * @param {string} [props.label] - Group label text
 * @param {Array<{value: any, label: string}>} props.options - Array of options to display
 * @param {any} props.value - Currently selected value
 * @param {Function} props.onChange - Callback when selection changes (receives selected value)
 * @param {string} [props.error] - Error message to display
 * @param {Object} [props.style] - Additional styles for container
 * @param {('vertical'|'horizontal')} [props.direction='vertical'] - Layout direction
 * 
 * @example
 * // Basic vertical radio group
 * const options = [
 *   { value: 'option1', label: 'Option 1' },
 *   { value: 'option2', label: 'Option 2' }
 * ];
 * 
 * <RadioGroup
 *   label="Select an option"
 *   options={options}
 *   value={selectedValue}
 *   onChange={handleChange}
 * />
 * 
 * // Horizontal layout with validation
 * <RadioGroup
 *   label="Choose one"
 *   options={options}
 *   value={value}
 *   onChange={handleChange}
 *   error={validationError}
 *   direction="horizontal"
 * />
 */
const RadioGroup = ({ 
  label,
  options,
  value,
  onChange,
  error,
  style,
  direction = 'vertical' // or 'horizontal'
}) => {
  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.optionsContainer,
        direction === 'horizontal' && styles.horizontalContainer
      ]}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              direction === 'horizontal' && styles.horizontalOption,
              index !== options.length - 1 && (
                direction === 'vertical' 
                  ? styles.optionMarginBottom 
                  : styles.optionMarginRight
              )
            ]}
            onPress={() => onChange(option.value)}
          >
            <View style={styles.radioOuter}>
              {value === option.value && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

/**
 * @constant styles
 * @description StyleSheet for the RadioGroup component
 * 
 * Styles include:
 * 1. Layout Management:
 *    - Flexible container layouts (vertical/horizontal)
 *    - Proper spacing between options
 *    - Alignment of radio buttons and labels
 * 
 * 2. Radio Button Design:
 *    - Outer circle with border
 *    - Inner circle for selection
 *    - Proper sizing and spacing
 * 
 * 3. Typography:
 *    - Consistent font sizes
 *    - Theme-based font families
 *    - Color management
 * 
 * 4. Error Handling:
 *    - Error message styling
 *    - Proper spacing for error display
 * 
 * Note: All measurements and colors follow theme guidelines
 */
const styles = StyleSheet.create({
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.xs,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  horizontalContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalOption: {
    marginRight: theme.spacing.lg,
  },
  optionMarginBottom: {
    marginBottom: theme.spacing.md,
  },
  optionMarginRight: {
    marginRight: theme.spacing.lg,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.main,
  },
  optionLabel: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.neutral.darkGrey,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.accent.error,
    marginTop: theme.spacing.xs,
  },
});

export default RadioGroup;
