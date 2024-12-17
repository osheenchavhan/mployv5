# Database Implementation Plan

## Overview
This document outlines the phased implementation plan for Mploy's Firebase/Firestore database structure. The implementation follows a systematic approach to build the core functionality first, followed by matching systems and communication features.

## Implementation Phases

### Phase 1: Core Collections (Priority: High) 

#### 1. Users Collection 
- **Implementation Status**:  Completed
- **Implementation Steps**:
  1.  Set up Firebase Authentication
  2.  Create user document on registration
  3.  Implement profile creation/update operations
  4.  Set up location services integration
  5.  Add profile validation middleware

- **Key Components**: 
  ```javascript
  /services/firebase/auth.js         // Authentication operations
  /services/firebase/users.js        // User CRUD operations
  /services/firebase/validation.js   // Data validation utilities
  ```

- **Security Rules**: 
  ```javascript
  match /users/{userId} {
    allow read: if request.auth != null;
    allow write: if request.auth.uid == userId;
  }
  ```

#### 2. Jobs Collection 
- **Implementation Status**:  Completed
- **Implementation Steps**:
  1.  Create job posting functionality (`/models/Job.js`, `/controllers/jobs.js`)
  2.  Implement location-based queries (using Haversine formula)
  3.  Set up job metrics tracking (views, right swipes)
  4.  Add job status management (active/paused/closed)
  5.  Implement job search/filter operations

- **Key Components**: 
  ```javascript
  /models/Job.js                    // Job model and operations
  /controllers/jobs.js              // Job request handlers
  /routes/jobs.js                   // Job API routes
  ```

- **Security Rules**: 
  ```javascript
  match /jobs/{jobId} {
    allow read: if request.auth != null;
    allow write: if request.auth != null 
      && get(/users/$(request.auth.uid)).data.userType == 'employer';
  }
  ```

### Phase 2: Matching System (Priority: Medium) 

#### 1. Applications Collection 
- **Implementation Status**:  Completed
- **Implementation Steps**:
  1.  Set up application creation flow (`/models/Application.js`)
  2.  Implement match criteria calculation (placeholder implemented, needs real algorithm)
  3.  Create application status management (pending/reviewing/shortlisted/rejected/withdrawn/hired)
  4.  Add timeline tracking (status changes, notes)
  5.  Implement notes and updates system

- **Key Components**: 
  ```javascript
  /models/Application.js            // Application model and operations
  /controllers/applications.js      // Application request handlers
  /routes/applications.js          // Application API routes
  ```

- **Security Rules**: 
  ```javascript
  match /applications/{applicationId} {
    allow read: if request.auth != null 
      && (resource.data.jobSeekerId == request.auth.uid 
          || resource.data.employerId == request.auth.uid);
    allow create: if request.auth != null;
  }
  ```

#### 2. Matches Collection 
- **Implementation Status**:  Pending
- **Implementation Steps**:
  1.  Implement match processing system
  2.  Create match criteria tracking
  3.  Set up match status management
  4.  Add match notifications
  5.  Implement match analytics

- **Key Components**: 
  ```javascript
  /services/firebase/matches.js      // Match operations
  /services/firebase/analytics.js    // Match analytics
  ```

- **Security Rules**: 
  ```javascript
  match /matches/{matchId} {
    allow read: if request.auth != null 
      && (resource.data.jobSeekerId == request.auth.uid 
          || resource.data.employerId == request.auth.uid);
  }
  ```

### Phase 3: Communication (Priority: Low)

#### 1. Chats Collection
- **Implementation Steps**:
  1.  Set up real-time messaging
  2.  Implement chat history
  3.  Create participant management
  4.  Add message status tracking
  5.  Implement chat notifications

- **Key Components**: 
  ```javascript
  /services/firebase/chats.js        // Chat operations
  /services/firebase/messages.js     // Message handling
  /services/firebase/realtime.js     // Real-time updates
  ```

- **Security Rules**: 
  ```javascript
  match /chats/{chatId} {
    allow read, write: if request.auth != null 
      && request.auth.uid in resource.data.participants;
  }
  ```

#### 2. Notifications Collection
- **Implementation Steps**:
  1.  Create notification system
  2.  Implement real-time updates
  3.  Set up notification status tracking
  4.  Add notification preferences
  5.  Implement notification cleanup

- **Key Components**: 
  ```javascript
  /services/firebase/notifications.js // Notification operations
  /services/firebase/preferences.js   // User preferences
  ```

- **Security Rules**: 
  ```javascript
  match /notifications/{notificationId} {
    allow read, write: if request.auth != null 
      && resource.data.userId == request.auth.uid;
  }
  ```

## Database Indexes

### Required Indexes
1. Jobs Collection:
   - location, createdAt
   - status, employerId
   - skills, experienceLevel

2. Applications Collection:
   - status, jobSeekerId
   - status, employerId
   - createdAt, status

3. Matches Collection:
   - status, jobSeekerId
   - status, employerId
   - createdAt, status

### Composite Indexes
```javascript
{
  "indexes": [
    {
      "collectionGroup": "jobs",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "location", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## Testing Strategy

### Unit Tests
- Test each CRUD operation
- Validate security rules
- Test data validation
- Verify indexes

### Integration Tests
- Test real-time updates
- Verify matching algorithms
- Test notification delivery
- Validate geolocation queries

### Performance Tests
- Query response times
- Real-time update latency
- Location-based query performance
- Match processing speed

## Monitoring and Maintenance

### Monitoring
- Set up Firebase Analytics
- Track query performance
- Monitor real-time connection status
- Track error rates

### Maintenance
- Regular security rule updates
- Index optimization
- Data cleanup routines
- Performance optimization

## Success Metrics
1. Query response times < 500ms
2. Real-time update latency < 100ms
3. Location query accuracy > 99%
4. Match processing time < 1s

## Notes
- Prioritize security rules implementation
- Optimize indexes for common queries
- Implement proper error handling
- Follow Firebase best practices for scalability

### Legend:
-  Completed
-  In Progress
-  Next Up
-  Planned
-  Blocked
