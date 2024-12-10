/**
 * Why this file exists:
 * Employers need different screens than job seekers. This file helps:
 * 1. Guide new employers through their initial setup:
 *    - Choose their type (direct employer or agency)
 *    - Add company information
 *    - Set office locations
 *    - Verify their business
 * 
 * 2. Once set up, employers need to:
 *    - Post and manage job listings
 *    - View and swipe through candidate profiles
 *    - Check their matches with candidates
 *    - Update company profile and settings
 * 
 * Think of it as a business control panel that:
 * - First helps you set up your company profile properly
 * - Then gives you all the tools to manage jobs and find candidates
 * - Keeps everything organized and easy to find
 * 
 * Without this file:
 * - Employers wouldn't know what information they need to provide
 * - They might try to post jobs before verifying their business
 * - They'd have trouble finding their different management screens
 * 
 * @fileoverview Organizes all employer-specific screens and their setup flow
 * @package mployv5/navigation
 * @lastModified 2024-12-10
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SwipeCandidates from '../screens/employer/SwipeCandidates';
import Matches from '../screens/employer/Matches';
import JobPosts from '../screens/employer/JobPosts';
import Profile from '../screens/employer/Profile';
import Settings from '../screens/employer/Settings';
import EmployerType from '../screens/employer/onboarding/EmployerType';
import CompanyInfo from '../screens/employer/onboarding/CompanyInfo';
import Location from '../screens/employer/onboarding/Location';
import Verification from '../screens/employer/onboarding/Verification';
import Dashboard from '../screens/employer/Dashboard';
import Login from '../screens/auth/Login';
import PostJob from '../screens/employer/jobs/PostJob';
import { JobPostingProvider } from '../context/JobPostingContext';

const Stack = createStackNavigator();

const EmployerStack = () => {
  return (
    <JobPostingProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{ gestureEnabled: false }}
        />

        {/* Onboarding Screens */}
        <Stack.Screen 
          name="EmployerType" 
          component={EmployerType}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="CompanyInfo" 
          component={CompanyInfo}
        />
        <Stack.Screen 
          name="Location" 
          component={Location}
        />
        <Stack.Screen 
          name="Verification" 
          component={Verification}
        />

        {/* Main App Screens */}
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="SwipeCandidates" component={SwipeCandidates} />
        <Stack.Screen name="Matches" component={Matches} />
        <Stack.Screen name="JobPosts" component={JobPosts} />
        <Stack.Screen name="PostJob" component={PostJob} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </JobPostingProvider>
  );
};

export default EmployerStack;
