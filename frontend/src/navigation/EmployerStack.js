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

const Stack = createStackNavigator();

const EmployerStack = () => {
  return (
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
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default EmployerStack;
