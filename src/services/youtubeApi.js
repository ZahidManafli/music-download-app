import axios from 'axios';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// Create axios instance for YouTube API
const youtubeApi = axios.create({
  baseURL: YOUTUBE_API_BASE,
  params: {
    key: API_KEY,
  },
});

// Parse ISO 8601 duration to seconds
const parseDuration = (isoDuration) => {
  if (!isoDuration) return 0;
  
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  
  return hours * 3600 + minutes * 60 + seconds;
};

// Format view count (1234567 -> "1.2M")
export const formatViewCount = (count) => {
  if (!count) return '0 views';
  const num = parseInt(count, 10);
  
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B views`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
};

// Transform YouTube video to app format
const transformVideo = (video, details = null) => {
  const snippet = video.snippet;
  const statistics = details?.statistics || video.statistics;
  const contentDetails = details?.contentDetails || video.contentDetails;
  
  const videoId = typeof video.id === 'object' ? video.id.videoId : video.id;
  
  return {
    id: videoId,
    source: 'youtube',
    name: snippet.title,
    title: snippet.title,
    artist: snippet.channelTitle,
    channel: snippet.channelTitle,
    channelId: snippet.channelId,
    description: snippet.description,
    thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url,
    image: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
    duration: contentDetails ? parseDuration(contentDetails.duration) : 0,
    viewCount: statistics?.viewCount ? parseInt(statistics.viewCount, 10) : 0,
    likeCount: statistics?.likeCount ? parseInt(statistics.likeCount, 10) : 0,
    publishedAt: snippet.publishedAt,
    youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    downloadStatus: 'pending_backend',
  };
};

// Search YouTube videos
export const searchYouTubeVideos = async ({
  query,
  maxResults = 20,
  pageToken = null,
  musicOnly = true,
} = {}) => {
  if (!API_KEY) {
    throw new Error('YouTube API key not configured. Add VITE_YOUTUBE_API_KEY to your .env file.');
  }

  if (!query) {
    return { videos: [], nextPageToken: null, totalResults: 0 };
  }

  try {
    // Step 1: Search for videos
    const searchParams = {
      part: 'snippet',
      type: 'video',
      q: query,
      maxResults,
      order: 'relevance',
    };

    // Add music category filter if enabled
    if (musicOnly) {
      searchParams.videoCategoryId = '10'; // Music category
    }

    if (pageToken) {
      searchParams.pageToken = pageToken;
    }

    const searchResponse = await youtubeApi.get('/search', { params: searchParams });
    const searchResults = searchResponse.data;

    if (!searchResults.items || searchResults.items.length === 0) {
      return { videos: [], nextPageToken: null, totalResults: 0 };
    }

    // Step 2: Get video details (duration, view count) for all results
    const videoIds = searchResults.items.map(item => item.id.videoId).join(',');
    
    const detailsResponse = await youtubeApi.get('/videos', {
      params: {
        part: 'contentDetails,statistics',
        id: videoIds,
      },
    });

    const detailsMap = new Map();
    detailsResponse.data.items.forEach(item => {
      detailsMap.set(item.id, item);
    });

    // Transform and combine data
    const videos = searchResults.items.map(item => {
      const details = detailsMap.get(item.id.videoId);
      return transformVideo(item, details);
    });

    return {
      videos,
      nextPageToken: searchResults.nextPageToken || null,
      totalResults: searchResults.pageInfo?.totalResults || videos.length,
    };
  } catch (error) {
    console.error('YouTube search error:', error);
    
    if (error.response?.status === 403) {
      throw new Error('YouTube API quota exceeded or invalid API key.');
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid search request. Please try a different search term.');
    }
    
    throw error;
  }
};

// Get video details by ID
export const getVideoDetails = async (videoId) => {
  if (!API_KEY) {
    throw new Error('YouTube API key not configured.');
  }

  try {
    const response = await youtubeApi.get('/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
      },
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    return transformVideo(response.data.items[0], response.data.items[0]);
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

// Get multiple video details by IDs
export const getVideosDetails = async (videoIds) => {
  if (!API_KEY) {
    throw new Error('YouTube API key not configured.');
  }

  if (!videoIds || videoIds.length === 0) {
    return [];
  }

  try {
    const response = await youtubeApi.get('/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoIds.join(','),
      },
    });

    return response.data.items.map(item => transformVideo(item, item));
  } catch (error) {
    console.error('Error fetching videos details:', error);
    throw error;
  }
};

// Search for music-specific content
export const searchYouTubeMusic = async (query, maxResults = 20) => {
  // Add "music" or "audio" to improve results
  const musicQuery = `${query} music`;
  return searchYouTubeVideos({ query: musicQuery, maxResults, musicOnly: true });
};

// Get trending music videos
export const getTrendingMusic = async (maxResults = 20, regionCode = 'US') => {
  if (!API_KEY) {
    throw new Error('YouTube API key not configured.');
  }

  try {
    const response = await youtubeApi.get('/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        videoCategoryId: '10', // Music
        maxResults,
        regionCode,
      },
    });

    return {
      videos: response.data.items.map(item => transformVideo(item, item)),
      totalResults: response.data.pageInfo?.totalResults || 0,
    };
  } catch (error) {
    console.error('Error fetching trending music:', error);
    throw error;
  }
};

// Check if API key is configured
export const isYouTubeConfigured = () => {
  return !!API_KEY;
};

export default {
  searchYouTubeVideos,
  searchYouTubeMusic,
  getVideoDetails,
  getVideosDetails,
  getTrendingMusic,
  formatViewCount,
  isYouTubeConfigured,
};
