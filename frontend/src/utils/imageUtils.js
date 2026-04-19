import { API_BASE_URL } from '../api/axiosConfig'

/**
 * Encode each path segment so spaces, parentheses, etc. work in browsers.
 * Unencoded spaces break CSS `url(...)` (used on car cards) and can confuse URL parsing.
 */
function encodeUploadPath(imagePath) {
  return imagePath
    .split(/[/\\]/)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

/**
 * Full URL for a stored upload filename/path (served at /api/uploads/**).
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  return `${API_BASE_URL}/uploads/${encodeUploadPath(imagePath)}`
}
