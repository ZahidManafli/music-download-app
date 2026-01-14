import axios from 'axios';

const MUSICBRAINZ_API_BASE = 'https://musicbrainz.org/ws/2';
const COVER_ART_BASE = 'https://coverartarchive.org';

// Create axios instance for MusicBrainz API
const musicbrainzApi = axios.create({
  baseURL: MUSICBRAINZ_API_BASE,
  headers: {
    'User-Agent': 'MusicDownloadApp/1.0 (https://github.com/music-download-app)',
    'Accept': 'application/json',
  },
  params: {
    fmt: 'json',
  },
});

// Rate limiting: MusicBrainz allows ~1 request/second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

const rateLimitedRequest = async (config) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return musicbrainzApi(config);
};

// Parse duration from milliseconds to seconds
const parseDuration = (milliseconds) => {
  if (!milliseconds) return 0;
  return Math.floor(milliseconds / 1000);
};

// Get cover art URL for a release
export const getCoverArtUrl = (releaseMbid, size = 'small') => {
  if (!releaseMbid) return null;
  // size can be: 'small' (250px), 'large' (500px), or 'front' (original)
  const sizeParam = size === 'front' ? 'front' : `front-${size === 'large' ? '500' : '250'}`;
  return `${COVER_ART_BASE}/release/${releaseMbid}/${sizeParam}`;
};

// Transform recording from MusicBrainz to app format
const transformRecording = (recording) => {
  const artistCredits = recording['artist-credit'] || [];
  const artistName = artistCredits
    .map(credit => credit.artist?.name || credit.name)
    .join(', ') || 'Unknown Artist';
  
  const releases = recording.releases || [];
  const firstRelease = releases[0];
  
  return {
    id: recording.id,
    mbid: recording.id,
    source: 'musicbrainz',
    entityType: 'recording',
    name: recording.title,
    title: recording.title,
    artist: artistName,
    artistCredits: artistCredits.map(credit => ({
      name: credit.artist?.name || credit.name,
      mbid: credit.artist?.id,
      joinPhrase: credit.joinphrase || '',
    })),
    album: firstRelease?.title || null,
    albumMbid: firstRelease?.id || null,
    duration: parseDuration(recording.length),
    isrc: recording.isrcs?.[0] || null,
    releaseDate: firstRelease?.date || null,
    releaseYear: firstRelease?.date?.substring(0, 4) || null,
    thumbnail: firstRelease?.id ? getCoverArtUrl(firstRelease.id, 'small') : null,
    image: firstRelease?.id ? getCoverArtUrl(firstRelease.id, 'large') : null,
    disambiguation: recording.disambiguation || null,
    tags: recording.tags?.map(t => t.name) || [],
    score: recording.score || 0,
  };
};

// Transform artist from MusicBrainz to app format
const transformArtist = (artist) => {
  return {
    id: artist.id,
    mbid: artist.id,
    source: 'musicbrainz',
    entityType: 'artist',
    name: artist.name,
    sortName: artist['sort-name'],
    type: artist.type || 'Unknown',
    country: artist.country || artist.area?.name || null,
    area: artist.area?.name || null,
    beginDate: artist['life-span']?.begin || null,
    endDate: artist['life-span']?.ended ? artist['life-span']?.end : null,
    isActive: !artist['life-span']?.ended,
    disambiguation: artist.disambiguation || null,
    tags: artist.tags?.map(t => t.name) || [],
    genres: artist.genres?.map(g => g.name) || [],
    score: artist.score || 0,
    // Artists don't have a direct image, but we might get one from releases
    thumbnail: null,
    image: null,
  };
};

// Transform release from MusicBrainz to app format
const transformRelease = (release) => {
  const artistCredits = release['artist-credit'] || [];
  const artistName = artistCredits
    .map(credit => credit.artist?.name || credit.name)
    .join(', ') || 'Unknown Artist';
  
  const releaseGroup = release['release-group'] || {};
  
  return {
    id: release.id,
    mbid: release.id,
    source: 'musicbrainz',
    entityType: 'release',
    name: release.title,
    title: release.title,
    artist: artistName,
    artistCredits: artistCredits.map(credit => ({
      name: credit.artist?.name || credit.name,
      mbid: credit.artist?.id,
      joinPhrase: credit.joinphrase || '',
    })),
    releaseDate: release.date || null,
    releaseYear: release.date?.substring(0, 4) || null,
    country: release.country || null,
    status: release.status || null,
    barcode: release.barcode || null,
    packaging: release.packaging || null,
    label: release['label-info']?.[0]?.label?.name || null,
    catalogNumber: release['label-info']?.[0]?.['catalog-number'] || null,
    trackCount: release['track-count'] || release.media?.reduce((sum, m) => sum + (m['track-count'] || 0), 0) || 0,
    releaseGroupType: releaseGroup['primary-type'] || null,
    releaseGroupMbid: releaseGroup.id || null,
    disambiguation: release.disambiguation || null,
    thumbnail: getCoverArtUrl(release.id, 'small'),
    image: getCoverArtUrl(release.id, 'large'),
    score: release.score || 0,
  };
};

// Search recordings (songs/tracks)
export const searchRecordings = async ({
  query,
  limit = 25,
  offset = 0,
} = {}) => {
  if (!query?.trim()) {
    return { results: [], totalCount: 0, offset: 0 };
  }

  try {
    const response = await rateLimitedRequest({
      method: 'GET',
      url: '/recording',
      params: {
        query: query,
        limit,
        offset,
      },
    });

    const data = response.data;
    const recordings = data.recordings || [];

    return {
      results: recordings.map(transformRecording),
      totalCount: data.count || 0,
      offset: data.offset || offset,
      hasMore: (data.offset || 0) + recordings.length < (data.count || 0),
    };
  } catch (error) {
    console.error('MusicBrainz recording search error:', error);
    if (error.response?.status === 503) {
      throw new Error('MusicBrainz service is temporarily unavailable. Please try again later.');
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid search query. Please try different search terms.');
    }
    throw error;
  }
};

