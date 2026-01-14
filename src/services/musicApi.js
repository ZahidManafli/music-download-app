import axios from 'axios';
import { API_CONFIG } from '../data/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  params: {
    client_id: import.meta.env.VITE_JAMENDO_CLIENT_ID || 'demo',
    format: API_CONFIG.format,
  },
});

// Transform Jamendo track response to our format
const transformTrack = (track) => ({
  id: track.id,
  name: track.name,
  artist: track.artist_name,
  artistId: track.artist_id,
  album: track.album_name,
  albumId: track.album_id,
  albumImage: track.album_image || track.image,
  image: track.image || track.album_image,
  duration: parseInt(track.duration, 10),
  releaseDate: track.releasedate,
  audioUrl: track.audio,
  audioDownloadUrl: track.audiodownload,
  downloadAllowed: track.audiodownload_allowed,
  license: track.license_ccurl,
  position: track.position,
  tags: track.musicinfo?.tags?.genres || [],
});

// Transform Jamendo artist response
const transformArtist = (artist) => ({
  id: artist.id,
  name: artist.name,
  image: artist.image,
  website: artist.website,
  joinDate: artist.joindate,
});

// Search tracks with filters
export const searchTracks = async ({
  query = '',
  genre = '',
  tags = [],
  order = 'popularity_total',
  limit = API_CONFIG.limit,
  offset = 0,
} = {}) => {
  try {
    const params = {
      limit,
      offset,
      order,
      include: 'musicinfo',
      imagesize: API_CONFIG.imageSize,
      audioformat: API_CONFIG.audioFormat,
    };

    if (query) {
      params.search = query;
    }

    if (genre) {
      params.tags = genre;
    }

    if (tags.length > 0) {
      params.tags = tags.join('+');
    }

    const response = await api.get('/tracks/', { params });

    return {
      tracks: response.data.results.map(transformTrack),
      total: response.data.headers.results_count,
      hasMore: response.data.results.length === limit,
    };
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  }
};

// Get popular tracks
export const getPopularTracks = async (limit = API_CONFIG.limit, offset = 0) => {
  return searchTracks({ order: 'popularity_total', limit, offset });
};

// Get new releases
export const getNewReleases = async (limit = API_CONFIG.limit, offset = 0) => {
  return searchTracks({ order: 'releasedate_desc', limit, offset });
};

// Get trending tracks (popular this week)
export const getTrendingTracks = async (limit = API_CONFIG.limit, offset = 0) => {
  return searchTracks({ order: 'popularity_week', limit, offset });
};

// Get tracks by genre
export const getTracksByGenre = async (genre, limit = API_CONFIG.limit, offset = 0) => {
  return searchTracks({ genre, limit, offset });
};

// Get tracks by tags (for region filtering)
export const getTracksByTags = async (tags, limit = API_CONFIG.limit, offset = 0) => {
  return searchTracks({ tags, limit, offset });
};

// Get Turkish music specifically (enhanced search)
export const getTurkishMusic = async (limit = API_CONFIG.limit, offset = 0) => {
  try {
    // Try multiple search strategies to get more Turkish music
    const searches = [
      // Search by tags
      searchTracks({ tags: ['turkish', 'anatolian'], limit: Math.ceil(limit / 2), offset }),
      // Search by query terms
      searchTracks({ query: 'turkish', limit: Math.ceil(limit / 2), offset }),
    ];

    const results = await Promise.all(searches);
    
    // Combine and deduplicate
    const allTracks = results.flatMap(r => r.tracks);
    const uniqueTracks = Array.from(
      new Map(allTracks.map(track => [track.id, track])).values()
    );

    return {
      tracks: uniqueTracks.slice(0, limit),
      total: results.reduce((sum, r) => sum + r.total, 0),
      hasMore: uniqueTracks.length >= limit,
    };
  } catch (error) {
    console.error('Error fetching Turkish music:', error);
    // Fallback to simple tag search
    return searchTracks({ tags: ['turkish'], limit, offset });
  }
};

// Search artists
export const searchArtists = async (query, limit = 20) => {
  try {
    const response = await api.get('/artists/', {
      params: {
        namesearch: query,
        limit,
        imagesize: API_CONFIG.imageSize,
      },
    });

    return {
      artists: response.data.results.map(transformArtist),
      total: response.data.headers.results_count,
    };
  } catch (error) {
    console.error('Error searching artists:', error);
    throw error;
  }
};

// Get tracks by artist
export const getArtistTracks = async (artistId, limit = API_CONFIG.limit) => {
  try {
    const response = await api.get('/tracks/', {
      params: {
        artist_id: artistId,
        limit,
        include: 'musicinfo',
        imagesize: API_CONFIG.imageSize,
        audioformat: API_CONFIG.audioFormat,
      },
    });

    return {
      tracks: response.data.results.map(transformTrack),
      total: response.data.headers.results_count,
    };
  } catch (error) {
    console.error('Error fetching artist tracks:', error);
    throw error;
  }
};

// Get single track details
export const getTrackById = async (trackId) => {
  try {
    const response = await api.get('/tracks/', {
      params: {
        id: trackId,
        include: 'musicinfo',
        imagesize: API_CONFIG.imageSize,
        audioformat: API_CONFIG.audioFormat,
      },
    });

    if (response.data.results.length === 0) {
      throw new Error('Track not found');
    }

    return transformTrack(response.data.results[0]);
  } catch (error) {
    console.error('Error fetching track:', error);
    throw error;
  }
};

// Download track as blob (for ZIP creation)
export const downloadTrackBlob = async (downloadUrl) => {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error('Download failed');
    }
    return await response.blob();
  } catch (error) {
    console.error('Error downloading track:', error);
    throw error;
  }
};

// Get playlists
export const getPlaylists = async (limit = 20) => {
  try {
    const response = await api.get('/playlists/', {
      params: {
        limit,
        imagesize: API_CONFIG.imageSize,
      },
    });

    return {
      playlists: response.data.results.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        creationDate: playlist.creationdate,
        userId: playlist.user_id,
        userName: playlist.user_name,
      })),
      total: response.data.headers.results_count,
    };
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

// Get playlist tracks
export const getPlaylistTracks = async (playlistId) => {
  try {
    const response = await api.get('/playlists/tracks/', {
      params: {
        id: playlistId,
        include: 'musicinfo',
        imagesize: API_CONFIG.imageSize,
        audioformat: API_CONFIG.audioFormat,
      },
    });

    return {
      tracks: response.data.results[0]?.tracks?.map(transformTrack) || [],
    };
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    throw error;
  }
};

export default {
  searchTracks,
  getPopularTracks,
  getNewReleases,
  getTrendingTracks,
  getTracksByGenre,
  getTracksByTags,
  getTurkishMusic,
  searchArtists,
  getArtistTracks,
  getTrackById,
  downloadTrackBlob,
  getPlaylists,
  getPlaylistTracks,
};
