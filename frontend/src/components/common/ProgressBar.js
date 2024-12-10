/**
 * @fileoverview Simple progress bar component for visual feedback
 * @package mployv5/components/common
 * @lastModified 2024-12-10
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

/**
 * @component ProgressBar
 * @description A visual progress indicator component
 * Features:
 * - Smooth progress visualization
 * - Automatic progress bounds (0-100%)
 * - Customizable appearance
 * - Theme-consistent styling
 * 
 * @param {Object} props - Component props
 * @param {number} props.progress - Progress value (0-100)
 * @param {Object} [props.style] - Additional styles for the container
 * 
 * @example
 * // Basic usage
 * <ProgressBar progress={50} />
 * 
 * // Custom styling
 * <ProgressBar
 *   progress={75}
 *   style={{ height: 8, marginVertical: theme.spacing.md }}
 * />
 * 
 * // Dynamic progress
 * const [progress, setProgress] = useState(0);
 * <ProgressBar progress={progress} />
 * 
 * Note: Progress value is automatically clamped between 0 and 100
 */
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

/**
 * @constant styles
 * @description StyleSheet for the ProgressBar component
 * 
 * Styles include:
 * 1. Container:
 *    - Full width layout
 *    - Consistent height
 *    - Background color for empty state
 *    - Rounded corners
 *    - Overflow handling for progress bar
 * 
 * 2. Progress Bar:
 *    - Dynamic width based on progress
 *    - Theme-based primary color
 *    - Matching border radius
 * 
 * Note: Uses theme colors and border radius for consistent styling
 */
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
