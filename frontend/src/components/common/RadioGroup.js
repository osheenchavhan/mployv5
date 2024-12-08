import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

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

const styles = StyleSheet.create({
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.neutral.black,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary.main,
  },
  optionLabel: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.neutral.black,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default RadioGroup;
