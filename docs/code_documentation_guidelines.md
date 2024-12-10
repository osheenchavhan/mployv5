#Code Documentation Guidelines

This document outlines the standardized approach for documenting code across the Mploy codebase. These guidelines ensure consistency and maintainability of the codebase.

## 1. File Headers
Every source file should begin with a header comment containing:
```
/**
 * @fileoverview Brief description of the file's purpose
 * @package Package/module name
 * @author Original author (optional)
 * @lastModified Date of last significant modification
 */
```

## 2. Class Documentation
All classes should be documented with:
```
/**
 * @class Brief description of the class
 * @description Detailed description of the class's purpose and functionality
 * @example Basic usage example if applicable
 */
```

## 3. Function Documentation
Functions should be documented with:
```
/**
 * @function functionName
 * @description What the function does
 * @param {type} parameterName - Parameter description
 * @returns {type} Description of return value
 * @throws {ErrorType} Description of when/why errors are thrown (if applicable)
 */
```

## 4. Variable Documentation
Document important variables, especially:
- Configuration variables
- State management variables
- Complex data structures
- Magic numbers/constants

Format:
```
/** @const {type} Description of the variable's purpose */
```

## 5. Code Block Comments
- Use block comments (/* */) for multi-line explanations
- Use line comments (//) for single-line explanations
- Always explain "why" rather than "what" when the code isn't self-explanatory

## 6. Priority Areas for Documentation
1. Public APIs and interfaces
2. Complex business logic
3. State management
4. Data transformations
5. Error handling
6. Configuration settings
7. Integration points with external services

## 7. Documentation Don'ts
- Don't document obvious code
- Avoid redundant comments that just repeat the code
- Don't leave outdated comments
- Don't include sensitive information in comments

## 8. Implementation Plan
1. Phase 1: File Headers
   - Add standardized headers to all source files
   - Include file purpose and main responsibilities

2. Phase 2: Public Interfaces
   - Document all public APIs
   - Document exported functions and classes
   - Document interface contracts

3. Phase 3: Core Business Logic
   - Document complex business rules
   - Document state management
   - Document data flow

4. Phase 4: Configuration and Setup
   - Document environment variables
   - Document build and deployment configurations
   - Document dependencies

5. Phase 5: Error Handling and Edge Cases
   - Document error scenarios
   - Document validation rules
   - Document edge cases

## 9. Tools and Automation
Consider using these tools to maintain documentation:
- ESLint with documentation plugins
- JSDoc for JavaScript/TypeScript
- Documentation generators
- Automated documentation checkers

## 10. Review Process
- Documentation should be reviewed as part of code review
- Check for clarity, completeness, and accuracy
- Ensure documentation follows these guidelines
- Verify examples are correct and working

## 11. Documentation Progress Tracking

This section tracks the status of documentation across the codebase. Each file will be marked as:
- 🔴 Not Started
- 🟡 In Progress
- 🟢 Completed

### Frontend
#### Core Files
- 🟢 `/frontend/App.js`
- 🟢 `/frontend/app.config.js`

#### Source Code (/frontend/src)
##### Components
- 🟢 `/frontend/src/components/common/Button.js`
- 🟢 `/frontend/src/components/common/Chip.js`
- 🟢 `/frontend/src/components/common/Container.js`
- 🟢 `/frontend/src/components/common/DatePicker.js`
- 🟢 `/frontend/src/components/common/Input.js`
- 🟢 `/frontend/src/components/common/OnboardingHeader.js`
- 🟢 `/frontend/src/components/common/ProgressBar.js`
- 🟢 `/frontend/src/components/common/RadioGroup.js`
- 🟢 `/frontend/src/components/common/Select.js`

##### Context
- 🟢 `/frontend/src/context/OnboardingContext.js`
- 🟢 `/frontend/src/context/UserContext.js`
- 🟢 `/frontend/src/context/EmployerOnboardingContext.js`
- 🟢 `/frontend/src/context/JobPostingContext.js`

##### Navigation
- 🟢 `/frontend/src/navigation/AppNavigator.js`
- 🟢 `/frontend/src/navigation/JobSeekerStack.js`
- 🟢 `/frontend/src/navigation/EmployerStack.js`

##### Screens
###### Auth
- 🟢 `/frontend/src/screens/auth/Login.js`
- 🟢 `/frontend/src/screens/auth/Register.js`

###### Employer
- 🟢 `/frontend/src/screens/employer/onboarding/Verification.js`
- 🟢 `/frontend/src/screens/employer/onboarding/CompanyInfo.js`
- 🟢 `/frontend/src/screens/employer/onboarding/EmployerType.js`
- 🟢 `/frontend/src/screens/employer/onboarding/Location.js`
- 🟢 `/frontend/src/screens/employer/Dashboard.js`
- 🟢 `/frontend/src/screens/employer/JobPosts.js`
- 🟢 `/frontend/src/screens/employer/Matches.js`
- 🟢 `/frontend/src/screens/employer/Profile.js`
- 🟢 `/frontend/src/screens/employer/Settings.js`
- 🟢 `/frontend/src/screens/employer/SwipeCandidates.js`
- 🟢 `/frontend/src/screens/employer/jobs/PostJob.js`

###### JobSeeker
- 🟢 `/frontend/src/screens/jobseeker/Profile.js`
- 🟢 `/frontend/src/screens/jobseeker/JobDetail.js`
- 🟢 `/frontend/src/screens/jobseeker/Matches.js`
- 🟢 `/frontend/src/screens/jobseeker/SwipeJobs.js`
- 🟢 `/frontend/src/screens/jobseeker/onboarding/BasicInfo.js`
- 🟢 `/frontend/src/screens/jobseeker/onboarding/Education.js`
- 🟢 `/frontend/src/screens/jobseeker/onboarding/Experience.js`
- 🟢 `/frontend/src/screens/jobseeker/onboarding/Location.js`
- 🟢 `/frontend/src/screens/jobseeker/onboarding/Salary.js`

##### Services
- 🟢 `/frontend/src/services/emailService.js`
- 🟢 `/frontend/src/services/firebase/auth.js`
- 🟢 `/frontend/src/services/firebase/config.js`
- 🟢 `/frontend/src/services/firebase/jobs.js`
- 🔴 Remaining files in `/frontend/src/services`

##### Theme
- 🟢 `/frontend/src/theme/theme.js`

##### Config
- 🟢 `/frontend/src/config/constants.js`
- 🔴 All files in `/frontend/src/config` except constants.js

##### Data
- 🟢 `/frontend/src/data/README.md`
- 🟢 `/frontend/src/data/education/degrees.json`
- 🟢 `/frontend/src/data/education/institutions.json`
- 🟢 `/frontend/src/data/experience/industries.json`

### Documentation Progress Summary
- Total Files Pending: All source files except core files, documented components, JobSeeker screens, documented services, theme, config, and data
- Files Completed: 49 (Previous 45 files + 4 data files)
- Last Updated: 2024-12-10

### Documentation Style Guide
For core configuration files and complex functionality, documentation now includes:
1. "Why this file exists" section in plain language
2. Real-world examples and analogies
3. What would happen without this file
4. Clear breakdown of features and responsibilities

This makes the codebase more accessible to low-code developers and easier to maintain.

## 12. Documentation Update Log
This section will track all documentation updates:

```
Format:
YYYY-MM-DD: [File Path] - Brief description of documentation added
```

### Updates
- 2024-12-10: Created documentation guidelines and tracking system
- 2024-12-10: [/frontend/App.js] - Added comprehensive documentation including file overview, component, theme, and styles documentation
- 2024-12-10: [/frontend/app.config.js] - Added detailed Expo configuration documentation with property descriptions
- 2024-12-10: [/frontend/src/components/common/Button.js] - Added extensive component documentation including props, variants, sizes, and style system explanation
- 2024-12-10: [/frontend/src/components/common/Chip.js] - Added comprehensive documentation for chip variants, props, and styling system
- 2024-12-10: [/frontend/src/components/common/Container.js] - Added documentation for screen container wrapper with layout and device handling features
- 2024-12-10: [/frontend/src/components/common/DatePicker.js] - Added documentation for cross-platform date picker with validation and formatting features
- 2024-12-10: [/frontend/src/components/common/Input.js] - Added documentation for versatile input component with validation and secure text features
- 2024-12-10: [/frontend/src/components/common/OnboardingHeader.js] - Added documentation for navigation-aware header with back button functionality
- 2024-12-10: [/frontend/src/components/common/ProgressBar.js] - Added documentation for visual progress indicator with automatic bounds handling
- 2024-12-10: [/frontend/src/components/common/RadioGroup.js] - Added documentation for flexible radio group with vertical/horizontal layouts
- 2024-12-10: [/frontend/src/components/common/Select.js] - Added documentation for modal-based select component with bottom sheet picker
- 2024-12-10: [/frontend/src/context/OnboardingContext.js] - Added documentation for multi-step onboarding state management context
- 2024-12-10: [/frontend/src/context/UserContext.js] - Added documentation for Firebase authentication and user state management
- 2024-12-10: [/frontend/src/context/EmployerOnboardingContext.js] - Added documentation for employer-specific onboarding flow and validation
- 2024-12-10: [/frontend/src/context/JobPostingContext.js] - Added documentation for job posting creation and management system
- 2024-12-10: [/frontend/src/navigation/AppNavigator.js] - Added documentation for root navigation and authentication flow
- 2024-12-10: [/frontend/src/navigation/JobSeekerStack.js] - Added documentation for job seeker navigation and onboarding flow
- 2024-12-10: [/frontend/src/navigation/EmployerStack.js] - Added documentation for employer navigation and business setup flow
- 2024-12-10: Updated all context and navigation files with user-friendly "Why this file exists" documentation
- 2024-12-10: [/frontend/src/screens/employer/onboarding/Verification.js] - Added documentation explaining business verification process and its importance
- 2024-12-10: [/frontend/src/screens/employer/onboarding/CompanyInfo.js] - Added documentation for company profile information collection
- 2024-12-10: [/frontend/src/screens/employer/onboarding/EmployerType.js] - Added documentation for employer type selection and customization
- 2024-12-10: [/frontend/src/screens/employer/onboarding/Location.js] - Added documentation for workplace location and hiring reach setup
- 2024-12-10: [/frontend/src/screens/employer/Dashboard.js] - Added documentation for employer dashboard and hiring overview
- 2024-12-10: [/frontend/src/screens/employer/JobPosts.js] - Added documentation for job posting management
- 2024-12-10: [/frontend/src/screens/employer/Matches.js] - Added documentation for candidate matching system
- 2024-12-10: [/frontend/src/screens/employer/Profile.js] - Added documentation for employer profile management
- 2024-12-10: [/frontend/src/screens/employer/Settings.js] - Added documentation for account settings and preferences
- 2024-12-10: [/frontend/src/screens/employer/SwipeCandidates.js] - Added documentation for candidate review interface
- 2024-12-10: [/frontend/src/screens/auth/Login.js] - Added comprehensive documentation including file overview, component documentation, and function documentation
- 2024-12-10: [/frontend/src/screens/auth/Register.js] - Added detailed documentation for registration flow, components, and validation functions
- 2024-12-10: [/frontend/src/screens/jobseeker/Profile.js] - Added comprehensive documentation for job seeker profile management
- 2024-12-10: [/frontend/src/screens/jobseeker/JobDetail.js] - Added detailed documentation for job details view
- 2024-12-10: [/frontend/src/screens/jobseeker/Matches.js] - Added documentation for matches interface and functionality
- 2024-12-10: [/frontend/src/screens/jobseeker/SwipeJobs.js] - Added documentation for job discovery and swipe interface
- 2024-12-10: Major update to JobSeeker onboarding screens documentation
- 2024-12-10: [/frontend/src/screens/jobseeker/onboarding/BasicInfo.js] - Verified existing comprehensive documentation
- 2024-12-10: [/frontend/src/screens/jobseeker/onboarding/Education.js] - Added detailed documentation for education information collection
- 2024-12-10: [/frontend/src/screens/jobseeker/onboarding/Experience.js] - Added documentation for work experience and career details
- 2024-12-10: [/frontend/src/screens/jobseeker/onboarding/Location.js] - Added documentation for location services and job search area
- 2024-12-10: [/frontend/src/screens/jobseeker/onboarding/Salary.js] - Added documentation for salary expectations and thresholds

2024-12-10: [/frontend/src/services/firebase/jobs.js] - Added comprehensive documentation for job-related Firebase operations
2024-12-10: [/frontend/src/services/firebase/config.js] - Added documentation for Firebase configuration and initialization
2024-12-10: [/frontend/src/services/firebase/auth.js] - Added documentation for Firebase authentication operations
2024-12-10: [/frontend/src/services/emailService.js] - Added documentation for email verification service

2024-12-10: [/frontend/src/theme/theme.js] - Added comprehensive documentation for application theme system including colors, typography, spacing, and other design tokens

2024-12-10: [/frontend/src/config/constants.js] - Added comprehensive documentation for application constants including API configuration, verification settings, and error messages

2024-12-10: [/frontend/src/data/*] - Added comprehensive documentation for data files including degrees, institutions, and industries data with usage examples and maintenance guidelines

Key improvements in this update:
1. Added comprehensive JSDoc comments for all components
2. Documented state management patterns
3. Added detailed function descriptions
4. Included code examples and usage patterns
5. Updated DOCUMENTATION.md with JobSeeker section
6. Standardized documentation style across all screens
