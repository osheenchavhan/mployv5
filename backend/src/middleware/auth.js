const { admin } = require('../config/firebase');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: 'error',
        message: 'No token provided' 
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      userType: decodedToken.userType
    };
    
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ 
      status: 'error',
      message: 'Invalid or expired token' 
    });
  }
};

module.exports = {
  authenticateUser
};
