/**
 * @fileoverview Expo configuration file for Mploy mobile application
 * @package mployv5
 * @lastModified 2024-12-10
 * @description 
 * This configuration file defines the core settings for the Expo-based mobile application.
 * It includes:
 * - Basic app information (name, version, etc.)
 * - Platform-specific configurations (iOS, Android)
 * - Asset configurations
 * - Plugin configurations
 * - API key integrations (Google Maps)
 */

module.exports = {
  expo: {
    /** @property {string} name - Display name of the application */
    name: "mployv5",
    /** @property {string} slug - Unique identifier for the app */
    slug: "mployv5",
    /** @property {string} version - Current app version */
    version: "1.0.0",
    /** @property {string} orientation - Forces portrait mode only */
    orientation: "portrait",
    /** @property {string} icon - Path to the app icon */
    icon: "./assets/icon.png",
    /** @property {string} userInterfaceStyle - Forces light mode UI */
    userInterfaceStyle: "light",
    /** @property {Object} splash - Splash screen configuration */
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    /** @property {Array} assetBundlePatterns - Patterns for bundling static assets */
    assetBundlePatterns: [
      "**/*"
    ],
    /** @property {Object} ios - iOS-specific configuration */
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mployv5",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      },
      deploymentTarget: "13.0"
    },
    /** @property {Object} android - Android-specific configuration */
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.mployv5",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    /** @property {Object} web - Web platform configuration */
    web: {
      favicon: "./assets/favicon.png"
    },
    /** @property {Array} plugins - Expo plugins configuration
     * Currently includes:
     * - expo-location: For handling location permissions and access
     */
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow Mploy to use your location."
        }
      ]
    ]
  }
};
