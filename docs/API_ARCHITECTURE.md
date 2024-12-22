# 🏗️ Mploy API Architecture Guide

## 📚 Overview
This guide explains our API architecture using the Jobs API as an example. We follow a three-layer architecture:
1. Routes (Controllers)
2. Models
3. Base Model (Database Interface)

## 🔧 Architecture Layers

### 1. Routes Layer (`/src/routes/jobs.js`) 🛣️
- Handles HTTP requests and responses
- Implements authentication middleware
- Validates input data
- Calls appropriate model methods
- Formats responses

Example:
```javascript
router.get('/employer/:employerId', authenticateUser, async (req, res, next) => {
  try {
    const jobs = await JobModel.getJobsByEmployer(req.params.employerId);
    res.json({ status: 'success', data: jobs });
  } catch (error) {
    next(error);
  }
});
```

### 2. Model Layer (`/src/models/job.model.js`) 📋
- Implements business logic
- Extends BaseModel for database operations
- Provides domain-specific methods
- Handles data transformations

Example:
```javascript
class JobModel extends BaseModel {
  async getJobsByEmployer(employerId, status = null) {
    const conditions = [
      { field: 'employerId', operator: '==', value: employerId }
    ];
    if (status) {
      conditions.push({ field: 'status', operator: '==', value: status });
    }
    return this.query(conditions);
  }
}
```

### 3. Base Model Layer (`/src/models/base.model.js`) 🗄️
- Provides generic database operations
- Handles connection with Firebase
- Implements common CRUD operations
- Manages timestamps and IDs

Example:
```javascript
class BaseModel {
  async query(conditions = [], limit = 10) {
    let query = this.collection;
    conditions.forEach(condition => {
      query = query.where(condition.field, condition.operator, condition.value);
    });
    return query.limit(limit).get();
  }
}
```

## 🔐 Authentication
- Uses Firebase Authentication
- Implemented in `/src/middleware/auth.js`
- Verifies JWT tokens
- Attaches user info to request

## 🚨 Error Handling
- Custom APIError class in `/src/middleware/error.js`
- Consistent error format across API
- Different handling for development and production
- Detailed logging for debugging

## 📝 Best Practices
1. Always use authentication middleware for protected routes
2. Log important operations and errors
3. Use conditions array for flexible querying
4. Keep business logic in models
5. Use base model for database operations
6. Handle errors consistently using APIError

## 🎯 Creating New APIs
1. Create a new route file in `/src/routes/`
2. Create a new model extending BaseModel
3. Implement required methods in the model
4. Add routes to `app.js`
5. Add proper error handling
6. Add detailed logging
7. Test thoroughly

## 📊 Example Flow
1. Client sends request to `/api/jobs/employer/:id`
2. Authentication middleware verifies token
3. Route handler calls JobModel
4. JobModel processes business logic
5. BaseModel executes database query
6. Results flow back up the chain
7. Response sent to client

## 🔍 Debugging Tips
1. Check logs at each layer
2. Verify authentication token
3. Check database queries
4. Validate input data
5. Check error handling
