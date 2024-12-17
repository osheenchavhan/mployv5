const admin = require('firebase-admin');
const serviceAccount = require('../backend/src/config/mploy-b2395-firebase-adminsdk-rzsvw-fab609539f.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateDatabase() {
  try {
    // 1. Get all users
    const usersSnapshot = await db.collection('users').get();
    const jobSeekerProfilesSnapshot = await db.collection('jobSeekerProfiles').get();
    const jobsSnapshot = await db.collection('jobs').get();

    // Create a map of jobSeeker profiles for quick lookup
    const profilesMap = new Map();
    jobSeekerProfilesSnapshot.forEach(doc => {
      profilesMap.set(doc.id, doc.data());
    });

    // Batch updates for better performance
    const batch = db.batch();

    // 2. Migrate Users Collection
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userRef = db.collection('users').doc(userDoc.id);
      
      // Base user object with new schema
      const updatedUser = {
        ...userData,
        emailVerified: userData.emailVerified || false,
        lastLoginAt: userData.lastLoginAt || admin.firestore.Timestamp.now(),
        status: userData.status || 'active',
        updatedAt: admin.firestore.Timestamp.now()
      };

      // Add type-specific profile data
      if (userData.userType === 'jobseeker') {
        const profile = profilesMap.get(userDoc.id);
        if (profile) {
          updatedUser.jobSeeker = {
            currentLocation: new admin.firestore.GeoPoint(
              profile.location?.latitude || 0,
              profile.location?.longitude || 0
            ),
            searchRadius: 50, // Default value in kilometers
            profile: {
              name: profile.fullName || '',
              phone: profile.phone || '',
              skills: [...(profile.skills || []), ...(profile.languages || [])],
              experience: parseInt(profile.experience) || 0,
              education: profile.education ? [{
                degree: profile.education,
                institution: '',
                year: new Date().getFullYear()
              }] : [],
              workHistory: [],
              preferredLocations: [
                new admin.firestore.GeoPoint(
                  profile.location?.latitude || 0,
                  profile.location?.longitude || 0
                )
              ],
              willingToRelocate: false,
              preferredSalary: {
                amount: parseInt(profile.expectedSalary?.replace(/[^0-9]/g, '')) || 0,
                type: 'monthly',
                currency: 'INR',
                isNegotiable: true
              }
            }
          };
        }
      } else if (userData.userType === 'employer') {
        updatedUser.employer = {
          employerType: 'direct',
          profile: {
            companyName: userData.companyName || '',
            companyLogo: userData.companyLogo || '',
            companyDescription: userData.about || '',
            website: '',
            industry: [],
            employerSize: '',
            headquarters: new admin.firestore.GeoPoint(0, 0),
            officeLocations: [],
            socialMedia: {}
          }
        };
      }

      batch.set(userRef, updatedUser, { merge: true });
    }

    // 3. Migrate Jobs Collection
    for (const jobDoc of jobsSnapshot.docs) {
      const jobData = jobDoc.data();
      const jobRef = db.collection('jobs').doc(jobDoc.id);

      const updatedJob = {
        ...jobData,
        location: {
          type: jobData.type || 'onsite',
          locations: [{
            address: jobData.location || '',
            coordinates: new admin.firestore.GeoPoint(0, 0)
          }]
        },
        employmentType: jobData.employmentType || 'full-time',
        experienceLevel: jobData.experienceLevel || 'mid',
        salary: {
          amount: typeof jobData.salary === 'string' 
            ? parseInt(jobData.salary.replace(/[^0-9]/g, '')) || 0
            : typeof jobData.salary === 'number' 
              ? jobData.salary 
              : typeof jobData.salary?.amount === 'number'
                ? jobData.salary.amount
                : 0,
          type: jobData.salary?.type || 'monthly',
          currency: jobData.salary?.currency || 'INR',
          isNegotiable: jobData.salary?.isNegotiable || true
        },
        skills: jobData.requirements || [],
        benefits: [],
        status: jobData.status || 'active',
        rightSwipeCount: 0,
        views: 0,
        updatedAt: admin.firestore.Timestamp.now()
      };

      batch.set(jobRef, updatedJob, { merge: true });
    }

    // Commit all changes
    await batch.commit();

    console.log('Migration completed successfully!');

    // Optional: Delete old jobSeekerProfiles collection
    const deletePromises = jobSeekerProfilesSnapshot.docs.map(doc => 
      doc.ref.delete()
    );
    await Promise.all(deletePromises);
    console.log('Cleaned up old jobSeekerProfiles collection');

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateDatabase()
  .then(() => {
    console.log('Database migration completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });