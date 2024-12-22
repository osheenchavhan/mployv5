const BaseModel = require('./base.model');
const { admin } = require('../config/firebase');

class JobModel extends BaseModel {
  constructor() {
    super('jobs');
  }

  // Create a new job
  async createJob(jobData) {
    const job = {
      employerId: jobData.employerId,
      title: jobData.title,
      description: jobData.description,
      requirements: jobData.requirements || [],
      responsibilities: jobData.responsibilities || [],
      location: {
        type: jobData.locationType || 'onsite',
        locations: jobData.locations.map(loc => ({
          address: loc.address,
          coordinates: new admin.firestore.GeoPoint(loc.latitude, loc.longitude)
        }))
      },
      employmentType: jobData.employmentType,
      experienceLevel: jobData.experienceLevel,
      salary: {
        amount: jobData.salary.amount,
        type: jobData.salary.type || 'monthly',
        currency: jobData.salary.currency || 'INR',
        isNegotiable: jobData.salary.isNegotiable || false
      },
      skills: jobData.skills || [],
      benefits: jobData.benefits || [],
      status: 'active',
      rightSwipeCount: 0,
      views: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      )
    };

    return this.create(job);
  }

    // Get jobs by employer
    async getJobsByEmployer(employerId, status = null) {
      console.log('[JobModel] Starting query:', { employerId, status });
      try {
        const conditions = [{ field: 'employerId', operator: '==', value: employerId }];
        
        if (status) {
          console.log('[JobModel] Applying status filter:', status);
          conditions.push({ field: 'status', operator: '==', value: status });
        }
  
        const jobs = await this.query(conditions);
        console.log('[JobModel] Query results:', { documentCount: jobs.length });
  
        return jobs;
      } catch (error) {
        console.error('[JobModel] Query failed:', {
          error: error.message,
          employerId,
          status
        });
        throw error;
      }
    }
  

  // Get nearby jobs
  async getNearbyJobs(latitude, longitude, radius, filters = {}, limit = 10) {
    const location = { latitude, longitude };
    const jobs = await this.geoQuery(location, radius, limit);

    return jobs.filter(job => {
      // Apply status filter
      if (filters.status && job.status !== filters.status) return false;

      // Apply employment type filter
      if (filters.employmentType && job.employmentType !== filters.employmentType) return false;

      // Apply experience level filter
      if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) return false;

      // Apply salary range filter
      if (filters.salary) {
        const { min, max } = filters.salary;
        if (min && job.salary.amount < min) return false;
        if (max && job.salary.amount > max) return false;
      }

      // Apply skills filter
      if (filters.skills && filters.skills.length > 0) {
        const hasRequiredSkills = filters.skills.every(skill => 
          job.skills.includes(skill)
        );
        if (!hasRequiredSkills) return false;
      }

      return true;
    });
  }

  // Update job status
  async updateStatus(jobId, status) {
    return this.update(jobId, { status });
  }

  // Increment view count
  async incrementViews(jobId) {
    await this.collection.doc(jobId).update({
      views: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // Increment right swipe count
  async incrementRightSwipes(jobId) {
    await this.collection.doc(jobId).update({
      rightSwipeCount: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

module.exports = new JobModel();
