/**
 * @component LocationScreen
 * @description A location-based component that allows job seekers to set their job search area.
 * This screen is part of the onboarding flow and handles location services, permissions,
 * and search radius configuration. It uses Google Maps for visualization and Expo Location
 * for device location services.
 * 
 * Key Features:
 * - Real-time location tracking
 * - Interactive map with search radius visualization
 * - Configurable search radius with slider
 * - Location services status monitoring
 * - Graceful error handling for location permissions
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Alert, Linking } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import { theme } from '../../../theme/theme';
import { useOnboarding } from '../../../context/OnboardingContext';
import ProgressBar from '../../../components/common/ProgressBar';
import { GOOGLE_MAPS_API_KEY } from '@env';

/**
 * @constant {number[]} radiusOptions - Available search radius options in kilometers
 */
const radiusOptions = [5, 10, 15, 20, 25]; // in kilometers

/**
 * Location Screen Component
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation prop for screen navigation
 * @returns {JSX.Element} Location configuration screen
 */
const LocationScreen = ({ navigation }) => {
  const { formData, updateFormData } = useOnboarding();
  
  // State Management
  /**
   * @state {Object} errors - Validation and location service errors
   */
  const [errors, setErrors] = useState({});
  /**
   * @state {Object|null} location - Current user location coordinates
   */
  const [location, setLocation] = useState(null);
  /**
   * @state {number} searchRadius - Selected job search radius in kilometers
   */
  const [searchRadius, setSearchRadius] = useState(10); // default 10km
  /**
   * @state {Object|null} locationSubscription - Location watcher subscription
   */
  const [locationSubscription, setLocationSubscription] = useState(null);
  /**
   * @state {boolean} isLocationEnabled - Device location services status
   */
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

  /**
   * Checks if device location services are enabled
   * @async
   * @function checkLocationServices
   * @returns {Promise<boolean>} Location services status
   */
  const checkLocationServices = async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      setIsLocationEnabled(enabled);
      return enabled;
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  };

  /**
   * Opens device settings for location services configuration
   * @function openLocationSettings
   * @description Displays an alert dialog prompting user to enable location services
   */
  const openLocationSettings = () => {
    Alert.alert(
      "Location Services Disabled",
      "Please enable location services in your device settings to find jobs near you.",
      [
        {
          text: "Open Settings",
          onPress: () => Linking.openSettings()
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  /**
   * Sets up location tracking and permissions
   * @async
   * @function setupLocation
   * @description
   * 1. Verifies location services are enabled
   * 2. Requests location permissions
   * 3. Gets initial location (last known and current)
   * 4. Sets up location change subscription
   */
  const setupLocation = async () => {
    try {
      // Check if location services are enabled
      const enabled = await checkLocationServices();
      if (!enabled) {
        setErrors({
          location: 'Please enable location services to continue'
        });
        openLocationSettings();
        return;
      }

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrors({
          location: 'Location permission is required to find jobs near you'
        });
        return;
      }

      // Clear any previous errors
      setErrors({});

      // First get last known location for quick display
      const lastKnownLocation = await Location.getLastKnownPositionAsync({});
      if (lastKnownLocation) {
        const { latitude, longitude } = lastKnownLocation.coords;
        setLocation({ latitude, longitude });
        updateFormData('location', { latitude, longitude });
      }

      // Then get current location with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 10000, // Accept locations not older than 10 seconds
      });
      
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });
      updateFormData('location', { latitude, longitude });

      // Watch for location changes
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10, // Update if moved by 10 meters
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocation({ latitude, longitude });
          updateFormData('location', { latitude, longitude });
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Location error:', error);
      setErrors({
        location: 'Unable to access location. Please check your device settings.'
      });
    }
  };

  /**
   * Validates and handles navigation to next screen
   * @function handleNext
   * @description
   * - Validates location is available
   * - Prompts for location services if disabled
   * - Navigates to Education screen if valid
   */
  const handleNext = () => {
    const newErrors = {};
    if (!location) {
      newErrors.location = 'Please enable location services to continue';
      openLocationSettings();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigation.navigate('Education');
  };

  /**
   * Navigates back to previous screen
   * @function handleBack
   */
  const handleBack = () => {
    navigation.goBack();
  };

  /**
   * Renders location error message and settings button
   * @function renderLocationError
   * @returns {JSX.Element|null} Error message component or null
   */
  const renderLocationError = () => {
    if (!errors.location) return null;

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errors.location}</Text>
        <Button
          title="Open Settings"
          onPress={openLocationSettings}
          variant="outline"
          style={styles.settingsButton}
        />
      </View>
    );
  };

  // Effects

  /**
   * Location services monitoring effect
   * @effect
   * @description Periodically checks location services status
   */
  useEffect(() => {
    const locationCheckInterval = setInterval(async () => {
      const enabled = await checkLocationServices();
      if (enabled && !location) {
        setupLocation();
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(locationCheckInterval);
  }, [location]);

  /**
   * Location setup and cleanup effect
   * @effect
   * @description Initializes location tracking and cleans up subscription
   */
  useEffect(() => {
    setupLocation();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  /**
   * Search radius sync effect
   * @effect
   * @description Updates form data when search radius changes
   */
  useEffect(() => {
    if (searchRadius) {
      updateFormData('searchRadius', searchRadius);
    }
  }, [searchRadius]);

  return (
    <Container>
      <ProgressBar 
        progress={40}
        style={styles.progress}
      />
      
      <View style={styles.container}>
        <Text style={styles.title}>Location</Text>
        <Text style={styles.subtitle}>Set your job search area. We need this to show you jobs nearby.</Text>
        
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude || 37.7749, // Default to San Francisco
              longitude: location?.longitude || -122.4194,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            region={location ? {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            } : undefined}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            apiKey={GOOGLE_MAPS_API_KEY}
          >
            {location && (
              <>
                <Marker
                  coordinate={location}
                  title="Your Location"
                />
                <Circle
                  center={location}
                  radius={searchRadius * 1000} // Convert km to meters
                  fillColor="rgba(66, 133, 244, 0.2)"
                  strokeColor="rgba(66, 133, 244, 0.5)"
                  strokeWidth={2}
                />
              </>
            )}
          </MapView>
          {renderLocationError()}
        </View>

        <View style={styles.radiusContainer}>
          <Text style={styles.radiusLabel}>
            Search Radius: {searchRadius} km
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={4}
            step={1}
            value={radiusOptions.indexOf(searchRadius)}
            onValueChange={(value) => setSearchRadius(radiusOptions[value])}
            minimumTrackTintColor={theme.colors.primary.main}
            maximumTrackTintColor={theme.colors.neutral.lightGrey}
            thumbTintColor={theme.colors.primary.main}
          />
          <View style={styles.radiusMarkers}>
            {radiusOptions.map((value) => (
              <Text key={value} style={styles.radiusMarkerText}>{value}</Text>
            ))}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Back"
            variant="outline"
            onPress={handleBack}
            style={styles.button}
          />
          <Button 
            title="Next"
            onPress={handleNext}
            style={styles.button}
          />
        </View>
      </View>
    </Container>
  );
};

/**
 * Component Styles
 * @constant styles
 * @description Defines the styling for all components in the Location screen
 * Key sections:
 * - Progress bar positioning
 * - Container and map layout
 * - Typography for titles and labels
 * - Error message styling
 * - Radius slider and markers
 * - Button container layout
 */
const styles = StyleSheet.create({
  progress: {
    marginTop: Platform.OS === 'ios' ? 50 : 20,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.xl,
  },
  mapContainer: {
    height: 300,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent.error,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  settingsButton: {
    width: '80%',
    marginTop: theme.spacing.sm,
  },
  radiusContainer: {
    marginBottom: theme.spacing.xl,
  },
  radiusLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.black,
    marginBottom: theme.spacing.sm,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  radiusMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
  },
  radiusMarkerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});

export default LocationScreen;
