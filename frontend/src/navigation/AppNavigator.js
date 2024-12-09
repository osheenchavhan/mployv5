import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUser } from '../contexts/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobSeekerStack from './JobSeekerStack';
import EmployerStack from './EmployerStack';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import { EmployerOnboardingProvider } from '../context/EmployerOnboardingContext';

const Stack = createStackNavigator();

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
