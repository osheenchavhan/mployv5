import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';

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
        backgroundColor: 'transparent',
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

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mdButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  lgButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  text: {
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.medium,
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
    opacity: 0.6,
  },
});

export default Button;
