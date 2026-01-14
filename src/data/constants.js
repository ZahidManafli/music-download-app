// Regions with their tags for Jamendo API filtering
export const REGIONS = [
  { id: 'all', name: 'All Regions', tags: [] },
  { id: 'azerbaijan', name: 'Azerbaijan', tags: ['azerbaijani', 'mugham', 'caucasian'] },
  { id: 'turkey', name: 'Turkey', tags: ['turkish', 'anatolian', 'oriental', 'turkey', 'turk', 'istanbul', 'ankara', 'turkish-folk', 'turkish-pop', 'arabesque'] },
  { id: 'russia', name: 'Russia', tags: ['russian', 'slavic'] },
  { id: 'arab', name: 'Arabic', tags: ['arabic', 'middle-eastern', 'oriental'] },
  { id: 'india', name: 'India', tags: ['indian', 'bollywood', 'hindi'] },
  { id: 'latin', name: 'Latin America', tags: ['latin', 'spanish', 'salsa', 'reggaeton'] },
  { id: 'africa', name: 'Africa', tags: ['african', 'afrobeat'] },
  { id: 'asia', name: 'East Asia', tags: ['asian', 'chinese', 'japanese', 'korean'] },
  { id: 'europe', name: 'Europe', tags: ['european', 'french', 'german', 'italian'] },
  { id: 'usa', name: 'USA', tags: ['american', 'usa'] },
];

// Music genres
export const GENRES = [
  { id: 'all', name: 'All Genres', icon: '🎵', tag: '' },
  { id: 'pop', name: 'Pop', icon: '🎤', tag: 'pop' },
  { id: 'rock', name: 'Rock', icon: '🎸', tag: 'rock' },
  { id: 'electronic', name: 'Electronic', icon: '🎹', tag: 'electronic' },
  { id: 'hiphop', name: 'Hip Hop', icon: '🎧', tag: 'hiphop' },
  { id: 'jazz', name: 'Jazz', icon: '🎷', tag: 'jazz' },
  { id: 'classical', name: 'Classical', icon: '🎻', tag: 'classical' },
  { id: 'rnb', name: 'R&B / Soul', icon: '💜', tag: 'rnb' },
  { id: 'country', name: 'Country', icon: '🤠', tag: 'country' },
  { id: 'reggae', name: 'Reggae', icon: '🌴', tag: 'reggae' },
  { id: 'metal', name: 'Metal', icon: '🤘', tag: 'metal' },
  { id: 'folk', name: 'Folk', icon: '🪕', tag: 'folk' },
  { id: 'ambient', name: 'Ambient', icon: '🌌', tag: 'ambient' },
  { id: 'indie', name: 'Indie', icon: '🎪', tag: 'indie' },
];

// Category tabs for filtering
export const CATEGORIES = [
  { id: 'all', name: 'All Music', endpoint: 'tracks' },
  { id: 'popular', name: 'Best Hits', endpoint: 'tracks', params: { order: 'popularity_total' } },
  { id: 'new', name: 'New Releases', endpoint: 'tracks', params: { order: 'releasedate_desc' } },
  { id: 'trending', name: 'Trending', endpoint: 'tracks', params: { order: 'popularity_week' } },
];

// Music sources
export const SOURCES = [
  { id: 'jamendo', name: 'Free Music', description: 'Royalty-free music from Jamendo' },
  { id: 'youtube', name: 'YouTube', description: 'Search and download from YouTube' },
  { id: 'musicbrainz', name: 'MusicBrainz', description: 'Search the open music encyclopedia' },
];

// MusicBrainz entity types
export const MUSICBRAINZ_ENTITY_TYPES = [
  { id: 'recording', name: 'Tracks', description: 'Search for songs and recordings' },
  { id: 'artist', name: 'Artists', description: 'Search for artists and bands' },
  { id: 'release', name: 'Albums', description: 'Search for albums, singles, and EPs' },
];

// Jamendo API configuration
export const API_CONFIG = {
  baseUrl: 'https://api.jamendo.com/v3.0',
  format: 'json',
  imageSize: 400,
  audioFormat: 'mp32',
  limit: 20,
};
