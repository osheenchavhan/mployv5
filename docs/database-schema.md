# Mploy Database Schema

## Collections

### 1. Users Collection (users/{userId})
```json
{
  "id": "string",
  "userType": "'jobSeeker' | 'employer'",
  "email": "string",
  "emailVerified": "boolean",
  "createdAt": "timestamp",
  "lastLoginAt": "timestamp",
  "status": "'active' | 'inactive' | 'suspended'",
  
  // Job Seeker Specific Fields
  "jobSeeker": {
    "currentLocation": "GeoPoint",
    "searchRadius": "number",
    "profile": {
      "name": "string",
      "phone": "string",
      "skills": "string[]",
      "experience": "number",
      "education": [{
        "degree": "string",
        "institution": "string",
        "year": "number"
      }],
      "workHistory": [{
        "company": "string",
        "position": "string",
        "startDate": "timestamp",
        "endDate": "timestamp",
        "description": "string"
      }],
      "preferredLocations": "GeoPoint[]",
      "willingToRelocate": "boolean",
      "preferredSalary": {
        "amount": "number",
        "type": "'monthly' | 'annual'",
        "currency": "string",
        "isNegotiable": "boolean"
      }
    }
  },

  // Employer Specific Fields
  "employer": {
    "employerType": "'direct' | 'agency'",
    "profile": {
      "companyName": "string",
      "companyLogo": "string",
      "companyDescription": "string",
      "website": "string",
      "industry": "string[]",
      "employerSize": "string",
      "headquarters": "GeoPoint",
      "officeLocations": [{
        "location": "GeoPoint",
        "address": "string",
        "isPrimary": "boolean"
      }],
      "socialMedia": {
        "linkedin": "string?",
        "twitter": "string?",
        "facebook": "string?"
      },
      "agencyDetails": {
        "establishedYear": "number",
        "clientList": "string[]",
        "serviceAreas": "string[]",
        "recruiterCount": "number"
      }
    }
  }
}
```

### 2. Jobs Collection (jobs/{jobId})
```json
{
  "id": "string",
  "employerId": "string",
  "title": "string",
  "description": "string",
  "requirements": "string[]",
  "responsibilities": "string[]",
  "location": {
    "type": "'remote' | 'onsite' | 'hybrid'",
    "locations": [{
      "address": "string",
      "coordinates": "GeoPoint"
    }]
  },
  "employmentType": "'full-time' | 'part-time' | 'contract' | 'internship'",
  "experienceLevel": "'entry' | 'mid' | 'senior' | 'executive'",
  "salary": {
    "amount": "number",
    "type": "'monthly' | 'annual'",
    "currency": "string",
    "isNegotiable": "boolean"
  },
  "skills": "string[]",
  "benefits": "string[]",
  "status": "'draft' | 'active' | 'paused' | 'closed'",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "expiresAt": "timestamp",
  "rightSwipeCount": "number",
  "views": "number"
}
```

### 3. Applications Collection (applications/{applicationId})
```json
{
  "id": "string",
  "jobId": "string",
  "jobSeekerId": "string",
  "employerId": "string",
  "status": "'pending' | 'matched' | 'rejected' | 'hired'",
  "appliedAt": "timestamp",
  "lastUpdated": "timestamp",
  "matchDetails": {
    "skillsMatched": "string[]",
    "experienceMatch": "boolean",
    "locationMatch": "boolean",
    "salaryMatch": "boolean"
  },
  "notes": [{
    "content": "string",
    "createdAt": "timestamp"
  }],
  "timeline": [{
    "status": "string",
    "timestamp": "timestamp"
  }]
}
```

### 4. Matches Collection (matches/{matchId})
```json
{
  "id": "string",
  "jobId": "string",
  "jobSeekerId": "string",
  "employerId": "string",
  "status": "'pending' | 'accepted' | 'rejected'",
  "createdAt": "timestamp",
  "matchCriteria": {
    "skillsMatch": "number",
    "locationMatch": "boolean",
    "experienceMatch": "boolean",
    "salaryMatch": "boolean"
  }
}
```

### 5. Chats Collection (chats/{chatId})
```json
{
  "id": "string",
  "participants": "string[]",
  "lastMessage": {
    "content": "string",
    "senderId": "string",
    "timestamp": "timestamp"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "jobId": "string?",
  "applicationId": "string?"
}
```

### 6. Notifications Collection (notifications/{notificationId})
```json
{
  "id": "string",
  "userId": "string",
  "type": "'match' | 'application' | 'message' | 'system'",
  "title": "string",
  "message": "string",
  "data": {
    "jobId": "string?",
    "applicationId": "string?",
    "chatId": "string?",
    "matchId": "string?"
  },
  "status": "'unread' | 'read'",
  "createdAt": "timestamp",
  "readAt": "timestamp?"
}
```

## Key Relationships
1. User (Employer) → Jobs (One-to-Many)
2. Job ←→ Applications (One-to-Many)
3. User (JobSeeker) → Applications (One-to-Many)
4. Users ←→ Chats (Many-to-Many)
5. Chat → Messages (One-to-Many)
6. User → Notifications (One-to-Many)