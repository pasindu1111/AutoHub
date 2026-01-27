/**
 * Image URL utility for constructing proper image URLs with API prefix
 * 
 * The backend serves images from /uploads/** but requires /api prefix due to context-path
 * configuration in application.yml (server.servlet.context-path: /api)
 */

const BASE_URL = 'http://localhost:8080/api'

/**
 * Constructs the full URL for an image path
 * @param {string} imagePath - The relative image path (e.g., "uuid-filename.jpg")
 * @returns {string|null} Full image URL or null if no path provided
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    return `${BASE_URL}/uploads/${imagePath}`
}

/**
 * For production deployment, update BASE_URL to match your production API endpoint
 * Example: const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'
 */
