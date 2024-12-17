const admin = require('firebase-admin');
require('dotenv').config();
const path = require('path');

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    const serviceAccount = require(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    console.log(' Firebase Admin initialized successfully');
  } catch (error) {
    console.error(' Error initializing Firebase Admin:', error);
    process.exit(1);
  }
};

module.exports = {
  admin,
  initializeFirebase
};
