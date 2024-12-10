/**
 * Why this file exists:
 * When a job seeker uses the app, they need to:
 * 1. Complete their profile step by step when first joining
 * 2. Browse and swipe through job listings
 * 3. View their matches and job details
 * 4. Update their profile later
 * 
 * This file organizes all these screens and makes sure:
 * - New users complete their profile in the right order
 * - Users can't skip important profile steps
 * - Users can easily move between main app features
 * 
 * Think of it as a guided tour that:
 * - Shows new users exactly what they need to fill out first
 * - Then gives them free access to explore jobs and matches
 * - Lets them come back to update their profile anytime
 * 
 * @fileoverview Manages all screens and navigation for job seeker users
 * @package mployv5/navigation
 * @lastModified 2024-12-10
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SwipeJobs from '../screens/jobseeker/SwipeJobs';
import Matches from '../screens/jobseeker/Matches';
import JobDetail from '../screens/jobseeker/JobDetail';
import Profile from '../screens/jobseeker/Profile';
import BasicInfo from '../screens/jobseeker/onboarding/BasicInfo';
import Location from '../screens/jobseeker/onboarding/Location';
import Education from '../screens/jobseeker/onboarding/Education';
import Experience from '../screens/jobseeker/onboarding/Experience';
import Salary from '../screens/jobseeker/onboarding/Salary';
import { OnboardingProvider, useOnboarding } from '../context/OnboardingContext';

/**
 * @constant Stack
 * @description Stack navigator instance for job seeker flow
 */
const Stack = createStackNavigator();

/**
 * @component JobSeekerStack
 * @description Navigation stack for job seeker user flow, including onboarding and main app screens
 * Features:
 * - Sequential onboarding flow
 * - Main app navigation
 * - Header management
 * - Gesture control
 * 
 * Navigation Structure:
 * 1. Onboarding Flow:
 *    - Basic Info: Personal details
 *    - Location: Geographic preferences
 *    - Education: Academic background
 *    - Experience: Work history
 *    - Salary: Compensation expectations
 * 
 * 2. Main App Screens:
 *    - SwipeJobs: Job discovery interface
 *    - Matches: Matched job listings
 *    - JobDetail: Detailed job view
 *    - Profile: User profile management
 * 
 * Configuration:
 * - Headers hidden by default
 * - Gesture navigation disabled for onboarding
 * - Wrapped in OnboardingProvider for state management
 * 
 * @example
 * // Navigation between screens
 * navigation.navigate('SwipeJobs');
 * navigation.navigate('JobDetail', { jobId: '123' });
 * 
 * // Access onboarding context
 * const { currentStep } = useOnboarding();
 * if (currentStep === 'BasicInfo') {
 *   // Show onboarding progress
 * }
 */
const JobSeekerStack = () => {
  return (
    <OnboardingProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Onboarding Screens */}
        <Stack.Screen 
          name="BasicInfo" 
          component={BasicInfo}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="Location" 
          component={Location}
        />
        <Stack.Screen 
          name="Education" 
          component={Education}
        />
        <Stack.Screen 
          name="Experience" 
          component={Experience}
        />
        <Stack.Screen 
          name="Salary" 
          component={Salary}
        />
        
        {/* Main App Screens */}
        <Stack.Screen name="SwipeJobs" component={SwipeJobs} />
        <Stack.Screen name="Matches" component={Matches} />
        <Stack.Screen name="JobDetail" component={JobDetail} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </OnboardingProvider>
  );
};

export default JobSeekerStack;
