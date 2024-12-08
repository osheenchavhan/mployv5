import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Chip = ({ 
  label, 
  variant = 'display', // 'interactive', 'display', 'status'
  color,
  selected = false,
  onPress,
  onRemove,
  style,
}) => {
  const getBackgroundColor = () => {
    if (variant === 'status') return color || theme.colors.primary.light;
    if (variant === 'interactive' && selected) return theme.colors.primary.light;
    return theme.colors.neutral.lightGrey;
  };

  const getTextColor = () => {
    if (variant === 'status') return theme.colors.neutral.black;
    if (variant === 'interactive' && selected) return theme.colors.primary.main;
    return theme.colors.neutral.darkGrey;
  };

  const content = (
    <>
      <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
      {variant === 'interactive' && selected && (
        <TouchableOpacity 
          onPress={onRemove}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon 
            name="close" 
            size={16} 
            color={theme.colors.primary.main} 
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </>
  );

  if (variant === 'interactive') {
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: 16,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
  },
  icon: {
    marginLeft: theme.spacing.xs,
  },
});

export default Chip;
