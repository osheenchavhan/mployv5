import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './src/contexts/UserContext';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme/theme';

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

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: theme.colors.neutral.background,
  },
  container: {
    flex: 1,
  },
});
