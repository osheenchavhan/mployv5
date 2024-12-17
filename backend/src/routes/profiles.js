/**
 * Profile API Routes
 * 
 * Handles all profile-related operations including:
 * - Profile retrieval and updates
 * - Preference management
 * - Location updates
 * - Profile completion tracking
 * 
 * All routes require authentication
 */

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { handleUpload } = require('../middleware/upload');
const UserModel = require('../models/user.model');
const { APIError } = require('../middleware/error');
const ImageProcessor = require('../utils/image');

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (profile, userType) => {
  const fields = userType === 'jobSeeker' 
    ? ['name', 'phone', 'skills', 'experience', 'education', 'workHistory']
    : ['companyName', 'companyDescription', 'industry', 'employerSize', 'headquarters'];
  
  const completedFields = fields.filter(field => {
    const value = profile[field];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return value !== null;
    return !!value;
  });

  return Math.round((completedFields.length / fields.length) * 100);
};

/**
 * Get current user's profile
 * GET /api/profile
 */
router.get('/', authenticateUser, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.uid);
    if (!user) {
      throw new APIError(404, 'User profile not found');
    }

    // Calculate profile completion
    const profile = user[user.userType === 'jobSeeker' ? 'jobSeeker' : 'employer'].profile;
    const completionPercentage = calculateProfileCompletion(profile, user.userType);

    res.json({
      status: 'success',
      data: {
        ...user,
        completionPercentage
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update user profile
 * PUT /api/profile
 */
router.put('/', authenticateUser, async (req, res, next) => {
  try {
    const { userType } = req.user;
    
    // Validate required fields based on user type
    if (userType === 'jobSeeker') {
      const { name, phone } = req.body;
      if (!name || !phone) {
        throw new APIError(400, 'Name and phone are required for job seekers');
      }
    } else if (userType === 'employer') {
      const { companyName } = req.body;
      if (!companyName) {
        throw new APIError(400, 'Company name is required for employers');
      }
    }

    const updatedUser = await UserModel.updateProfile(
      req.user.uid,
      req.body,
      userType
    );

    // Calculate new completion percentage
    const profile = updatedUser[userType === 'jobSeeker' ? 'jobSeeker' : 'employer'].profile;
    const completionPercentage = calculateProfileCompletion(profile, userType);

    res.json({
      status: 'success',
      data: {
        ...updatedUser,
        completionPercentage
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get user preferences
 * GET /api/profile/preferences
 */
router.get('/preferences', authenticateUser, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.uid);
    if (!user) {
      throw new APIError(404, 'User profile not found');
    }

    const preferences = req.user.userType === 'jobSeeker'
      ? {
          searchRadius: user.jobSeeker.searchRadius,
          preferredLocations: user.jobSeeker.profile.preferredLocations,
          willingToRelocate: user.jobSeeker.profile.willingToRelocate,
          preferredSalary: user.jobSeeker.profile.preferredSalary
        }
      : {
          locations: user.employer.profile.officeLocations,
          industry: user.employer.profile.industry
        };

    res.json({
      status: 'success',
      data: preferences
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update user preferences
 * PUT /api/profile/preferences
 */
router.put('/preferences', authenticateUser, async (req, res, next) => {
  try {
    const { userType } = req.user;
    const updatePath = userType === 'jobSeeker' ? 'jobSeeker.profile' : 'employer.profile';
    
    // Validate preference data based on user type
    if (userType === 'jobSeeker') {
      const { searchRadius, preferredLocations, willingToRelocate, preferredSalary } = req.body;
      if (searchRadius && (searchRadius < 1 || searchRadius > 500)) {
        throw new APIError(400, 'Search radius must be between 1 and 500 km');
      }
    }

    const updatedUser = await UserModel.updateProfile(
      req.user.uid,
      req.body,
      userType
    );

    res.json({
      status: 'success',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update user location
 * PUT /api/profile/location
 */
router.put('/location', authenticateUser, async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    
    // Validate coordinates
    if (!latitude || !longitude || 
        latitude < -90 || latitude > 90 || 
        longitude < -180 || longitude > 180) {
      throw new APIError(400, 'Invalid coordinates');
    }

    const updatedUser = await UserModel.updateLocation(
      req.user.uid,
      latitude,
      longitude,
      req.user.userType
    );

    res.json({
      status: 'success',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Upload profile image
 * POST /api/profile/image
 */
router.post('/image', authenticateUser, handleUpload, async (req, res, next) => {
  try {
    // Process and upload image
    const { buffer } = req.file;
    const { uid } = req.user;

    // Get current image paths for cleanup
    const currentPaths = await UserModel.getCurrentImagePaths(uid);

    // Process and upload new image
    const { profileUrl, thumbnailUrl, paths } = await ImageProcessor.processProfileImage(buffer, uid);

    // Update user profile with new image URLs
    const updatedUser = await UserModel.updateProfileImage(uid, 
      { profileUrl, thumbnailUrl }, 
      paths
    );

    // Clean up old images if they exist
    if (currentPaths) {
      await ImageProcessor.deleteOldImages([
        currentPaths.profile,
        currentPaths.thumbnail
      ]);
    }

    res.json({
      status: 'success',
      data: {
        profileImage: profileUrl,
        profileThumbnail: thumbnailUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
