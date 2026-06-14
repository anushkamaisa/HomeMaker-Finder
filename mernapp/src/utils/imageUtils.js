/**
 * Global utility for resolving image paths to the backend server.
 * Handles environment-based base URLs and fallback SVGs for broken images.
 */

// The backend base URL from environment variables
const BACKEND_URL = process.env.REACT_APP_API_URL;

/**
 * Bulletproof SVG fallback image - "Image Unavailable" placeholder.
 * Does not require any network request as it is a base64 Data URI.
 */
export const FALLBACK_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23F3F4F6'/%3E%3Ctext x='150' y='90' font-family='sans-serif' font-size='48' text-anchor='middle'%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3Ctext x='150' y='130' font-family='sans-serif' font-size='14' fill='%236B7280' text-anchor='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E`;

/**
 * Resolves a raw image value into a fully qualified URL or Data URI.
 * Handles: full URLs, relative paths (/uploads/...), and various field name conventions.
 * 
 * @param {string|object} input - The raw image string or the entire object to inspect.
 */
export const resolveImageSrc = (input) => {
  if (!input) return FALLBACK_IMAGE;

  // If passed an object, try to find an image field automatically
  let raw = typeof input === 'string' ? input : (input.img || input.image || input.imageUrl || input.profilePic || null);
  
  if (!raw) return FALLBACK_IMAGE;

  // Already a full URL (http/https or data URI)
  if (raw.startsWith('http') || raw.startsWith('data:')) return raw;

  // Relative path from backend (e.g. "/uploads/abc.jpg")
  // Ensure we don't double up on slashes
  const cleanPath = raw.startsWith('/') ? raw : `/${raw}`;
  return `${BACKEND_URL}${cleanPath}`;
};

/**
 * Generic onError handler to show the fallback image.
 * Usage: <img src={...} onError={handleImageError} />
 */
export const handleImageError = (e) => {
  if (e.target.src !== FALLBACK_IMAGE) {
    console.warn(`[ImageUtils] Failed to load image: ${e.target.src}. Using fallback.`);
    e.target.src = FALLBACK_IMAGE;
  }
};
