/**
 * @fileoverview Babel configuration for the Mploy mobile application
 * @package frontend
 * @lastModified 2024-12-16
 */

/**
 * @function babelConfig
 * @description Configures Babel transpilation settings for the React Native application
 * @param {object} api - Babel API object used to enable caching
 * @returns {object} Babel configuration object containing presets and plugins
 */
module.exports = function(api) {
  /** Enable caching for faster builds */
  api.cache(true);
  
  return {
    /** @const {array} presets - Use Expo's preset for React Native compatibility */
    presets: ['babel-preset-expo'],
    
    /** 
     * @const {array} plugins - Babel plugins configuration
     * Configure environment variables support through react-native-dotenv
     */
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "@env",        // Import env variables through @env
        "path": ".env",             // Path to .env file
        "blacklist": null,          // No blacklisted variables
        "whitelist": null,          // No whitelisted variables
        "safe": false,              // Don't throw error if .env is missing
        "allowUndefined": true      // Allow undefined variables
      }]
    ]
  };
};
