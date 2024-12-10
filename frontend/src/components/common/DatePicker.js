/**
 * @fileoverview Date picker component with platform-specific implementations
 * @package mployv5/components/common
 * @lastModified 2024-12-10
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * @component DatePicker
 * @description A cross-platform date picker component that adapts to iOS and Android
 * Features:
 * - Platform-specific date picker UI (spinner for iOS, default for Android)
 * - Custom input field with calendar icon
 * - Error handling and validation
 * - Date range restrictions
 * - Formatted date display
 * 
 * @param {Object} props - Component props
 * @param {string} [props.label] - Label text above the date picker
 * @param {Date} [props.value] - Selected date value
 * @param {Function} props.onChange - Callback when date changes (receives Date object)
 * @param {string} [props.error] - Error message to display
 * @param {string} [props.placeholder='Select date'] - Placeholder text when no date is selected
 * @param {Date} [props.maximumDate=new Date()] - Maximum selectable date (defaults to current date)
 * @param {Date} [props.minimumDate=new Date(1900, 0, 1)] - Minimum selectable date
 * @param {Object} [props.style] - Additional styles for the container
 * 
 * @example
 * // Basic usage
 * const [date, setDate] = useState(null);
 * <DatePicker
 *   label="Birth Date"
 *   value={date}
 *   onChange={setDate}
 * />
 * 
 * // With validation
 * <DatePicker
 *   label="Event Date"
 *   value={eventDate}
 *   onChange={handleDateChange}
 *   error={dateError}
 *   minimumDate={new Date()}
 * />
 * 
 * // Custom date range
 * <DatePicker
 *   label="Historical Date"
 *   value={historicalDate}
 *   onChange={handleHistoricalDate}
 *   minimumDate={new Date(1950, 0, 1)}
 *   maximumDate={new Date(2000, 11, 31)}
 * />
 */
const DatePicker = ({ 
  label,
  value,
  onChange,
  error,
  placeholder = 'Select date',
  maximumDate = new Date(),
  minimumDate = new Date(1900, 0, 1),
  style
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.dateButton,
          error && styles.errorBorder
        ]}
        onPress={() => setShow(true)}
      >
        <Text style={[
          styles.dateText,
          !value && styles.placeholder
        ]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Icon 
          name="calendar-today" 
          size={20} 
          color={theme.colors.neutral.darkGrey} 
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

/**
 * @constant styles
 * @description StyleSheet for the DatePicker component
 * 
 * Styles include:
 * 1. Label Styling:
 *    - Consistent font size and family from theme
 *    - Proper spacing for visual hierarchy
 * 
 * 2. Date Button:
 *    - Flex layout for icon and text alignment
 *    - Border styling for input appearance
 *    - Platform-consistent touch target size
 * 
 * 3. Text Styles:
 *    - Different styles for selected date and placeholder
 *    - Theme-based typography
 * 
 * 4. Error Handling:
 *    - Error border color indication
 *    - Error message styling
 * 
 * Note: All measurements, colors, and typography follow theme guidelines
 */
const styles = StyleSheet.create({
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral.black,
    marginBottom: theme.spacing.xs,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.neutral.grey,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.neutral.background,
  },
  dateText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.neutral.black,
  },
  placeholder: {
    color: theme.colors.neutral.grey,
  },
  errorBorder: {
    borderColor: theme.colors.accent.error,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.accent.error,
    marginTop: theme.spacing.xs,
  },
});

export default DatePicker;
