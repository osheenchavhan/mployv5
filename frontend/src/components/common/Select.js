/**
 * @fileoverview A customizable select/dropdown component with modal option picker
 * @package mployv5/components/common
 * @lastModified 2024-12-10
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  FlatList,
  SafeAreaView
} from 'react-native';
import { theme } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * @component Select
 * @description A modal-based select component for choosing from a list of options
 * Features:
 * - Bottom sheet modal with smooth animations
 * - Custom label and placeholder support
 * - Error state handling
 * - Visual feedback for selected option
 * - Safe area aware for notched devices
 * - Customizable styling
 * 
 * @param {Object} props - Component props
 * @param {string} [props.label] - Label text above select
 * @param {any} props.value - Currently selected value
 * @param {Array<{value: any, label: string}>} props.options - Array of selectable options
 * @param {string} [props.placeholder='Select an option'] - Placeholder text when no option selected
 * @param {Function} props.onChange - Callback when selection changes (receives selected value)
 * @param {string} [props.error] - Error message to display
 * @param {Object} [props.style] - Additional styles for container
 * 
 * @example
 * // Basic select with options
 * const options = [
 *   { value: '1', label: 'Option 1' },
 *   { value: '2', label: 'Option 2' }
 * ];
 * 
 * <Select
 *   label="Choose an option"
 *   options={options}
 *   value={selectedValue}
 *   onChange={handleChange}
 * />
 * 
 * // Select with error state
 * <Select
 *   label="Required field"
 *   options={options}
 *   value={value}
 *   onChange={handleChange}
 *   error="This field is required"
 *   placeholder="Please select an option"
 * />
 */
const Select = ({ 
  label,
  value,
  options,
  placeholder = 'Select an option',
  onChange,
  error,
  style
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedOption = options.find(option => option.value === value);

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item.value === value && styles.selectedOption
      ]}
      onPress={() => {
        onChange(item.value);
        setModalVisible(false);
      }}
    >
      <Text style={[
        styles.optionText,
        item.value === value && styles.selectedOptionText
      ]}>
        {item.label}
      </Text>
      {item.value === value && (
        <Icon name="check" size={20} color={theme.colors.primary.main} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.selectButton,
          error && styles.errorBorder
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[
          styles.selectButtonText,
          !selectedOption && styles.placeholder
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Icon 
          name="keyboard-arrow-down" 
          size={24} 
          color={theme.colors.neutral.darkGrey} 
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        animationType="slide"
        //transparent={true}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={24} color={theme.colors.neutral.black} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={item => item.value}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.optionsList}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

/**
 * @constant styles
 * @description StyleSheet for the Select component
 * 
 * Style Categories:
 * 1. Select Button:
 *    - Consistent border and padding
 *    - Flexible layout for label and icon
 *    - Error state styling
 * 
 * 2. Modal Design:
 *    - Bottom sheet animation
 *    - Semi-transparent backdrop
 *    - Rounded corners for modal
 *    - Safe area handling
 * 
 * 3. Option List:
 *    - Clear visual hierarchy
 *    - Selected state indicator
 *    - Proper spacing and separators
 * 
 * 4. Typography:
 *    - Consistent text styles
 *    - Theme-based colors
 *    - Proper emphasis for selected items
 * 
 * Note: All measurements and colors follow theme guidelines
 */
const styles = StyleSheet.create({
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral.black,
    marginBottom: theme.spacing.xs,
  },
  selectButton: {
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
  selectButtonText: {
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.neutral.background,
    marginTop: 'auto',
    borderTopLeftRadius: theme.borderRadius['2xl'],
    borderTopRightRadius: theme.borderRadius['2xl'],
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.lightGrey,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral.black,
  },
  optionsList: {
    padding: theme.spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.lightGrey,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary.light,
  },
  optionText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.neutral.black,
  },
  selectedOptionText: {
    color: theme.colors.primary.main,
    fontFamily: theme.typography.fontFamily.medium,
  },
});

export default Select;
