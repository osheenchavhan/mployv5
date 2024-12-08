import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../theme/theme';

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
  required = false,
}) => {
  const [isSecureTextVisible, setIsSecureTextVisible] = useState(false);

  const toggleSecureText = () => {
    setIsSecureTextVisible(!isSecureTextVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
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

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.darkGrey,
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
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.black,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  eyeIcon: {
    padding: theme.spacing.sm,
  },
  errorInput: {
    borderColor: theme.colors.accent.error,
  },
  errorText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent.error,
    marginTop: theme.spacing.xs,
  },
});

export default Input;
