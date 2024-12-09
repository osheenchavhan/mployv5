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

const radiusOptions = [5, 10, 15, 20, 25]; // in kilometers

const LocationScreen = ({ navigation }) => {
  const { formData, updateFormData } = useOnboarding();
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10); // default 10km
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

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

  // Check location services status periodically
  useEffect(() => {
    const locationCheckInterval = setInterval(async () => {
      const enabled = await checkLocationServices();
      if (enabled && !location) {
        setupLocation();
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(locationCheckInterval);
  }, [location]);

  useEffect(() => {
    setupLocation();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (searchRadius) {
      updateFormData('searchRadius', searchRadius);
    }
  }, [searchRadius]);

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

  const handleBack = () => {
    navigation.goBack();
  };

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

  return (
    <Container>
      <ProgressBar 
        progress={0.4}
        style={styles.progress}
      />
      
      <View style={styles.container}>
        <Text style={styles.title}>Location</Text>
        <Text style={styles.subtitle}>Set your job search area</Text>
        
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
            maximumTrackTintColor={theme.colors.neutral.grey}
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
