const BaseModel = require('./base.model');
const { admin } = require('../config/firebase');

class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  // Create a new user with type-specific profile
  async createUser(userData, userType) {
    const baseData = {
      userType,
      email: userData.email,
      emailVerified: false,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add type-specific data
    if (userType === 'jobSeeker') {
      baseData.jobSeeker = {
        currentLocation: new admin.firestore.GeoPoint(
          userData.latitude || 0,
          userData.longitude || 0
        ),
        searchRadius: userData.searchRadius || 50,
        profile: {
          name: userData.name,
          phone: userData.phone,
          skills: [],
          experience: 0,
          education: [],
          workHistory: [],
          preferredLocations: [],
          willingToRelocate: false,
          preferredSalary: {
            amount: 0,
            type: 'monthly',
            currency: 'INR',
            isNegotiable: true
          }
        }
      };
    } else if (userType === 'employer') {
      baseData.employer = {
        employerType: userData.employerType || 'direct',
        profile: {
          companyName: userData.companyName,
          companyLogo: '',
          companyDescription: '',
          website: '',
          industry: [],
          employerSize: '',
          headquarters: new admin.firestore.GeoPoint(
            userData.latitude || 0,
            userData.longitude || 0
          ),
          officeLocations: [],
          socialMedia: {
            linkedin: '',
            twitter: '',
            facebook: ''
          }
        }
      };

      if (userData.employerType === 'agency') {
        baseData.employer.profile.agencyDetails = {
          establishedYear: new Date().getFullYear(),
          clientList: [],
          serviceAreas: [],
          recruiterCount: 0
        };
      }
    }

    // Create user in Firestore
    const userRef = this.collection.doc(userData.uid);
    await userRef.set(baseData);

    return { id: userData.uid, ...baseData };
  }

  // Update user profile
  async updateProfile(userId, profileData, userType) {
    const updatePath = userType === 'jobSeeker' ? 'jobSeeker.profile' : 'employer.profile';
    const updates = {};
    
    Object.keys(profileData).forEach(key => {
      updates[`${updatePath}.${key}`] = profileData[key];
    });
    
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    await this.collection.doc(userId).update(updates);
    return this.findById(userId);
  }

  // Update user location
  async updateLocation(userId, latitude, longitude, userType) {
    const location = new admin.firestore.GeoPoint(latitude, longitude);
    const updatePath = userType === 'jobSeeker' ? 'jobSeeker.currentLocation' : 'employer.profile.headquarters';
    
    await this.collection.doc(userId).update({
      [updatePath]: location,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return this.findById(userId);
  }

  // Get nearby users
  async getNearbyUsers(latitude, longitude, radius, userType, limit = 10) {
    const location = { latitude, longitude };
    const users = await this.geoQuery(location, radius, limit);
    
    return users.filter(user => user.userType === userType);
  }

  // Update user profile image
  async updateProfileImage(userId, imageUrls, imagePaths) {
    const user = await this.findById(userId);
    if (!user) throw new Error('User not found');

    // Get the path to update based on user type
    const profilePath = user.userType === 'jobSeeker' ? 'jobSeeker.profile' : 'employer.profile';

    // Store new image URLs
    const updates = {
      [`${profilePath}.profileImage`]: imageUrls.profileUrl,
      [`${profilePath}.profileThumbnail`]: imageUrls.thumbnailUrl,
      [`${profilePath}.imagePaths`]: imagePaths,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await this.collection.doc(userId).update(updates);
    return this.findById(userId);
  }

  // Get user's current image paths
  async getCurrentImagePaths(userId) {
    const user = await this.findById(userId);
    if (!user) return null;

    const profile = user[user.userType === 'jobSeeker' ? 'jobSeeker' : 'employer'].profile;
    return profile.imagePaths || null;
  }
}

module.exports = new UserModel();
