/**
 * @fileoverview Job Seeker SwipeJobs Screen
 * 
 * This screen implements the core job discovery experience for job seekers, featuring
 * a Tinder-like card swiping interface. Users can quickly browse through job postings
 * by swiping right to express interest or left to pass on opportunities that don't
 * match their preferences.
 * 
 * Key Features:
 * - Card-based job presentation
 * - Swipe gestures for job interaction
 * - Quick job preview with essential details
 * - One-tap application process
 * - Job recommendations based on user preferences
 * - Session management (logout functionality)
 * 
 * User Experience:
 * The screen presents one job at a time in a card format, with smooth animations
 * for swipe interactions. Each card displays key job information (title, company,
 * salary, location) with the ability to tap for more details. The interface is
 * designed to be intuitive and efficient, allowing users to make quick decisions
 * while maintaining engagement through the gamification of job searching.
 * 
 * @example
 * // To navigate to the SwipeJobs screen
 * navigation.navigate('SwipeJobs');
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import { theme } from '../../theme/theme';
import { auth } from '../../services/firebase/config';

/**
 * SwipeJobs screen component
 * 
 * Main screen for job discovery where users can swipe through job cards
 * to express interest or pass on job opportunities.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.navigation - Navigation object for screen transitions
 * @example
 * return (
 *   <SwipeJobs navigation={navigation} />
 * )
 */
const SwipeJobs = ({ navigation }) => {
  /**
   * Handles user logout process
   * 
   * Signs out the user from Firebase authentication and redirects
   * to the Login screen.
   * 
   * @async
   * @function
   * @throws {Error} If logout fails
   */
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Jobs</Text>
          <Button
            title="Logout"
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
        <Text style={styles.subtitle}>Swipe right to apply, left to pass</Text>
        {/* TODO: Implement job card swiping functionality */}
      </View>
    </Container>
  );
};

/**
 * Styles for the SwipeJobs component
 * 
 * @constant
 * @type {Object}
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
  },
  logoutButton: {
    minWidth: 100,
  },
});

export default SwipeJobs;
