/**
 * File Upload Middleware
 * 
 * Handles file uploads with:
 * - Size limits
 * - Format validation
 * - Error handling
 */

const multer = require('multer');
const { APIError } = require('./error');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      return cb(new APIError(400, 'Only image files are allowed'));
    }

    // Allow specific formats
    const allowedFormats = ['jpeg', 'jpg', 'png', 'webp'];
    const format = file.mimetype.split('/')[1];
    if (!allowedFormats.includes(format)) {
      return cb(new APIError(400, `Invalid image format. Allowed formats: ${allowedFormats.join(', ')}`));
    }

    cb(null, true);
  }
});

// Middleware for handling profile image uploads
const uploadProfileImage = upload.single('image');

// Error handling wrapper
const handleUpload = (req, res, next) => {
  uploadProfileImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new APIError(400, 'File size too large. Maximum size is 5MB'));
      }
      return next(new APIError(400, err.message));
    } else if (err) {
      return next(err);
    }
    
    // Check if file exists
    if (!req.file) {
      return next(new APIError(400, 'No image file provided'));
    }
    
    next();
  });
};

module.exports = {
  handleUpload
};
