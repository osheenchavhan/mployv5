/**
 * Why this screen exists:
 * Employers need control over their account. This screen helps:
 * 1. Manage account preferences:
 *    - Notification settings
 *    - Privacy controls
 *    - Communication preferences
 *    - Display options
 * 
 * 2. Handle account administration:
 *    - Subscription management
 *    - Team member access
 *    - Security settings
 *    - Data management
 * 
 * Think of it as your account control panel that:
 * - Keeps your preferences organized
 * - Protects your information
 * - Manages who can access what
 * - Controls how you use the platform
 * 
 * Without this screen:
 * - You couldn't customize your experience
 * - Account security would be harder
 * - Team collaboration would be limited
 * - Managing notifications would be chaotic
 * 
 * @fileoverview Controls employer account settings and preferences
 * @package mployv5/screens/employer
 * @lastModified 2024-12-10
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../../components/common/Container';
import { theme } from '../../theme/theme';

/**
 * @function Settings
 * @description Main component for managing employer account settings and preferences
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object for screen navigation
 * @returns {JSX.Element} Settings screen UI
 */
const Settings = ({ navigation }) => {
  /**
   * @function handleLogout
   * @description Handles user logout by resetting navigation stack to Login screen
   * @returns {void}
   */
  const handleLogout = () => {
    // Reset navigation stack to Login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary.main} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color={theme.colors.accent.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.md,
  },
  logoutText: {
    marginLeft: theme.spacing.md,
    color: theme.colors.accent.error,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default Settings;
