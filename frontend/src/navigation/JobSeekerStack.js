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

const Stack = createStackNavigator();

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
