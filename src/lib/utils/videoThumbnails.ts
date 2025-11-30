/**
 * Utility functions to extract thumbnails from video URLs
 */

/**
 * Extract YouTube video ID from URL
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Handle YouTube Shorts format
  const shortsMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }
  
  // Handle standard YouTube URL formats
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|u\/\w\/|.*[&?]v=))([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

/**
 * Get YouTube thumbnail URL from video ID or URL
 * Returns high quality thumbnail (maxresdefault) or fallback to hqdefault
 */
export function getYouTubeThumbnail(videoIdOrUrl: string, quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' | 'sddefault' = 'maxresdefault'): string | null {
  const videoId = videoIdOrUrl.length === 11 ? videoIdOrUrl : getYouTubeVideoId(videoIdOrUrl);
  if (!videoId) return null;
  
  // Try maxresdefault first (highest quality), fallback to hqdefault
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Extract Instagram post/reel ID from URL
 */
export function getInstagramPostId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
  return match && match[1] ? match[1] : null;
}

/**
 * Get Instagram thumbnail URL (using oEmbed or direct image)
 * Note: Instagram doesn't provide direct thumbnail URLs easily
 * This returns the oEmbed endpoint which can be used to fetch thumbnail
 */
export function getInstagramThumbnailUrl(postIdOrUrl: string): string | null {
  const postId = getInstagramPostId(postIdOrUrl) || (postIdOrUrl.match(/^[a-zA-Z0-9_-]+$/) ? postIdOrUrl : null);
  if (!postId) return null;
  
  // Instagram oEmbed endpoint - returns JSON with thumbnail_url
  // Note: This requires server-side fetching, but we return the endpoint
  return `https://api.instagram.com/oembed/?url=https://www.instagram.com/p/${postId}/&format=json`;
}

/**
 * Get thumbnail URL for any video platform
 * Returns provided thumbnail, or auto-generated from video URL
 */
export function getVideoThumbnail(
  url: string,
  platform: 'youtube' | 'instagram',
  providedThumbnail?: string
): string {
  // If thumbnail is provided, use it
  if (providedThumbnail) {
    return providedThumbnail;
  }
  
  // Auto-generate thumbnail from URL
  if (platform === 'youtube') {
    const thumbnail = getYouTubeThumbnail(url);
    return thumbnail || '';
  }
  
  if (platform === 'instagram') {
    // Instagram thumbnails require oEmbed API call
    // For now, return empty string - will be handled by embed
    return '';
  }
  
  return '';
}

