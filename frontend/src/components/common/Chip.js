import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: 12,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    lineHeight: 18,
  },
  icon: {
    marginLeft: 4,
  },
});

export default Chip;
