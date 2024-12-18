# Mploy v5 - MVP Implementation Plan

## Project Overview
A geospatial-based job matching platform connecting job seekers with both direct employers and recruitment agencies, similar to Tinder's matching mechanism.

## Core Features

### 1. Geospatial Matching
- [ ] Location-based job/candidate matching
- [ ] Radius-based search
- [ ] Distance display on cards
- [ ] Hyper-local job access

### 2. Dual Employer System 
- [x] Direct Employers (Companies) 
- [x] Recruitment Agencies 
- [x] Clear visual distinction on job cards

### 3. Progressive Profile Creation 
- [x] Step-by-step onboarding 
- [ ] Location permission handling 
- [x] Essential information capture 

## Implementation Phases

### Phase 1: Foundation 
1. **Project Setup** 
   - [x] Initialize React Native Expo project 
   - [x] Firebase configuration 
   - [x] Theme implementation 

2. **Authentication** 
   - [x] Login/Register flows 
   - [x] User type selection 
   - [x] Firebase Auth integration 

3. **Basic UI Components** 
   - [x] Theme system 
   - [x] Common components 
   - [x] Job/Profile cards

### Phase 2: Core Features 
1. **Progressive Onboarding** 
   - JobSeeker flow 
     - [x] Basic Info
       - Form Validations:
         - [x] Phone Number (Indian format)
         - [x] First Name (Required, letters only, 2-50 chars)
         - [x] Last Name (Required, letters only, 2-50 chars)
         - [x] Date of Birth (Required, age 18-100 years, no future dates)
         - [x] Gender (Required, must be one of: male/female/other)
     - [x] Location
     - [x] Education
     - [x] Experience
     - [x] Salary
   
   - Employer flow 
     - [x] Company Info 
     - [x] Employer Type 
     - [x] Location 
     - [x] Verification 

2. **Geospatial Implementation** (In Progress)
   - [ ] Location services 
   - [ ] Radius calculation
   - [ ] Distance display
   - [ ] Location-based matching

3. **Job/Profile Management** (Next Priority)
   - [x] Job posting (Employers)
   - [ ] Profile creation (JobSeekers)
   - [ ] Basic search/filter

### Phase 3: Matching System
1. **Swipe Mechanism**
   - [ ] Swipe cards implementation
   - [ ] Match algorithm
   - [ ] Match notifications

2. **Job/Candidate Discovery**
   - [ ] Geospatial-based recommendations
   - [ ] Skill matching
   - [ ] Experience matching

3. **Basic Chat**
   - [ ] Match chat
   - [ ] Basic messaging

## Testing & Launch
1. **Testing**
   - [ ] User flow testing
   - [ ] Geolocation testing
   - [ ] Match system testing

2. **Performance**
   - [ ] Load testing
   - [ ] Optimization
   - [ ] Firebase indexing

3. **Launch Preparation**
   - [ ] Bug fixes
   - [ ] Final UI polish
   - [ ] Documentation

## Technical Stack

### Frontend (React Native + Expo)
- [x] React Navigation
- [x] Firebase SDK
- [ ] Geolocation services
- [x] Custom theme system

### Backend (Node.js)
- [x] Express.js
- [x] Firebase Admin SDK
- [ ] Geospatial calculations
- [ ] Match algorithms

### Database (Firebase)
- [x] Authentication
- [ ] Firestore
- [ ] Storage
- [ ] Real-time updates

## Success Metrics
1. User Engagement
   - [ ] Profile completion rate
   - [ ] Daily active users
   - [ ] Swipe activity

2. Matching Efficiency
   - [ ] Match rate
   - [ ] Location accuracy
   - [ ] Response time

3. Technical Performance
   - [ ] App load time
   - [ ] Geospatial query speed
   - [ ] Match processing time

## Post-MVP Features
1. Advanced Matching
   - [ ] AI-based recommendations
   - [ ] Skills assessment
   - [ ] Behavioral matching

2. Enhanced Features
   - [ ] Video profiles
   - [ ] In-app interviews
   - [ ] Advanced analytics

3. Platform Growth
   - [ ] Multi-language support
   - [ ] Regional expansion
   - [ ] Enterprise features

## Notes
- Focus on geospatial accuracy
- Maintain clear employer type distinction
- Ensure smooth onboarding flow
- Prioritize performance in location-based queries
- Keep UI/UX simple yet professional


