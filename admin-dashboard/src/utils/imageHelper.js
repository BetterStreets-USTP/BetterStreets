// Image URL Helper for Admin Dashboard
// Use this to ensure consistent image URLs across the app

const API_BASE_URL = 'http://localhost:3000';

/**
 * Get full image URL from path
 * @param {string} path - Image path from database (e.g., "/uploads/photo.jpg")
 * @returns {string} - Full URL to image
 */
export const getImageUrl = (path) => {
  if (!path) {
    console.warn('getImageUrl: No path provided');
    return null;
  }
  
  // If path already has http, return as is
  if (path.startsWith('http')) {
    console.log('getImageUrl: Using full URL:', path);
    return path;
  }
  
  // If path doesn't start with /, add it
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${API_BASE_URL}${cleanPath}`;
  
  console.log('getImageUrl: Generated URL:', fullUrl, 'from path:', path);
  return fullUrl;
};

/**
 * Get placeholder image URL
 * @param {string} text - Text to display in placeholder
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = (text = 'No Image') => {
  return `https://via.placeholder.com/400x300?text=${encodeURIComponent(text)}`;
};

/**
 * Handle image error - returns placeholder
 * @param {Event} e - Image error event
 * @param {string} fallbackText - Text for fallback placeholder
 */
export const handleImageError = (e, fallbackText = 'Image Not Found') => {
  e.target.onerror = null; // Prevent infinite loop
  e.target.src = getPlaceholderImage(fallbackText);
};

export default {
  getImageUrl,
  getPlaceholderImage,
  handleImageError
};
