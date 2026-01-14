/**
 * Additional Turkish Music APIs and Resources
 * 
 * This file provides alternative sources for Turkish music beyond Jamendo.
 * Note: Some APIs may require backend implementation due to CORS restrictions.
 */

// Internet Archive API - Has Turkish music collections
export const getInternetArchiveTurkishMusic = async (query = '', limit = 20) => {
  try {
    // Internet Archive API endpoint
    const baseUrl = 'https://archive.org/advancedsearch.php';
    const params = new URLSearchParams({
      q: `collection:opensource_audio AND (${query || 'turkish'} OR turk OR turkey OR anatolian)`,
      fl: ['identifier', 'title', 'creator', 'date', 'mediatype', 'downloads'].join(','),
      sort: 'downloads desc',
      rows: limit.toString(),
      output: 'json',
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    if (data.response?.docs) {
      return data.response.docs.map(doc => ({
        id: doc.identifier,
        name: doc.title || 'Unknown',
        artist: doc.creator?.[0] || 'Unknown Artist',
        source: 'internet-archive',
        downloadUrl: `https://archive.org/download/${doc.identifier}`,
        metadata: doc,
      }));
    }

    return [];
  } catch (error) {
    console.error('Internet Archive API error:', error);
    return [];
  }
};

// Freesound API - Creative Commons Turkish sounds/music
export const getFreesoundTurkishMusic = async (apiKey, query = 'turkish', limit = 20) => {
  if (!apiKey) {
    console.warn('Freesound API key required');
    return [];
  }

  try {
    const baseUrl = 'https://freesound.org/apiv2/search/text/';
    const params = new URLSearchParams({
      query: `${query} turkish turkey`,
      filter: 'license:"Attribution" OR license:"Creative Commons 0"',
      fields: 'id,name,username,duration,previews,license,download',
      page_size: limit.toString(),
    });

    const response = await fetch(`${baseUrl}?${params}`, {
      headers: {
        'Authorization': `Token ${apiKey}`,
      },
    });

    const data = await response.json();

    if (data.results) {
      return data.results.map(result => ({
        id: result.id,
        name: result.name,
        artist: result.username,
        duration: result.duration,
        source: 'freesound',
        audioUrl: result.previews?.['preview-hq-mp3'] || result.previews?.['preview-lq-mp3'],
        downloadUrl: result.download,
        license: result.license,
      }));
    }

    return [];
  } catch (error) {
    console.error('Freesound API error:', error);
    return [];
  }
};

// Enhanced Jamendo search specifically for Turkish music
export const getEnhancedTurkishMusic = async (jamendoApi, limit = 50) => {
  // Multiple search queries to get more Turkish music
  const searchTerms = [
    'turkish',
    'türk',
    'türkçe',
    'istanbul',
    'anatolian',
    'arabesque',
    'turkish pop',
    'turkish folk',
    'turkish rock',
  ];

  const allTracks = [];

  for (const term of searchTerms) {
    try {
      const result = await jamendoApi.searchTracks({
        query: term,
        limit: Math.ceil(limit / searchTerms.length),
        order: 'popularity_total',
      });
      allTracks.push(...result.tracks);
    } catch (error) {
      console.error(`Error searching for "${term}":`, error);
    }
  }

  // Remove duplicates
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  );

  return uniqueTracks.slice(0, limit);
};

// Combine multiple sources
export const getAllTurkishMusic = async (options = {}) => {
  const {
    jamendoApi = null,
    freesoundApiKey = null,
    includeInternetArchive = true,
    limit = 20,
  } = options;

  const results = [];

  // Get from Jamendo (primary source)
  if (jamendoApi) {
    try {
      const jamendoTracks = await getEnhancedTurkishMusic(jamendoApi, limit);
      results.push(...jamendoTracks.map(t => ({ ...t, source: 'jamendo' })));
    } catch (error) {
      console.error('Jamendo error:', error);
    }
  }

  // Get from Internet Archive
  if (includeInternetArchive) {
    try {
      const archiveTracks = await getInternetArchiveTurkishMusic('turkish', limit);
      results.push(...archiveTracks);
    } catch (error) {
      console.error('Internet Archive error:', error);
    }
  }

  // Get from Freesound (if API key provided)
  if (freesoundApiKey) {
    try {
      const freesoundTracks = await getFreesoundTurkishMusic(freesoundApiKey, 'turkish', limit);
      results.push(...freesoundTracks);
    } catch (error) {
      console.error('Freesound error:', error);
    }
  }

  return results;
};

export default {
  getInternetArchiveTurkishMusic,
  getFreesoundTurkishMusic,
  getEnhancedTurkishMusic,
  getAllTurkishMusic,
};