// Search artists
export const searchArtists = async ({
  query,
  limit = 25,
  offset = 0,
} = {}) => {
  if (!query?.trim()) {
    return { results: [], totalCount: 0, offset: 0 };
  }

  try {
    const response = await rateLimitedRequest({
      method: 'GET',
      url: '/artist',
      params: {
        query: query,
        limit,
        offset,
      },
    });

    const data = response.data;
    const artists = data.artists || [];

    return {
      results: artists.map(transformArtist),
      totalCount: data.count || 0,
      offset: data.offset || offset,
      hasMore: (data.offset || 0) + artists.length < (data.count || 0),
    };
  } catch (error) {
    console.error('MusicBrainz artist search error:', error);
    if (error.response?.status === 503) {
      throw new Error('MusicBrainz service is temporarily unavailable. Please try again later.');
    }
    throw error;
  }
};

// Search releases (albums/singles)
export const searchReleases = async ({
  query,
  limit = 25,
  offset = 0,
} = {}) => {
  if (!query?.trim()) {
    return { results: [], totalCount: 0, offset: 0 };
  }

  try {
    const response = await rateLimitedRequest({
      method: 'GET',
      url: '/release',
      params: {
        query: query,
        limit,
        offset,
      },
    });

    const data = response.data;
    const releases = data.releases || [];

    return {
      results: releases.map(transformRelease),
      totalCount: data.count || 0,
      offset: data.offset || offset,
      hasMore: (data.offset || 0) + releases.length < (data.count || 0),
    };
  } catch (error) {
    console.error('MusicBrainz release search error:', error);
    if (error.response?.status === 503) {
      throw new Error('MusicBrainz service is temporarily unavailable. Please try again later.');
    }
    throw error;
  }
};

// Get recording details by MBID
export const getRecordingDetails = async (mbid) => {
  if (!mbid) {
    throw new Error('Recording MBID is required');
  }

  try {
    const response = await rateLimitedRequest({
      method: 'GET',
      url: `/recording/${mbid}`,
      params: {
        inc: 'artist-credits+releases+isrcs+tags+genres',
      },
    });

    return transformRecording(response.data);
  } catch (error) {
    console.error('MusicBrainz recording details error:', error);
    if (error.response?.status === 404) {
      throw new Error('Recording not found');
    }
    throw error;
  }
};

// Get artist details by MBID
export const getArtistDetails = async (mbid) => {
  if (!mbid) {
    throw new Error('Artist MBID is required');
  }

  try {
    const response = await rateLimitedRequest({
      method: 'GET',
      url: `/artist/${mbid}`,
      params: {
        inc: 'releases+release-groups+tags+genres+aliases',
      },
    });

    const artist = transformArtist(response.data);
    
    // Add release groups if available
    if (response.data['release-groups']) {
      artist.releaseGroups = response.data['release-groups'].map(rg => ({
        id: rg.id,
        title: rg.title,
        type: rg['primary-type'],
        firstReleaseDate: rg['first-release-date'],
      }));
    }

    return artist;
  } catch (error) {
    console.error('MusicBrainz artist details error:', error);
    if (error.response?.status === 404) {
      throw new Error('Artist not found');
    }
    throw error;
  }
};

// Get release details by MBID
export const getReleaseDetails = async (mbid) => {
  if (!mbid) {
    throw new Error('Release MBID is required');
  }

  try {
    const response = await rateLimitedRequest({
      method: 'GET',
      url: `/release/${mbid}`,
      params: {
        inc: 'artist-credits+labels+recordings+release-groups+tags+genres',
      },
    });

    const release = transformRelease(response.data);
    
    // Add media/tracks if available
    if (response.data.media) {
      release.media = response.data.media.map(medium => ({
        position: medium.position,
        format: medium.format,
        trackCount: medium['track-count'],
        tracks: medium.tracks?.map(track => ({
          position: track.position,
          number: track.number,
          title: track.title,
          length: parseDuration(track.length),
          recordingMbid: track.recording?.id,
        })) || [],
      }));
    }

    return release;
  } catch (error) {
    console.error('MusicBrainz release details error:', error);
    if (error.response?.status === 404) {
      throw new Error('Release not found');
    }
    throw error;
  }
};

// Generic search function that routes to the appropriate entity search
export const searchMusicBrainz = async ({
  query,
  entityType = 'recording',
  limit = 25,
  offset = 0,
} = {}) => {
  switch (entityType) {
    case 'artist':
      return searchArtists({ query, limit, offset });
    case 'release':
      return searchReleases({ query, limit, offset });
    case 'recording':
    default:
      return searchRecordings({ query, limit, offset });
  }
};

// Build a YouTube search query from MusicBrainz entity
export const buildYouTubeSearchQuery = (entity) => {
  if (!entity) return '';
  
  switch (entity.entityType) {
    case 'recording':
      return `${entity.artist} - ${entity.title}`;
    case 'artist':
      return `${entity.name} music`;
    case 'release':
      return `${entity.artist} - ${entity.title} full album`;
    default:
      return entity.name || entity.title || '';
  }
};

export default {
  searchRecordings,
  searchArtists,
  searchReleases,
  searchMusicBrainz,
  getRecordingDetails,
  getArtistDetails,
  getReleaseDetails,
  getCoverArtUrl,
  buildYouTubeSearchQuery,
};
