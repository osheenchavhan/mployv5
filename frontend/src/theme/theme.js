/**
 * @fileoverview Application Theme Configuration
 * 
 * This file defines the core design system for the Mploy application, providing a centralized
 * theme configuration that ensures visual consistency across the app. It includes definitions
 * for colors, typography, spacing, shadows, and other visual properties.
 * 
 * Key Features:
 * - Comprehensive color palette with semantic naming
 * - Platform-specific typography settings
 * - Consistent spacing scale
 * - Customizable shadow definitions
 * - Animation presets
 * - Z-index management
 * 
 * Usage:
 * ```javascript
 * import { theme } from './theme';
 * 
 * // Using colors
 * const primaryColor = theme.colors.primary.main;
 * 
 * // Using typography
 * const fontSize = theme.typography.fontSize.md;
 * 
 * // Using spacing
 * const padding = theme.spacing.md;
 * ```
 * 
 * @package theme
 * @lastModified 2024-12-10
 */

import { Platform } from 'react-native';

/**
 * @constant {Object} theme - Main theme object containing all design tokens
 */
export const theme = {
  /**
   * Color Palette
   * Organized hierarchically with semantic naming for better maintainability
   * @property {Object} colors
   */
  colors: {
    // Primary Colors - Main brand identity
    primary: {
      main: '#2A2F8F',      // Deep Blue - Main brand color
      light: '#3D43A2',
      dark: '#1A1D66',
      contrast: '#FFFFFF'
    },
    // Secondary Colors - Supporting brand colors
    secondary: {
      main: '#E63946',      // Red - for important actions/alerts
      light: '#FF4D5A',
      dark: '#CC2936'
    },
    // Accent Colors - Functional colors for different states
    accent: {
      success: '#4CAF50',   // Green - for success states
      warning: '#FFC107',   // Yellow - for warnings
      error: '#DC3545',     // Red - for errors
      info: '#0dcaf0'       // Light Blue - for information
    },
    // Neutral Colors - For text, backgrounds, and borders
    neutral: {
      white: '#FFFFFF',
      background: '#F8F9FA',
      lightGrey: '#E9ECEF',
      grey: '#6C757D',
      darkGrey: '#343A40',
      black: '#212529',
      transparent: 'transparent'
    },
    // Status Colors - For user and system states
    status: {
      online: '#4CAF50',
      offline: '#6C757D',
      busy: '#FFC107'
    }
  },

  /**
   * Typography System
   * Platform-specific font families and consistent sizing
   * @property {Object} typography
   */
  typography: {
    fontFamily: Platform.select({
      ios: {
        regular: 'System',
        medium: 'System',
        semiBold: 'System',
        bold: 'System',
      },
      android: {
        regular: 'Roboto',
        medium: 'Roboto',
        semiBold: 'Roboto',
        bold: 'Roboto',
      }
    }),
    fontSize: {
      xs: 12,    // For small labels, captions
      sm: 14,    // For secondary text
      md: 16,    // Base font size
      lg: 18,    // For emphasized text
      xl: 20,    // For subtitles
      '2xl': 24, // For titles
      '3xl': 30, // For section headers
      '4xl': 36, // For main headers
      '5xl': 48  // For hero text
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: 1.25,   // For headings
      normal: 1.5,   // For body text
      relaxed: 1.75  // For improved readability
    }
  },

  /**
   * Spacing System
   * Consistent spacing scale for margins, padding, and layout
   * @property {Object} spacing
   */
  spacing: {
    xxs: 4,     // For minimal spacing
    xs: 8,      // For tight spacing
    sm: 12,     // For close elements
    md: 16,     // Base spacing unit
    lg: 24,     // For related elements
    xl: 32,     // For section spacing
    '2xl': 40,  // For major sections
    '3xl': 48,
    '4xl': 56,
    '5xl': 64,
    '6xl': 80   // For page-level spacing
  },

  /**
   * Border Radius System
   * Consistent border radius scale for UI elements
   * @property {Object} borderRadius
   */
  borderRadius: {
    none: 0,
    sm: 4,      // For subtle rounding
    md: 8,      // Default rounding
    lg: 12,     // For cards and larger elements
    xl: 16,     // For prominent elements
    '2xl': 24,  // For modal corners
    full: 9999  // For circular elements
  },

  /**
   * Shadow System
   * Cross-platform shadow definitions
   * @property {Object} shadows
   */
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8
    }
  },

  /**
   * Animation Presets
   * Common animation configurations
   * @property {Object} animations
   */
  animations: {
    transition: {
      fast: '0.2s ease',    // For micro-interactions
      normal: '0.3s ease',  // For standard transitions
      slow: '0.5s ease'     // For emphasis
    },
    scale: {
      hover: 'scale(1.05)', // Subtle enlargement
      active: 'scale(0.95)' // Click feedback
    }
  },

  /**
   * Z-index Scale
   * Manages stacking context across the app
   * @property {Object} zIndex
   */
  zIndex: {
    modal: 1000,    // Highest level - modals
    overlay: 900,   // Below modals - overlays
    drawer: 800,    // Navigation drawers
    dropdown: 700,  // Dropdown menus
    navbar: 100     // Navigation bars
  }
};

export default theme;
