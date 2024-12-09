import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

const ProgressBar = ({ progress, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.progress, 
          { width: `${Math.min(Math.max(progress, 0), 100)}%` }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 4,
    backgroundColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.xxs,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.xxs,
  },
});

export default ProgressBar;
