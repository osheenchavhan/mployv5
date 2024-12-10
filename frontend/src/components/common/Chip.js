/**
 * @fileoverview Chip component for displaying tags, filters, and status indicators
 * @package mployv5/components/common
 * @lastModified 2024-12-10
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * @component Chip
 * @description A versatile chip component that can be used for tags, filters, choices, and status indicators
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Text to display inside the chip
 * @param {('display'|'choice'|'removable'|'status')} [props.variant='display'] - Type of chip to render
 *    - display: Static chip for information display only
 *    - choice: Selectable chip that toggles selection state
 *    - removable: Chip that can be removed (shows close icon when selected)
 *    - status: Chip used to show status with custom background color
 * @param {string} [props.color] - Custom background color (only used with status variant)
 * @param {boolean} [props.selected=false] - Whether the chip is in selected state
 * @param {Function} [props.onPress] - Callback when chip is pressed (for choice/removable variants)
 * @param {Function} [props.onRemove] - Callback when remove icon is pressed (for removable variant)
 * @param {Object} [props.style] - Additional styles for the chip container
 * 
 * @example
 * // Display chip
 * <Chip 
 *   label="React Native"
 *   variant="display"
 * />
 * 
 * // Selectable choice chip
 * <Chip 
 *   label="Filter Option"
 *   variant="choice"
 *   selected={isSelected}
 *   onPress={() => setSelected(!isSelected)}
 * />
 * 
 * // Removable chip
 * <Chip 
 *   label="Selected Item"
 *   variant="removable"
 *   selected={true}
 *   onRemove={() => handleRemove()}
 * />
 * 
 * // Status chip
 * <Chip 
 *   label="Active"
 *   variant="status"
 *   color={theme.colors.success.main}
 * />
 */
const Chip = ({ 
  label, 
  variant = 'display', // 'choice', 'removable', 'display', 'status'
  color,
  selected = false,
  onPress,
  onRemove,
  style,
}) => {
  const getBackgroundColor = () => {
    if (variant === 'status') return color || theme.colors.primary.light;
    if ((variant === 'choice' || variant === 'removable') && selected) return theme.colors.primary.main;
    return theme.colors.neutral.lightGrey;
  };

  const getTextColor = () => {
    if (variant === 'status') return theme.colors.neutral.black;
    if ((variant === 'choice' || variant === 'removable') && selected) return theme.colors.neutral.white;
    return theme.colors.neutral.darkGrey;
  };

  const content = (
    <>
      <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
      {variant === 'removable' && selected && (
        <TouchableOpacity 
          onPress={onRemove}
          hitSlop={{ 
            top: theme.spacing.xs, 
            bottom: theme.spacing.xs, 
            left: theme.spacing.xs, 
            right: theme.spacing.xs 
          }}
        >
          <Icon 
            name="close" 
            size={14} 
            color={theme.colors.neutral.white}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </>
  );

  if (variant === 'choice' || variant === 'removable') {
    return (
      <TouchableOpacity 
        style={[
          styles.container, 
          { backgroundColor: getBackgroundColor() },
          style
        ]}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: getBackgroundColor() },
        style
      ]}
    >
      {content}
    </View>
  );
};

/**
 * @constant styles
 * @description StyleSheet for the Chip component
 * 
 * Styles include:
 * 1. Container Layout:
 *    - Flexbox row layout for label and icon alignment
 *    - Consistent padding and margin using theme spacing
 *    - Rounded corners using theme border radius
 *    - Border styling for visual definition
 * 
 * 2. Typography:
 *    - Small font size for compact appearance
 *    - Consistent font family from theme
 *    - Calculated line height for proper text alignment
 * 
 * 3. Icon Styling:
 *    - Small margin for spacing from label
 *    - Size optimized for chip height
 * 
 * Note: All measurements and colors are derived from the theme for consistency
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
  },
  icon: {
    marginLeft: theme.spacing.xxs,
  },
});

export default Chip;
