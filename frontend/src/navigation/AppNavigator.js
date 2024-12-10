/**
 * Why this file exists:
 * This is like the traffic controller of the app. It decides:
 * 1. Whether to show the login screen or the main app
 * 2. Which type of main screen to show (job seeker or employer)
 * 3. How to handle back buttons and screen transitions
 * 
 * Without this file:
 * - Users would stay on the login screen even after logging in
 * - Job seekers might see employer screens and vice versa
 * - The app wouldn’t know how to move between screens safely
 * 
 * Think of it as a smart receptionist who:
 * - Checks if you have an access card (logged in)
 * - Directs you to the right area (job seeker or employer section)
 * - Makes sure you can’t enter restricted areas
 * 
 * @fileoverview Controls which screens users can see based on their login status and type
 * @package mployv5/navigation
 * @lastModified 2024-12-10
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUser } from '../context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobSeekerStack from './JobSeekerStack';
import EmployerStack from './EmployerStack';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import { EmployerOnboardingProvider } from '../context/EmployerOnboardingContext';

/**
 * @constant Stack
 * @description Stack navigator instance for managing app-wide navigation
 */
const Stack = createStackNavigator();

/**
 * @component AppNavigator
 * @description Root navigation component that manages authentication flow and user type routing
 * Features:
 * - Authentication-based navigation
 * - User type-specific routing
 * - Safe area handling
 * - Gesture and animation control
 * 
 * Navigation Structure:
 * 1. Unauthenticated Flow:
 *    - Login Screen
 *    - Registration Screen
 * 
 * 2. Authenticated Flow:
 *    Job Seeker:
 *    - JobSeekerStack (Profile, Search, Applications)
 *    
 *    Employer:
 *    - EmployerStack (Dashboard, Job Posts, Candidates)
 * 
 * Configuration:
 * - Header hidden by default
 * - White background for all screens
 * - Animations disabled for performance
 * - Gesture navigation disabled for flow control
 * - Safe area insets applied for notched devices
 * 
 * @example
 * // In App.js
 * import { NavigationContainer } from '@react-navigation/native';
 * 
 * function App() {
 *   return (
 *     <NavigationContainer>
 *       <AppNavigator />
 *     </NavigationContainer>
 *   );
 * }
 */
const AppNavigator = () => {
  const { user } = useUser();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['right', 'bottom', 'left']}>
      <EmployerOnboardingProvider>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: 'white' },
            animationEnabled: false // Temporarily disable animations
          }}
        >
          {!user ? (
            // Auth Stack
            <>
              <Stack.Screen 
                name="Login" 
                component={Login}
                options={{ gestureEnabled: false }}
              />
              <Stack.Screen 
                name="Register" 
                component={Register}
                options={{ gestureEnabled: false }}
              />
            </>
          ) : (
            // App Stacks based on user type
            user.userType === 'jobseeker' ? (
              <Stack.Screen 
                name="JobSeekerStack" 
                component={JobSeekerStack}
                options={{ gestureEnabled: false }}
              />
            ) : (
              <Stack.Screen 
                name="EmployerStack" 
                component={EmployerStack}
                options={{ gestureEnabled: false }}
              />
            )
          )}
        </Stack.Navigator>
      </EmployerOnboardingProvider>
    </SafeAreaView>
  );
};

export default AppNavigator;
