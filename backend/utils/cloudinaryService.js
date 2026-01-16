import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Object>} - Upload result
 */
export const uploadToCloudinary = async (filePath, folder = 'nexora') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    })
    
    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} - Delete result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image from Cloudinary')
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param {Array} filePaths - Array of file paths to upload
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Array>} - Array of upload results
 */
export const uploadMultipleToCloudinary = async (filePaths, folder = 'nexora') => {
  try {
    const uploadPromises = filePaths.map(filePath => 
      uploadToCloudinary(filePath, folder)
    )
    
    const results = await Promise.all(uploadPromises)
    return results
  } catch (error) {
    console.error('Multiple upload error:', error)
    throw new Error('Failed to upload multiple images to Cloudinary')
  }
}

export default cloudinary