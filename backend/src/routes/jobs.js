/**
 * Jobs API Routes
 * 
 * This file handles all the job-related API endpoints in our app.
 * Think of it as the traffic controller for job operations like:
 * - Creating new jobs
 * - Finding jobs near you
 * - Getting job details
 * - Updating job posts
 * - Removing job listings
 * 
 * We use these routes in combination with our JobModel to manage
 * all the job data in Firebase.
 * 
 * Important: All routes need authentication except for public job searches
 */

const express = require('express');
const router = express.Router();
const  authenticateUser  = require('../middleware/auth');
const JobModel = require('../models/job.model');
const { APIError } = require('../middleware/error');

// Helper function to check if user is an employer
const isEmployer = (req) => {
  return req.user && req.user.userType === 'employer';
};

/**
 * Create a new job posting
 * POST /api/jobs
 * Only employers can create jobs
 */
router.post('/', authenticateUser, async (req, res, next) => {
  try {
    // Check if user is an employer
    if (!isEmployer(req)) {
      throw new APIError(403, 'Only employers can create job posts');
    }

    // Add the employer's ID to the job data
    const jobData = {
      ...req.body,
      employerId: req.user.uid
    };

    // Create the job using our JobModel
    const job = await JobModel.createJob(jobData);
    
    res.status(201).json({
      status: 'success',
      data: job
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all jobs (with filters)
 * GET /api/jobs
 * Public route - anyone can search jobs
 * 
 * Query parameters:
 * - lat: latitude for location search
 * - lng: longitude for location search
 * - radius: search radius in km (default: 50)
 * - type: job type (full-time, part-time, etc.)
 * - experience: experience level
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      lat,
      lng,
      radius = 50,
      type,
      experience,
      minSalary,
      maxSalary
    } = req.query;

    // If location is provided, do a location-based search
    if (lat && lng) {
      const filters = {
        status: 'active',
        employmentType: type,
        experienceLevel: experience,
        salary: minSalary || maxSalary ? {
          min: minSalary,
          max: maxSalary
        } : null
      };

      const jobs = await JobModel.getNearbyJobs(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(radius),
        filters
      );

      return res.json({
        status: 'success',
        data: jobs
      });
    }

    // If no location, just get active jobs with filters
    const jobs = await JobModel.query([
      { field: 'status', operator: '==', value: 'active' },
      ...(type ? [{ field: 'employmentType', operator: '==', value: type }] : []),
      ...(experience ? [{ field: 'experienceLevel', operator: '==', value: experience }] : [])
    ]);

    res.json({
      status: 'success',
      data: jobs
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get a specific job's details
 * GET /api/jobs/:id
 * Public route - anyone can view job details
 */
router.get('/:id', async (req, res, next) => {
  try {
    const job = await JobModel.findById(req.params.id);
    
    if (!job) {
      throw new APIError(404, 'Job not found');
    }

    // Increment view count
    await JobModel.incrementViews(req.params.id);

    res.json({
      status: 'success',
      data: job
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update a job posting
 * PUT /api/jobs/:id
 * Only the employer who created the job can update it
 */
router.put('/:id', authenticateUser, async (req, res, next) => {
  try {
    // First get the job to check ownership
    const job = await JobModel.findById(req.params.id);
    
    if (!job) {
      throw new APIError(404, 'Job not found');
    }

    // Check if this user owns the job
    if (job.employerId !== req.user.uid) {
      throw new APIError(403, 'You can only update your own job posts');
    }

    // Update the job
    const updatedJob = await JobModel.update(req.params.id, req.body);

    res.json({
      status: 'success',
      data: updatedJob
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a job posting
 * DELETE /api/jobs/:id
 * Only the employer who created the job can delete it
 */
router.delete('/:id', authenticateUser, async (req, res, next) => {
  try {
    // First get the job to check ownership
    const job = await JobModel.findById(req.params.id);
    
    if (!job) {
      throw new APIError(404, 'Job not found');
    }

    // Check if this user owns the job
    if (job.employerId !== req.user.uid) {
      throw new APIError(403, 'You can only delete your own job posts');
    }

    // Instead of actually deleting, we'll mark it as closed
    await JobModel.updateStatus(req.params.id, 'closed');

    res.json({
      status: 'success',
      message: 'Job post has been closed'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all jobs for a specific employer
 * GET /api/jobs/employer/:employerId
 * @route GET /api/jobs/employer/:employerId
 * @param {string} employerId.path.required - ID of the employer
 * @param {string} [status] - Optional status filter (active, closed, etc.)
 * @returns {Object} { status: 'success', data: Array of job objects }
 * @throws {APIError} 403 - If user tries to access another employer's jobs
 * @throws {APIError} 500 - If there's a server error
 */
router.get('/employer/:employerId', authenticateUser, async (req, res, next) => {
  console.log('[JobsRoute] Request received:', { 
    employerId: req.params.employerId, 
    userId: req.user.uid,
    status: req.query.status 
  });
  try {
    // Check if user is requesting their own jobs
    if (req.user.uid !== req.params.employerId) {
      console.warn('[JobsRoute] Auth failed - mismatched IDs:', {
        requestedId: req.params.employerId,
        userId: req.user.uid
      });
      throw new APIError(403, 'You can only view your own job posts');
    }

    const { status } = req.query;
    const jobs = await JobModel.getJobsByEmployer(req.params.employerId, status);
    console.log('[JobsRoute] Jobs fetched successfully:', { count: jobs.length });
    
    res.json({
      status: 'success',
      data: jobs
    });
  } catch (error) {
    console.error('[JobsRoute] Error occurred:', {
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
});

module.exports = router;
