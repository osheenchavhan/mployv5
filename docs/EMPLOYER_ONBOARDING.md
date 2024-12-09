# Employer Onboarding Implementation Plan

## Overview
This document outlines the implementation plan for the employer onboarding process in Mploy, covering both direct employers and recruitment agencies.

## Core Features

### Key Distinctions
1. **Direct Employers**
   - Hiring for their own company
   - Location-based job posting (default to company location)
   - Company profile verification through business email

2. **Recruitment Agencies**
   - Hiring for client companies
   - Location-independent agency profile
   - Job-specific location handling
   - Industry specialization focus

## Detailed Implementation Plan

### 1. Onboarding Flow Structure

#### A. Employer Type Selection Screen (First Screen)
- Primary selection:
  ```
  Choose your employer type:
  □ Direct Employer (I'm hiring for my company)
  □ Recruitment Agency (I hire for other companies)
  ```
- Email Verification Status:
  - Auto-verify if signed up with company email
  - Show verification badge if email domain matches company website

#### B. Company Info Screen

**For Direct Employers:**
- Required Fields:
  - Company Name
  - Industry Type (predefined categories)
  - Company Description
- Optional Fields:
  - Company Logo Upload (max 2MB, jpg/png)
  - Company Size (1-10, 11-50, 51-200, 201-500, 500+)
  - Website URL
  - Company Email Domain (if not already verified)

**For Recruitment Agency:**
- Required Fields:
  - Agency Name
  - Specialization/Industries served (multiple select)
  - Agency Description
- Optional Fields:
  - Agency Logo (max 2MB, jpg/png)
  - Agency Size
  - Website URL
  - Years in Business

#### C. Job Location Preferences

**For Direct Employers:**
- Company's primary location(s)
  - Used as default location for job postings
  - Can be overridden per job posting
- Remote work policy options:
  - Fully remote
  - Hybrid
  - On-site only

**For Recruitment Agency:**
- Skip location screen entirely
- Location will be captured during job posting
- Include note: "You'll be able to specify job locations when posting positions"

### 2. State Management

\`\`\`javascript
const EmployerOnboardingContext = {
  employerType: {
    type: 'direct' | 'agency',
    isEmailVerified: boolean
  },
  companyInfo: {
    // Shared fields
    name: string,
    logo?: file,
    size: string,
    description: string,
    website?: string,
    
    // Direct Employer specific
    primaryIndustry?: string,
    emailDomain?: string,
    
    // Agency specific
    specializations?: string[],
    yearsInBusiness?: number
  },
  locationPreferences?: {  // Only for Direct Employers
    primaryLocation?: {
      address: string,
      coordinates: {lat: number, lng: number}
    },
    remoteWorkPolicy: 'remote' | 'hybrid' | 'onsite'
  }
}
\`\`\`

### 3. Navigation Flows

**Direct Employer Flow:**
```
Register → Employer Type → Company Info → Location Preferences → Dashboard
                                                                  ↓
                                                            (15-day timer for verification)
```

**Agency Flow:**
```
Register → Employer Type → Company Info → Dashboard
                                          ↓
                                    (15-day timer for verification)
```

### 4. Verification System

#### A. Email-based Verification
- Automatic verification if:
  - Email domain matches company website
  - Email is from a recognized business email provider

#### B. 15-Day Grace Period
- Show verification countdown in dashboard
- Notification system:
  - Day 1: Welcome + verification info
  - Day 10: Reminder
  - Day 14: Final reminder
  - Day 15: Restriction warning

#### C. Verification Status Display
- In job postings:
  ```
  ✓ Verified (if email matches company domain)
  ⚠ Verification Pending (within 15 days)
  ! Verification Required (after 15 days)
  ```

### 5. Job Posting Location Handling

#### A. Direct Employers
- Default to company's primary location
- Option to override per job:
  - Different office location
  - Remote/hybrid options
  - Multiple locations for same role

#### B. Recruitment Agencies
- Required fields per job posting:
  - Job Location (city/region)
  - Work Type (remote/hybrid/onsite)
  - Client Company Location (optional)
  - Multiple locations support

### 6. Data Validation Rules

#### A. Company/Agency Info
- Name: 3-50 characters
- Logo: max 2MB, formats: jpg, png
- Description: 50-500 characters
- Website: valid URL format (optional)

#### B. Location (Direct Employers)
- Valid address
- Valid coordinates
- At least one work type selected

#### C. Email Verification
- Business email patterns
- Domain matching for direct employers
- Standard email validation

## Implementation Phases

### Phase 1: Core Structure
1. Set up EmployerOnboardingContext
2. Create base screens
3. Implement navigation flow

### Phase 2: Features
1. Implement email verification
2. Set up 15-day grace period system
3. Create location handling system

### Phase 3: Polish
1. Add validation rules
2. Implement notification system
3. Add progress tracking

## Notes
- Prioritize smooth user experience
- Keep verification optional for first 15 days
- Focus on location handling differences between employer types
- Ensure clear distinction between employer types in UI/UX
