// theme.js

import { Platform } from 'react-native';

export const theme = {
  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      main: '#2A2F8F',      // Deep Blue - Main brand color
      light: '#3D43A2',
      dark: '#1A1D66',
      contrast: '#FFFFFF'
    },
    // Secondary Colors
    secondary: {
      main: '#E63946',      // Red - for important actions/alerts
      light: '#FF4D5A',
      dark: '#CC2936'
    },
    // Accent Colors
    accent: {
      success: '#4CAF50',   // Green - for success states
      warning: '#FFC107',   // Yellow - for warnings
      error: '#DC3545',     // Red - for errors
      info: '#0dcaf0'       // Light Blue - for information
    },
    // Neutral Colors
    neutral: {
      white: '#FFFFFF',
      background: '#F8F9FA',
      lightGrey: '#E9ECEF',
      grey: '#6C757D',
      darkGrey: '#343A40',
      black: '#212529',
      transparent: 'transparent'
    },
    // Status Colors
    status: {
      online: '#4CAF50',
      offline: '#6C757D',
      busy: '#FFC107'
    }
  },

  // Typography
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
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },

  // Spacing
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
    '4xl': 56,
    '5xl': 64,
    '6xl': 80
  },

  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999
  },

  // Shadows
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

  // Animations
  animations: {
    transition: {
      fast: '0.2s ease',
      normal: '0.3s ease',
      slow: '0.5s ease'
    },
    scale: {
      hover: 'scale(1.05)',
      active: 'scale(0.95)'
    }
  },

  // Z-index
  zIndex: {
    modal: 1000,
    overlay: 900,
    drawer: 800,
    dropdown: 700,
    navbar: 100
  }
};

export default theme;
