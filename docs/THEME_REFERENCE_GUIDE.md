# Mploy Theme Reference Guide

## Table of Contents
- [Overview](#overview)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing](#spacing)
- [Border Radius](#border-radius)
- [Shadows](#shadows)
- [Animations](#animations)
- [Z-Index Management](#z-index-management)
- [Usage Examples](#usage-examples)

## Overview

The Mploy theme system provides a centralized configuration for maintaining visual consistency across the application. This guide explains how to use the theme tokens effectively in your components.

## Color System

Our color system is organized hierarchically with semantic naming for better maintainability:

### Primary Colors
- `primary.main`: #2A2F8F (Deep Blue - Main brand color)
- `primary.light`: #3D43A2
- `primary.dark`: #1A1D66
- `primary.contrast`: #FFFFFF

### Secondary Colors
- `secondary.main`: #E63946 (Red - for important actions/alerts)
- `secondary.light`: #FF4D5A
- `secondary.dark`: #CC2936

### Accent Colors
- `accent.success`: #4CAF50 (Green - for success states)
- `accent.warning`: #FFC107 (Yellow - for warnings)
- `accent.error`: #DC3545 (Red - for errors)
- `accent.info`: #0dcaf0 (Light Blue - for information)

### Neutral Colors
- `neutral.white`: #FFFFFF
- `neutral.background`: #F8F9FA
- `neutral.lightGrey`: #E9ECEF
- `neutral.grey`: #6C757D
- `neutral.darkGrey`: #343A40
- `neutral.black`: #212529
- `neutral.transparent`: transparent

### Status Colors
- `status.online`: #4CAF50
- `status.offline`: #6C757D
- `status.busy`: #FFC107

## Typography

Our typography system is platform-specific and provides consistent sizing:

### Font Families
Platform-specific font families:
- iOS: System font
- Android: Roboto

### Font Sizes
- `xs`: 12px (For small labels, captions)
- `sm`: 14px (For secondary text)
- `md`: 16px (Base font size)
- `lg`: 18px (For emphasized text)
- `xl`: 20px (For subtitles)
- `2xl`: 24px (For titles)
- `3xl`: 30px (For section headers)
- `4xl`: 36px (For main headers)
- `5xl`: 48px (For hero text)

### Font Weights
- `regular`: '400'
- `medium`: '500'
- `semibold`: '600'
- `bold`: '700'

### Line Heights
- `tight`: 1.25 (For headings)
- `normal`: 1.5 (For body text)
- `relaxed`: 1.75 (For improved readability)

## Spacing

Our spacing system provides consistent scale for margins, padding, and layout:

- `xxs`: 4px (For minimal spacing)
- `xs`: 8px (For tight spacing)
- `sm`: 12px (For close elements)
- `md`: 16px (Base spacing unit)
- `lg`: 24px (For related elements)
- `xl`: 32px (For section spacing)
- `2xl`: 40px (For major sections)
- `3xl`: 48px
- `4xl`: 56px
- `5xl`: 64px
- `6xl`: 80px (For page-level spacing)

## Border Radius

Consistent border radius scale for UI elements:

- `none`: 0
- `sm`: 4px (For subtle rounding)
- `md`: 8px (Default rounding)
- `lg`: 12px (For cards and larger elements)
- `xl`: 16px (For prominent elements)
- `2xl`: 24px (For modal corners)
- `full`: 9999px (For circular elements)

## Shadows

Cross-platform shadow definitions:

### None
```javascript
{
  shadowColor: 'transparent',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0
}
```

### Small (sm)
```javascript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.18,
  shadowRadius: 1.0,
  elevation: 1
}
```

### Medium (md)
```javascript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,
  elevation: 4
}
```

### Large (lg)
```javascript
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.30,
  shadowRadius: 4.65,
  elevation: 8
}
```

## Animations

Common animation configurations:

### Transitions
- `fast`: 0.2s ease (For micro-interactions)
- `normal`: 0.3s ease (For standard transitions)
- `slow`: 0.5s ease (For emphasis)

### Scale
- `hover`: scale(1.05) (Subtle enlargement)
- `active`: scale(0.95) (Click feedback)

## Z-Index Management

Z-index scale for managing stacking context:

- `modal`: 1000 (Highest level - modals)
- `overlay`: 900 (Below modals - overlays)
- `drawer`: 800 (Navigation drawers)
- `dropdown`: 700 (Dropdown menus)
- `navbar`: 100 (Navigation bars)

## Usage Examples

### Importing the Theme
```javascript
import { theme } from './theme';
```

### Using Colors
```javascript
const styles = {
  container: {
    backgroundColor: theme.colors.primary.main,
    color: theme.colors.primary.contrast
  },
  statusIndicator: {
    backgroundColor: theme.colors.status.online
  }
};
```

### Using Typography
```javascript
const styles = {
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.lineHeight.tight
  },
  body: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.regular,
    lineHeight: theme.typography.lineHeight.normal
  }
};
```

### Using Spacing
```javascript
const styles = {
  container: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg
  }
};
```

### Using Shadows
```javascript
const styles = {
  card: {
    ...theme.shadows.md,
    borderRadius: theme.borderRadius.lg
  }
};
```

### Using Animations
```javascript
const styles = {
  button: {
    transition: theme.animations.transition.normal
  }
};
