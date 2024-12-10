# Data Files Documentation

This directory contains static data files used throughout the Mploy application for dropdown options, autocomplete suggestions, and data validation.

## Directory Structure

```
data/
├── education/
│   ├── degrees.json     - Educational degrees and specializations
│   └── institutions.json - Educational institutions in India
└── experience/
    └── industries.json  - Industry sectors for work experience
```

## File Descriptions

### Education Data

#### `degrees.json`
Contains a structured list of educational degrees and their specializations.

**Structure:**
```json
{
  "degrees": [
    {
      "name": "Degree Name",
      "specializations": ["Specialization 1", "Specialization 2", ...]
    }
  ]
}
```

**Usage:**
- Used in the JobSeeker onboarding process for education details
- Provides standardized options for degree selection
- Enables dynamic specialization options based on selected degree

#### `institutions.json`
Contains a comprehensive list of educational institutions in India.

**Structure:**
```json
{
  "institutions": [
    {
      "name": "Institution Name",
      "city": "City Name",
      "type": "Public/Private"
    }
  ]
}
```

**Usage:**
- Used for institution autocomplete in education forms
- Provides location and type information for institutions
- Helps maintain data consistency in educational backgrounds

### Experience Data

#### `industries.json`
Contains a list of industry sectors for work experience classification.

**Structure:**
```json
{
  "industries": [
    "Industry Name 1",
    "Industry Name 2",
    ...
  ]
}
```

**Usage:**
- Used in job posting forms for industry selection
- Used in work experience forms for industry classification
- Ensures consistent industry categorization across the platform

## Data Maintenance

When updating these data files:
1. Maintain the existing JSON structure
2. Ensure all entries follow the same format
3. Keep lists alphabetically sorted where applicable
4. Validate JSON syntax after making changes
5. Test the application after updating the data

## Integration

These data files are typically imported and used in:
- Onboarding forms
- Profile editing forms
- Job posting forms
- Search and filter components

Example usage in React components:
```javascript
import degrees from '../data/education/degrees.json';
import industries from '../data/experience/industries.json';

// Using the data
const degreeOptions = degrees.degrees.map(degree => ({
  label: degree.name,
  value: degree.name
}));

const industryOptions = industries.industries.map(industry => ({
  label: industry,
  value: industry
}));
```
