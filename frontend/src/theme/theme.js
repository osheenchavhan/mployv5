// theme.js

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
      black: '#212529'
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
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Poppins, Arial, sans-serif'
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px'
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },

  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },

  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
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
