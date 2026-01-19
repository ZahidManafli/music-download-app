import axios from 'axios';

// Backend configuration
const BACKEND_URL = import.meta.env.VITE_YOUTUBE_BACKEND_URL || '';
const API_KEY = import.meta.env.VITE_YOUTUBE_BACKEND_API_KEY || '';

// Create axios instance for Big.az API
const bigazApi = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

// Transform Big.az song to app format
const transformSong = (song) => {
  return {
    id: song.id,
    source: 'bigaz',
    name: song.title,
    title: song.title,
    artist: song.artist || 'Unknown Artist',
    htmlFileName: song.htmlFileName,
    demoId: song.demoId,
    fullTitle: song.fullTitle || `${song.artist} - ${song.title}`,
    audioUrl: null, // Will be fetched when needed
    downloadStatus: 'pending_backend',
  };
};

/**
 * Search for music on Big.az
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results (not used by backend, but kept for consistency)
 * @returns {Promise<Object>} Search results
 */
export const searchBigAzMusic = async (query, maxResults = 20) => {
  if (!BACKEND_URL || !API_KEY) {
    throw new Error('Backend not configured. Add VITE_YOUTUBE_BACKEND_URL and VITE_YOUTUBE_BACKEND_API_KEY to your .env file.');
  }

  if (!query || !query.trim()) {
    return { songs: [], hasMore: false, totalResults: 0 };
  }

  try {
    const response = await bigazApi.get('/api/bigaz/search', {
      params: {
        query: query.trim(),
      },
    });

    const result = response.data.data;
    const songs = result.songs.map(transformSong);

    return {
      songs,
      hasMore: result.hasMore || false,
      totalResults: songs.length,
    };
  } catch (error) {
    console.error('Big.az search error:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Check your backend configuration.');
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid search request. Please try a different search term.');
    }
    
    throw error;
  }
};

/**
 * Get song details from HTML page
 * @param {string} filename - HTML filename (e.g., "aref-kemal-lezginka-868412.html")
 * @returns {Promise<Object>} Song details
 */
export const getSongDetails = async (filename) => {
  if (!BACKEND_URL || !API_KEY) {
    throw new Error('Backend not configured.');
  }

  if (!filename) {
    throw new Error('Filename is required');
  }

  try {
    const response = await bigazApi.get(`/api/bigaz/song/${filename}`);
    const songData = response.data.data;

    return {
      songId: songData.songId,
      title: songData.title,
      htmlFileName: songData.htmlFileName,
      audioParams: songData.audioParams,
    };
  } catch (error) {
    console.error('Error fetching song details:', error);
    throw error;
  }
};

/**
 * Get audio URL for a song
 * @param {string} songId - Song ID
 * @param {Object} params - Optional audio parameters (lk, mh, mr, hs)
 * @returns {Promise<string>} Audio URL
 */
export const getAudioUrl = async (songId, params = {}) => {
  if (!BACKEND_URL || !API_KEY) {
    throw new Error('Backend not configured.');
  }

  if (!songId) {
    throw new Error('Song ID is required');
  }

  try {
    const response = await bigazApi.get(`/api/bigaz/audio/${songId}`, {
      params,
    });

    return response.data.data.audioUrl;
  } catch (error) {
    console.error('Error getting audio URL:', error);
    throw error;
  }
};

/**
 * Check if backend is configured
 * @returns {boolean} True if configured
 */
export const isBigAzConfigured = () => {
  return !!(BACKEND_URL && API_KEY);
};

export default {
  searchBigAzMusic,
  getSongDetails,
  getAudioUrl,
  isBigAzConfigured,
};
