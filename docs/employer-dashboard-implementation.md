# Employer Dashboard Implementation Plan

## Phase 1: Navigation Structure
### 1. Bottom Navigation Setup
- [ ] Create BottomTabNavigator
- [ ] Design and implement navigation icons
- [ ] Setup navigation routes:
  - Home/Dashboard
  - Jobs
  - Applications
  - Messages
  - Profile

### 2. Basic Screen Structure
- [ ] Create base screens:
  - `screens/employer/Dashboard.js`
  - `screens/employer/Applications.js`
  - `screens/employer/Messages.js`
  - `screens/employer/Profile.js`
  - Update existing `screens/employer/JobPosts.js`

## Phase 2: Dashboard Implementation
### 1. Quick Stats Section
- [ ] Component: `components/employer/dashboard/QuickStats.js`
  - Active Jobs Counter
  - Total Applications
  - Pending Reviews
  - Shortlisted Candidates

### 2. Recent Activity Section
- [ ] Component: `components/employer/dashboard/RecentActivity.js`
  - Latest Applications List
  - Interview Schedule Cards
  - Notification/Message Preview

### 3. Quick Actions Section
- [ ] Component: `components/employer/dashboard/QuickActions.js`
  - Post New Job Button
  - Review Applications Button
  - Schedule Interview Button

## Phase 3: Applications Management
### 1. Applications List View
- [ ] Filter options (Status, Date, Job)
- [ ] Application preview cards
- [ ] Batch actions (Shortlist, Reject, Schedule Interview)

### 2. Application Detail View
- [ ] Candidate profile overview
- [ ] Application status management
- [ ] Interview scheduling
- [ ] Notes and feedback system

## Phase 4: Messaging System
### 1. Message List
- [ ] Conversation previews
- [ ] Unread indicators
- [ ] Search/Filter conversations

### 2. Chat Interface
- [ ] Real-time messaging
- [ ] Message types (text, attachments)
- [ ] Interview scheduling through chat

## Phase 5: Profile & Settings
### 1. Company Profile
- [ ] Company information management
- [ ] Team member management
- [ ] Subscription/Plan details

### 2. Settings
- [ ] Notification preferences
- [ ] Email preferences
- [ ] Account settings

## Agency-Specific Features
### 1. Client Management
- [ ] Client list view
- [ ] Client profile management
- [ ] Client-specific job listings

### 2. Candidate Database
- [ ] Talent pool management
- [ ] Placement tracking
- [ ] Candidate notes and status

## Data Structure

### Employer Profile
```typescript
interface EmployerProfile {
  id: string;
  companyName: string;
  type: 'direct' | 'agency';
  logo?: string;
  website?: string;
  industry: string;
  size: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  team?: {
    id: string;
    role: 'admin' | 'recruiter' | 'hiring_manager';
    name: string;
    email: string;
  }[];
}
```

### Job Post
```typescript
interface JobPost {
  id: string;
  employerId: string;
  title: string;
  description: string;
  requirements: string[];
  status: 'draft' | 'active' | 'paused' | 'closed';
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: {
    type: 'remote' | 'onsite' | 'hybrid';
    locations?: string[];
  };
  salary: {
    amount: number;
    type: 'monthly' | 'yearly';
  };
  company?: {  // For agency posts
    name: string;
    website?: string;
    description?: string;
  };
  applications: {
    total: number;
    new: number;
    shortlisted: number;
    rejected: number;
  };
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Application
```typescript
interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  resume: string;
  coverLetter?: string;
  notes?: {
    id: string;
    text: string;
    createdBy: string;
    createdAt: timestamp;
  }[];
  interviews?: {
    id: string;
    scheduledFor: timestamp;
    type: 'phone' | 'video' | 'onsite';
    status: 'scheduled' | 'completed' | 'cancelled';
  }[];
  appliedAt: timestamp;
  updatedAt: timestamp;
}
```

## Implementation Order for MVP
1. Bottom Navigation & Basic Screens
2. Dashboard Quick Stats & Actions
3. Applications Management (Basic)
4. Basic Messaging
5. Profile Management
6. Agency-specific features

## Future Enhancements (Post-MVP)
1. Advanced Analytics
2. Team Collaboration Features
3. Interview Scheduling System
4. Advanced Candidate Tracking
5. Integration with ATS Systems
6. Custom Workflow Builder 