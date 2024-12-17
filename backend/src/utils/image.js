/**
 * Image Processing Utilities
 * 
 * Handles image processing operations like:
 * - Resizing
 * - Format conversion
 * - Optimization
 * - Cleanup
 */

const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { admin } = require('../config/firebase');
const path = require('path');

const PROFILE_IMAGE_SIZE = 400;
const THUMBNAIL_SIZE = 100;
const ALLOWED_FORMATS = ['jpeg', 'jpg', 'png', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

class ImageProcessor {
  constructor() {
    this.bucket = admin.storage().bucket();
  }

  /**
   * Process and upload profile image
   * @param {Buffer} buffer - Image buffer
   * @param {string} userId - User ID
   * @returns {Promise<Object>} URLs for profile image and thumbnail
   */
  async processProfileImage(buffer, userId) {
    try {
      // Get image metadata
      const metadata = await sharp(buffer).metadata();
      
      if (!ALLOWED_FORMATS.includes(metadata.format)) {
        throw new Error('Invalid image format. Allowed formats: ' + ALLOWED_FORMATS.join(', '));
      }

      // Generate unique filename
      const filename = `${userId}_${uuidv4()}`;
      
      // Process main profile image
      const profileImage = await this.resizeImage(buffer, PROFILE_IMAGE_SIZE);
      const profileImagePath = `profile-images/${filename}.webp`;
      
      // Process thumbnail
      const thumbnail = await this.resizeImage(buffer, THUMBNAIL_SIZE);
      const thumbnailPath = `profile-images/thumbnails/${filename}.webp`;

      // Upload both images
      const [profileUrl] = await this.uploadImage(profileImage, profileImagePath);
      const [thumbnailUrl] = await this.uploadImage(thumbnail, thumbnailPath);

      return {
        profileUrl,
        thumbnailUrl,
        paths: {
          profile: profileImagePath,
          thumbnail: thumbnailPath
        }
      };
    } catch (error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  /**
   * Resize image to specified size
   * @param {Buffer} buffer - Image buffer
   * @param {number} size - Target size
   * @returns {Promise<Buffer>}
   */
  async resizeImage(buffer, size) {
    return sharp(buffer)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toBuffer();
  }

  /**
   * Upload image to Firebase Storage
   * @param {Buffer} buffer - Image buffer
   * @param {string} path - Storage path
   * @returns {Promise<string>} Public URL
   */
  async uploadImage(buffer, path) {
    const file = this.bucket.file(path);
    
    const options = {
      metadata: {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000' // Cache for 1 year
      }
    };

    await file.save(buffer, options);
    return file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500' // Far future expiration
    });
  }

  /**
   * Delete old profile images
   * @param {string[]} paths - Array of file paths to delete
   */
  async deleteOldImages(paths) {
    try {
      const deletePromises = paths.map(path => {
        const file = this.bucket.file(path);
        return file.delete().catch(() => {
          // Ignore errors if file doesn't exist
          console.log(`Failed to delete file: ${path}`);
        });
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting old images:', error);
    }
  }
}

module.exports = new ImageProcessor();
