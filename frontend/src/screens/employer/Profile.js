/**
 * Why this screen exists:
 * Your company profile is your hiring storefront. This screen helps:
 * 1. Manage your company presence:
 *    - Update company details
 *    - Refresh company photos
 *    - Edit company description
 *    - Update contact information
 * 
 * 2. Showcase your workplace:
 *    - Highlight company culture
 *    - Share employee benefits
 *    - Display office locations
 *    - Feature team photos
 * 
 * Think of it as your company's dating profile that:
 * - Shows why people should work for you
 * - Keeps your company info current
 * - Helps attract better candidates
 * - Builds your employer brand
 * 
 * Without this screen:
 * - Company information would get outdated
 * - Candidates wouldn't know your culture
 * - Your company would be harder to find
 * - You'd miss chances to attract talent
 * 
 * @fileoverview Manages employer profile information and company presentation
 * @package mployv5/screens/employer
 * @lastModified 2024-12-10
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Container from '../../components/common/Container';
import { theme } from '../../theme/theme';

/**
 * @function Profile
 * @description Main component for managing and displaying company profile information
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object for screen navigation
 * @returns {JSX.Element} Company profile screen UI
 */
const Profile = ({ navigation }) => {
  /**
   * @function handleBack
   * @description Handles navigation back to previous screen
   * @returns {void}
   */
  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  // Clean up when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Clean up any subscriptions/listeners if needed
      };
    }, [])
  );

  return (
    <Container>
      <View style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary.main} />
            </TouchableOpacity>
            <Text style={styles.title}>Company Profile</Text>
          </View>
          {/* TODO: Implement company profile view and edit functionality */}
        </ScrollView>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
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
});

export default Profile;