mployv5/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── icons/        # App-specific icons
│   │   │   ├── images/       # Static images, logos
│   │   │   └── fonts/        # Custom fonts if any
│   │   │
│   │   ├── components/
│   │   │   ├── common/       # Shared reusable components
│   │   │   │   ├── Button.js          # Custom button component
│   │   │   │   ├── SwipeCard.js       # Base swipe card component
│   │   │   │   ├── Input.js           # Custom input fields
│   │   │   │   ├── LocationPicker.js   # Location selection component
│   │   │   │   └── Tags.js            # Skills, requirements tags
│   │   │   │
│   │   │   ├── jobseeker/
│   │   │   │   └── JobCard.js         # Job listing card with swipe functionality
│   │   │   │
│   │   │   └── employer/
│   │   │       └── ProfileCard.js      # Candidate profile card with swipe
│   │   │
│   │   ├── screens/
│   │   │   ├── auth/         # Authentication screens
│   │   │   │   ├── Login.js           # Login screen
│   │   │   │   └── Register.js        # Register with user type selection
│   │   │   │
│   │   │   ├── jobseeker/
│   │   │   │   ├── onboarding/        # Progressive profile creation
│   │   │   │   │   ├── BasicInfo.js   # Name, contact, photo
│   │   │   │   │   ├── Location.js    # Location and radius preference
│   │   │   │   │   ├── Education.js   # Educational background
│   │   │   │   │   ├── Experience.js  # Work experience
│   │   │   │   │   └── Salary.js      # Salary expectations
│   │   │   │   │
│   │   │   │   ├── SwipeJobs.js      # Main job swiping screen
│   │   │   │   ├── Matches.js        # Matched jobs list
│   │   │   │   ├── JobDetail.js      # Detailed job view
│   │   │   │   └── Profile.js        # User profile management
│   │   │   │
│   │   │   └── employer/
│   │   │       ├── onboarding/
│   │   │       │   ├── CompanyInfo.js  # Basic company details
│   │   │       │   ├── Location.js     # Company location(s)
│   │   │       │   └── Verification.js # Company verification
│   │   │       │
│   │   │       ├── SwipeCandidates.js # Candidate swiping screen
│   │   │       ├── Matches.js         # Matched candidates
│   │   │       ├── JobPosts.js        # Manage job listings
│   │   │       └── Profile.js         # Company profile
│   │   │
│   │   ├── navigation/
│   │   │   ├── JobSeekerStack.js     # JobSeeker navigation flow
│   │   │   ├── EmployerStack.js      # Employer navigation flow
│   │   │   └── AppNavigator.js       # Root navigation
│   │   │
│   │   ├── theme/
│   │   │   └── theme.js              # Global theme configuration
│   │   │
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── auth.js           # Authentication API calls
│   │   │   │   ├── jobs.js           # Job-related API calls
│   │   │   │   └── profile.js        # Profile management API
│   │   │   │
│   │   │   └── firebase/
│   │   │       ├── config.js         # Firebase configuration
│   │   │       ├── auth.js           # Firebase auth methods
│   │   │       ├── firestore.js      # Firestore operations
│   │   │       └── storage.js        # Firebase storage operations
│   │   │
│   │   └── utils/
│   │       ├── location.js           # Geospatial calculations
│   │       ├── validation.js         # Form validations
│   │       └── formatters.js         # Data formatters
│   │
│   ├── App.js                        # Root component
│   └── app.json                      # Expo configuration
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js     # Authentication logic
│   │   │   ├── jobController.js      # Job posting/matching logic
│   │   │   ├── matchController.js    # Match handling logic
│   │   │   └── userController.js     # User management logic
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js              # Token verification
│   │   │   ├── validation.js        # Request validation
│   │   │   └── errorHandler.js      # Global error handling
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth endpoints
│   │   │   ├── jobs.js              # Job-related endpoints
│   │   │   ├── matches.js           # Match-related endpoints
│   │   │   └── users.js             # User management endpoints
│   │   │
│   │   ├── services/
│   │   │   ├── firebase.js          # Firebase admin setup
│   │   │   ├── geolocation.js       # Location services
│   │   │   └── matching.js          # Matching algorithm
│   │   │
│   │   └── utils/
│   │       ├── constants.js         # Global constants
│   │       └── helpers.js           # Utility functions
│   │
│   ├── config/
│   │   ├── firebase.js             # Firebase admin config
│   │   └── env.js                  # Environment variables
│   │
│   └── server.js                   # Express app setup
│
└── docs/                           # Documentation
    ├── api/
    │   ├── auth.md                 # Auth API documentation
    │   ├── jobs.md                 # Jobs API documentation
    │   └── matches.md              # Matches API documentation
    │
    ├── database/
    │   └── schema.md               # Database schema documentation
    │
    ├── setup/
    │   ├── frontend.md             # Frontend setup guide
    │   └── backend.md              # Backend setup guide
    │
    └── features/
        ├── geolocation.md          # Geolocation implementation
        └── matching.md             # Matching algorithm details