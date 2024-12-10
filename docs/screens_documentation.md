# Mploy Documentation

This document provides a comprehensive overview of all screens in the Mploy application, including their purpose, functionality, and key components.

## Table of Contents
1. [Auth Screens](#auth-screens)
2. [Employer Screens](#employer-screens)
3. [JobSeeker Screens](#jobseeker-screens)
4. [Common Components](#common-components)
5. [Navigation](#navigation)
6. [State Management](#state-management)
7. [Theme and Styling](#theme-and-styling)

## Auth Screens

### Login Screen (`/frontend/src/screens/auth/Login.js`)
The login screen handles user authentication for both employers and job seekers.

**Key Features:**
- Email and password authentication
- Form validation
- Error handling
- Navigation to registration
- Password reset functionality

**Main Functions:**
- `handleLogin`: Manages the login process and validation
- `validateForm`: Validates user input before submission

### Register Screen (`/frontend/src/screens/auth/Register.js`)
Handles new user registration for both employers and job seekers.

**Key Features:**
- User type selection (Employer/Job Seeker)
- Email and password validation
- Terms and conditions acceptance
- Real-time validation feedback

**Main Functions:**
- `handleRegister`: Processes registration submission
- `validateForm`: Validates registration data
- `UserTypeButton`: Custom component for user type selection

## Employer Screens

### Employer Onboarding Screens

#### 1. Verification.js
**Why this screen exists:**
- Ensures employers are legitimate businesses
- Protects job seekers from fraudulent postings
- Maintains platform credibility

**Key Functions:**
- `canVerifyByEmail`: Checks if email verification is available
  ```javascript
  // Example usage
  if (canVerifyByEmail(domain)) {
    // Proceed with email verification
  }
  ```
- `handleVerificationEmail`: Processes email verification
- `handleDocumentUpload`: Manages document upload verification
- `renderVerificationMethod`: Displays verification options
- `handleContinue`: Processes verification completion

#### 2. CompanyInfo.js
**Why this screen exists:**
- Helps employers create an attractive company profile
- Ensures consistent company information
- Makes company discoverable by candidates

**Key Functions:**
- `handleImagePick`: Manages company logo/image selection
- `validateForm`: Validates company information form
- `handleNext`: Processes form submission

**Constants:**
```javascript
const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
const industrySpecializations = ['Tech', 'Healthcare', 'Finance', ...];
```

#### 3. EmployerType.js
**Why this screen exists:**
- Customizes the employer experience
- Provides relevant features based on type
- Helps match with appropriate candidates

**Key Functions:**
- `handleTypeSelection`: Manages employer type selection
- `handleNext`: Processes type selection
- `isSelected`: Checks if a type is selected

#### 4. Location.js
**Why this screen exists:**
- Sets up company location preferences
- Defines remote work policies
- Helps match with local candidates

**Key Functions:**
- `handlePolicySelect`: Manages remote work policy selection
- `handleAddressChange`: Processes location updates
- `handleNext`: Validates and saves location information

**Constants:**
```javascript
const remoteOptions = ['remote', 'hybrid', 'onsite'];
```

### Main Employer Screens

#### 1. Dashboard (`/frontend/src/screens/employer/Dashboard.js`)
**Why this screen exists:**
- Provides quick overview of hiring activities
- Shows important metrics at a glance
- Helps track hiring progress

**Key Features:**
- Overview of active job posts
- Recent matches
- Quick actions
- Analytics summary

**Components:**
```javascript
// DashboardCard example
<DashboardCard
  title="Active Jobs"
  value={5}
  icon="work"
  onPress={() => navigate('JobPosts')}
/>
```

#### 2. JobPosts (`/frontend/src/screens/employer/JobPosts.js`)
**Why this screen exists:**
- Central hub for managing job postings
- Tracks application progress
- Maintains posting consistency

**Key Features:**
- List of active and inactive jobs
- Job post creation
- Job status management
- Search and filter functionality

**Components:**
```javascript
// JobStatusBadge example
<JobStatusBadge status="active" />

// JobCard example
<JobCard job={{
  id: 'job-123',
  title: 'Software Engineer',
  status: 'active',
  // ...other job details
}} />
```

#### 3. PostJob (`/frontend/src/screens/employer/jobs/PostJob.js`)
**Why this screen exists:**
- Makes job posting structured and simple
- Ensures all key details are included
- Maintains posting consistency

**Key Features:**
- Job details form
- Skill requirements
- Salary and benefits
- Location preferences
- Preview functionality

**Constants:**
```javascript
// Employment types
const employmentTypes = ['full-time', 'part-time', 'contract', 'internship'];
// Experience levels
const experienceLevels = ['entry', 'mid', 'senior', 'executive'];
```

#### 4. Matches (`/frontend/src/screens/employer/Matches.js`)
**Why this screen exists:**
- Shows potential candidate matches
- Streamlines candidate review
- Tracks match interactions

**Key Features:**
- Match list by job
- Candidate profiles
- Quick actions (message, schedule interview)
- Match status tracking

#### 5. Profile (`/frontend/src/screens/employer/Profile.js`)
**Why this screen exists:**
- Manages company presence
- Updates company information
- Showcases company culture

**Key Features:**
- Company information
- Contact details
- Profile visibility settings
- Document management

#### 6. Settings (`/frontend/src/screens/employer/Settings.js`)
**Why this screen exists:**
- Controls account preferences
- Manages notifications
- Handles security settings

**Key Features:**
- Notification preferences
- Account settings
- Privacy settings
- Subscription management

#### 7. SwipeCandidates (`/frontend/src/screens/employer/SwipeCandidates.js`)
**Why this screen exists:**
- Makes candidate review engaging
- Speeds up initial screening
- Creates better matches

**Key Features:**
- Candidate card view
- Swipe interactions
- Quick profile view
- Match actions

## JobSeeker Screens

### JobSeeker Onboarding Screens

#### 1. BasicInfo (`/frontend/src/screens/jobseeker/onboarding/BasicInfo.js`)
**Why this screen exists:**
- Collects essential personal information
- Ensures accurate user profiles
- Enables proper matching

**Key Features:**
- Personal details collection
- Form validation
- Progress tracking
- Data persistence

**Form Fields:**
- First Name
- Last Name
- Date of Birth
- Gender
- Phone Number

#### 2. Education (`/frontend/src/screens/jobseeker/onboarding/Education.js`)
**Why this screen exists:**
- Captures educational background
- Enables education-based matching
- Validates qualifications

**Key Features:**
- Multiple education levels
- Dynamic form fields
- Institution search
- Multiple entries for post-graduates

**Form Fields:**
- Education Level
- Currently Pursuing Status
- Degree and Specialization
- Institution
- Completion Date

#### 3. Experience (`/frontend/src/screens/jobseeker/onboarding/Experience.js`)
**Why this screen exists:**
- Records work history
- Enables experience-based matching
- Validates professional background

**Key Features:**
- Multiple experience entries
- Role and company details
- Duration tracking
- Skill tagging

#### 4. Location (`/frontend/src/screens/jobseeker/onboarding/Location.js`)
**Why this screen exists:**
- Sets location preferences
- Enables location-based matching
- Defines work area preferences

**Key Features:**
- Current location
- Preferred work locations
- Remote work preferences
- Location radius settings

### Main JobSeeker Screens

#### 1. Profile (`/frontend/src/screens/jobseeker/Profile.js`)
**Why this screen exists:**
- Manages personal profile
- Showcases skills and experience
- Maintains professional presence

**Key Features:**
- Personal information
- Work experience
- Education details
- Skills and certifications
- Portfolio/Resume management

#### 2. JobDetail (`/frontend/src/screens/jobseeker/JobDetail.js`)
**Why this screen exists:**
- Shows comprehensive job information
- Enables informed decisions
- Tracks application status

**Key Features:**
- Complete job description
- Company information
- Application status
- Similar jobs
- Quick actions (apply, save, share)

#### 3. Matches (`/frontend/src/screens/jobseeker/Matches.js`)
**Why this screen exists:**
- Displays job matches
- Tracks applications
- Manages communications

**Key Features:**
- Match list
- Application status
- Company profiles
- Communication history
- Match statistics

#### 4. SwipeJobs (`/frontend/src/screens/jobseeker/SwipeJobs.js`)
**Why this screen exists:**
- Enables quick job discovery
- Makes job search engaging
- Streamlines application process

**Key Features:**
- Job card swiping
- Quick job preview
- Match preferences
- Application tracking
- Session management

## Common Components

All screens utilize these common components:
- `Button`: Custom button component with variants
- `Input`: Form input component with validation
- `Container`: Screen container with common styling
- `ProgressBar`: Progress indicator for multi-step flows
- `DatePicker`: Date selection component
- `Select`: Dropdown selection component
- `RadioGroup`: Option selection component

## Navigation

The app uses React Navigation with the following main stacks:
- `AuthStack`: Login and registration flows
- `EmployerStack`: All employer screens
- `JobSeekerStack`: All job seeker screens

## State Management

- `UserContext`: Manages user authentication state
- `OnboardingContext`: Manages onboarding flow state
- `JobPostingContext`: Manages job posting state
- `EmployerOnboardingContext`: Manages employer onboarding state

## Theme and Styling

All screens follow the Mploy design system defined in `theme.js`, including:
- Color palette
- Typography
- Spacing
- Shadows
- Border radius
- Component-specific styles
