const BaseModel = require('./base.model');
const { admin } = require('../config/firebase');

class MatchModel extends BaseModel {
  constructor() {
    super('matches');
  }

  // Create a new match
  async createMatch(matchData) {
    const match = {
      jobId: matchData.jobId,
      jobSeekerId: matchData.jobSeekerId,
      employerId: matchData.employerId,
      status: 'pending',
      matchCriteria: {
        skillsMatch: matchData.skillsMatch || 0,
        locationMatch: matchData.locationMatch || false,
        experienceMatch: matchData.experienceMatch || false,
        salaryMatch: matchData.salaryMatch || false
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    return this.create(match);
  }

  // Get matches by job seeker
  async getMatchesByJobSeeker(jobSeekerId, status = null) {
    const conditions = [
      { field: 'jobSeekerId', operator: '==', value: jobSeekerId }
    ];

    if (status) {
      conditions.push({ field: 'status', operator: '==', value: status });
    }

    return this.query(conditions);
  }

  // Get matches by employer
  async getMatchesByEmployer(employerId, status = null) {
    const conditions = [
      { field: 'employerId', operator: '==', value: employerId }
    ];

    if (status) {
      conditions.push({ field: 'status', operator: '==', value: status });
    }

    return this.query(conditions);
  }

  // Get matches by job
  async getMatchesByJob(jobId, status = null) {
    const conditions = [
      { field: 'jobId', operator: '==', value: jobId }
    ];

    if (status) {
      conditions.push({ field: 'status', operator: '==', value: status });
    }

    return this.query(conditions);
  }

  // Update match status
  async updateMatchStatus(matchId, status) {
    return this.update(matchId, { 
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // Check if match exists
  async checkMatchExists(jobId, jobSeekerId) {
    const matches = await this.query([
      { field: 'jobId', operator: '==', value: jobId },
      { field: 'jobSeekerId', operator: '==', value: jobSeekerId }
    ], 1);

    return matches.length > 0 ? matches[0] : null;
  }

  // Calculate match score
  calculateMatchScore(job, jobSeeker) {
    let score = 0;
    const criteria = {
      skillsMatch: 0,
      locationMatch: false,
      experienceMatch: false,
      salaryMatch: false
    };

    // Skills match (30% weight)
    const matchingSkills = job.skills.filter(skill => 
      jobSeeker.jobSeeker.profile.skills.includes(skill)
    );
    criteria.skillsMatch = (matchingSkills.length / job.skills.length) * 100;
    score += (criteria.skillsMatch * 0.3);

    // Experience match (25% weight)
    const expMatch = jobSeeker.jobSeeker.profile.experience >= job.experienceLevel;
    criteria.experienceMatch = expMatch;
    score += expMatch ? 25 : 0;

    // Location match (25% weight)
    const jobLocation = job.location.locations[0].coordinates;
    const seekerLocation = jobSeeker.jobSeeker.currentLocation;
    const distance = this.calculateDistance(
      jobLocation.latitude,
      jobLocation.longitude,
      seekerLocation.latitude,
      seekerLocation.longitude
    );
    criteria.locationMatch = distance <= jobSeeker.jobSeeker.searchRadius;
    score += criteria.locationMatch ? 25 : 0;

    // Salary match (20% weight)
    const salaryMatch = this.checkSalaryMatch(job.salary, jobSeeker.jobSeeker.profile.preferredSalary);
    criteria.salaryMatch = salaryMatch;
    score += salaryMatch ? 20 : 0;

    return { score, criteria };
  }

  // Helper: Calculate distance between two points
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Helper: Convert degrees to radians
  toRad(degrees) {
    return degrees * Math.PI / 180;
  }

  // Helper: Check salary match
  checkSalaryMatch(jobSalary, seekerSalary) {
    if (seekerSalary.isNegotiable) return true;
    
    // Convert both salaries to annual if needed
    const jobAnnual = jobSalary.type === 'monthly' ? jobSalary.amount * 12 : jobSalary.amount;
    const seekerAnnual = seekerSalary.type === 'monthly' ? seekerSalary.amount * 12 : seekerSalary.amount;
    
    // Allow for a 10% variance
    const minAcceptable = seekerAnnual * 0.9;
    return jobAnnual >= minAcceptable;
  }
}

module.exports = new MatchModel();
