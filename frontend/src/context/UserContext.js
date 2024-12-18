/**
 * Why this file exists:
 * This is like a central storage for user information that any part of the app can access.
 * When users log in or sign up, we need to:
 * 1. Check if they're allowed to use the app (authentication)
 * 2. Know who they are (job seeker or employer)
 * 3. Show their personal information in different screens
 * 
 * Without this file, every screen would need to:
 * - Ask the user to log in again
 * - Make separate calls to get user information
 * - Not know if the user is logged in or not
 * 
 * Think of it as a secure ID card that proves who you are and carries your basic information,
 * which you can show whenever any part of the app needs to know who you are.
 * 
 * @fileoverview Manages user login state and information across the app
 * @package mployv5/context
 * @lastModified 2024-12-10
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';

/**
 * @context UserContext
 * @description Context for managing authentication state and user data
 */
const UserContext = createContext();

/**
 * @component UserProvider
 * @description Provider component that manages authentication and user state
 * Features:
 * - Firebase authentication state synchronization
 * - Automatic Firestore user data fetching
 * - Loading state management
 * - User data caching
 * 
 * State Management:
 * 1. Authentication: Tracks Firebase auth state
 * 2. User Data: Merges Firebase auth and Firestore user data
 * 3. Loading: Handles initial auth state resolution
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * 
 * @example
 * // Wrap your app with the provider
 * <UserProvider>
 *   <App />
 * </UserProvider>
 * 
 * // Access user data in a child component
 * const { user, loading } = useUser();
 * if (loading) return <LoadingSpinner />;
 * if (!user) return <LoginScreen />;
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = async (firebaseUser) => {
    try {
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      console.log('Fetched user data from Firestore:', userDoc.data());
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check profile completion status
        const isJobSeeker = userData.userType === 'jobseeker';
        console.log('User type:', userData.userType);
        console.log('Checking fields:', {
          basicInfo: userData.basicInfo,
          education: userData.education,
          experience: userData.experience,
          location: userData.location,
          salary: userData.salary,
          onboardingComplete: userData.onboardingComplete
        });

        const profileComplete = isJobSeeker
          ? Boolean(
              userData.basicInfo &&
              userData.location &&
              userData.education &&
              userData.experience &&
              userData.salary &&
              userData.onboardingComplete
            )
          : Boolean(userData.companyInfo);

        console.log('Profile completion status:', profileComplete);
        
        const updatedUser = {
          ...firebaseUser,
          ...userData,
          profileComplete,
          setUser // Add setUser function to user object
        };
        
        setUser(updatedUser);
        return updatedUser;
      } else {
        console.log('No user document found in Firestore');
        setUser(firebaseUser);
        return firebaseUser;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(firebaseUser);
      return firebaseUser;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await updateUser(firebaseUser);
      } else {
        console.log('No Firebase user');
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    setUser: async (newUserData) => {
      if (newUserData && newUserData.uid) {
        await updateUser(newUserData);
      } else {
        setUser(newUserData);
      }
    },
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

/**
 * @hook useUser
 * @description Custom hook to access user context
 * @returns {Object} User context object containing:
 *   - user: Current user object (null if not authenticated)
 *   - loading: Boolean indicating if initial auth state is being resolved
 *   - setUser: Function to update user state (use with caution)
 * 
 * @throws {Error} If used outside of UserProvider
 * 
 * @example
 * const { user, loading } = useUser();
 * 
 * // Access user data
 * console.log(user?.email);
 * console.log(user?.displayName);
 * 
 * // Check authentication state
 * if (!user) {
 *   return <Navigate to="/login" />;
 * }
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
