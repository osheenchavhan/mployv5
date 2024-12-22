/**
 * Authentication Middleware
 * 
 * This middleware verifies the Firebase ID token passed in the Authorization header
 * and attaches the decoded user information to the request object.
 */

const { admin } = require('../config/firebase');
const { APIError } = require('./error');

/**
 * Middleware to authenticate requests using Firebase ID tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {APIError} If authentication fails
 */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new APIError(401, 'No token provided');
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach the user info to the request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      // Add any other needed user info from the token
    };
    
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    next(new APIError(401, 'Authentication failed'));
  }
};

module.exports = authenticateUser;
