/**
 * @fileoverview Root component of the Mploy mobile application
 * @package mployv5
 * @lastModified 2024-12-10
 */

import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme/theme';

/**
 * @constant navigationTheme
 * @description Default theme configuration for React Navigation
 * Defines colors for various navigation elements to maintain consistent UI
 */
const navigationTheme = {
  dark: false,
  colors: {
    primary: theme.colors.primary.main,
    background: theme.colors.neutral.background,
    card: theme.colors.neutral.background,
    text: theme.colors.neutral.black,
    border: theme.colors.neutral.lightGrey,
    notification: theme.colors.accent.error,
  },
};

/**
 * @function App
 * @description Root component that sets up the core application structure
 * Includes:
 * - Gesture handling setup for touch interactions
 * - Status bar configuration
 * - Safe area handling for different device notches
 * - User context provider for global state
 * - Navigation container with theme
 * @returns {React.Component} The root application component
 */
export default function App() {
  return (
    <GestureHandlerRootView style={styles.rootView}>
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={theme.colors.neutral.background} />
        <SafeAreaProvider>
          <UserProvider>
            <NavigationContainer theme={navigationTheme}>
              <AppNavigator />
            </NavigationContainer>
          </UserProvider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
}

/**
 * @constant styles
 * @description StyleSheet for the root application layout
 * Contains styles for:
 * - rootView: Main container with background color
 * - container: Flexible container for application content
 */
const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: theme.colors.neutral.background,
  },
  container: {
    flex: 1,
  },
});
