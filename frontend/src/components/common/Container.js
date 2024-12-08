import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../../theme/theme';

const Container = ({
  children,
  style,
  withScrollView = false,
  backgroundColor = theme.colors.neutral.background,
}) => {
  const content = (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor }, style]}
    >
      {children}
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
});

export default Container;
