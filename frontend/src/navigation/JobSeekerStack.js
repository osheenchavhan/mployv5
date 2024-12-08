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

const OnboardingStack = () => {
  const { currentStep } = useOnboarding();
  
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="BasicInfo"
    >
      <Stack.Screen 
        name="BasicInfo" 
        component={BasicInfo}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen 
        name="Location" 
        component={Location}
        options={{ gestureEnabled: currentStep === 'Location' }}
      />
      <Stack.Screen 
        name="Education" 
        component={Education}
        options={{ gestureEnabled: currentStep === 'Education' }}
      />
      <Stack.Screen 
        name="Experience" 
        component={Experience}
        options={{ gestureEnabled: currentStep === 'Experience' }}
      />
      <Stack.Screen 
        name="Salary" 
        component={Salary}
        options={{ gestureEnabled: currentStep === 'Salary' }}
      />
    </Stack.Navigator>
  );
};

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SwipeJobs" component={SwipeJobs} />
    <Stack.Screen name="Matches" component={Matches} />
    <Stack.Screen name="JobDetail" component={JobDetail} />
    <Stack.Screen name="Profile" component={Profile} />
  </Stack.Navigator>
);

const JobSeekerStack = () => {
  // TODO: Replace with actual onboarding check from AsyncStorage/API
  const isOnboardingComplete = false;

  return (
    <OnboardingProvider>
      {!isOnboardingComplete ? <OnboardingStack /> : <MainStack />}
    </OnboardingProvider>
  );
};

export default JobSeekerStack;
