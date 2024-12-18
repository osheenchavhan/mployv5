/**
 * @fileoverview Bottom tab navigation for job seeker main screens
 * Implements the main navigation interface for job seekers with three tabs:
 * Profile, Home (Jobs), and Applications
 * 
 * @package mployv5/navigation
 * @lastModified 2024-12-18
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SwipeJobs from '../screens/jobseeker/SwipeJobs';
import Matches from '../screens/jobseeker/Matches';
import Profile from '../screens/jobseeker/Profile';
import { theme } from '../theme/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused, label }) => {
  return (
    <View style={{ alignItems: 'center', paddingTop: 10 }}>
      <Ionicons
        name={name}
        size={24}
        color={focused ? theme.colors.primary.main : theme.colors.neutral.grey}
      />
      <Text
        style={{
          marginTop: 4,
          fontSize: 12,
          fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
          }),
          color: focused ? theme.colors.primary.main : theme.colors.neutral.grey,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const JobSeekerTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          backgroundColor: theme.colors.neutral.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.neutral.lightGrey,
          paddingBottom: insets.bottom,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person-outline" focused={focused} label="Profile" />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={SwipeJobs}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" focused={focused} label="Home" />
          ),
        }}
      />
      <Tab.Screen
        name="Applications"
        component={Matches}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="briefcase-outline" focused={focused} label="Applications" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default JobSeekerTabs;
