# Education Screen Implementation Plan

## Overview
This document outlines the step-by-step implementation plan for the Education screen in the Mploy app's onboarding flow.

## UI Components Structure
1. **Progress Bar**
   - Shows user's progress in onboarding flow
   - Set to appropriate percentage

2. **Currently Pursuing Education Section**
   - Toggle between Yes/No
   - Affects validation and completion date field
   - Implementation Priority: High

3. **Education Level Selection**
   ```javascript
   const EDUCATION_LEVELS = [
     '10th or Below 10th',
     '12th Pass',
     'Diploma',
     'ITI',
     'Graduate',
     'Post Graduate'
   ];
   ```
   - Displayed as pill buttons
   - Single selection only
   - Visual feedback for selected state
   - Implementation Priority: High

4. **Degree Selection**
   - Dropdown menu
   - Options change based on education level
   - Required only for Diploma and above
   - Implementation Priority: High

5. **Specialization Selection**
   - Dropdown menu
   - Options change based on selected degree
   - Optional for some degrees
   - Implementation Priority: Medium

6. **Institution Input**
   - Autocomplete input field
   - Shows suggestions while typing
   - Implementation Priority: Medium

7. **Completion Date**
   - Month and Year selection
   - Month dropdown (January - December)
   - Year number input
   - Shows "Expected" if currently pursuing
   - Format: "Month YYYY" (e.g., "July 2024")
   - Implementation Priority: High

## Data Management

### 1. Local Data Files (Phase 1)
- Create separate JSON files for:
  ```
  /frontend/src/data/
  ├── education/
  │   ├── degrees.json
  │   ├── specializations.json
  │   └── institutions.json
  ```

### 2. API Integration (Phase 2)
- Research and integrate with Indian education databases
- Implement caching strategy
- Fallback to local data if API fails

## Implementation Phases

### Phase 1: Basic Structure
1. Update UI layout according to design
2. Implement education level selection
3. Add basic form validation
4. Connect with OnboardingContext

### Phase 2: Enhanced Features
1. Add degree and specialization dropdowns
2. Implement dynamic field showing/hiding
3. Add "Currently Pursuing" logic
4. Enhance validation rules

### Phase 3: Institution Integration
1. Add local institutions database
2. Implement autocomplete functionality
3. Add custom institution input option

### Phase 4: Data Integration
1. Research and select appropriate APIs
2. Implement API integration
3. Add caching layer
4. Create fallback mechanisms

## Validation Rules
1. Education Level: Required
2. Degree: Required for Diploma and above
3. Specialization: Optional
4. Institution: Required
5. Completion Date: Required, must be:
   - Not future date (unless currently pursuing)
   - Not before 1900
   - Not after current year (unless currently pursuing)

## State Management
```javascript
const educationState = {
  isCurrentlyPursuing: boolean,
  educationLevel: string,
  degree: string | null,
  specialization: string | null,
  institution: string,
  completionDate: {
    month: string,
    year: number
  }
};
```

## Dependencies Required
- react-native-dropdown-picker
- react-native-autocomplete-input
- Other UI component libraries as needed

## Testing Strategy
1. Unit tests for validation logic
2. Integration tests for data flow
3. UI tests for component interaction
4. Performance testing for autocomplete

## Future Enhancements
1. Multiple education entries
2. Document upload capability
3. Institution verification
4. Academic performance metrics
5. Course duration tracking

## Notes
- All changes will be made incrementally
- Each phase will be tested thoroughly before proceeding
- Code will be kept modular for easy maintenance
- Regular backups will be maintained
- Changes will be isolated to education-related files only
