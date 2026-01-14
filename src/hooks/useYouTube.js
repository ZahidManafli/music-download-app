import { useState, useCallback, useRef } from 'react';
import { searchYouTubeVideos, getTrendingMusic } from '../services/youtubeApi';
import { debounce } from '../utils/helpers';

const useYouTube = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nextPageToken, setNextPageToken] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  const lastQueryRef = useRef('');

  // Search YouTube videos
  const searchVideos = useCallback(async (query, append = false) => {
    if (!query.trim()) {
      setVideos([]);
      setNextPageToken(null);
      setTotalResults(0);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pageToken = append ? nextPageToken : null;
      const result = await searchYouTubeVideos({
        query,
        maxResults: 20,
        pageToken,
        musicOnly: true,
      });

      if (append) {
        setVideos(prev => [...prev, ...result.videos]);
      } else {
        setVideos(result.videos);
      }

      setNextPageToken(result.nextPageToken);
      setTotalResults(result.totalResults);
      setHasMore(!!result.nextPageToken);
      lastQueryRef.current = query;
    } catch (err) {
      setError(err.message || 'Failed to search YouTube');
      console.error('YouTube search error:', err);
    } finally {
      setLoading(false);
    }
  }, [nextPageToken]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      searchVideos(query, false);
    }, 500),
    [searchVideos]
  );

  // Handle search input change
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setVideos([]);
      setNextPageToken(null);
      setHasMore(false);
    }
  }, [debouncedSearch]);

  // Load more results
  const loadMore = useCallback(() => {
    if (!loading && hasMore && lastQueryRef.current) {
      searchVideos(lastQueryRef.current, true);
    }
  }, [loading, hasMore, searchVideos]);

  // Load trending music
  const loadTrending = useCallback(async (regionCode = 'US') => {
    setLoading(true);
    setError(null);
    setSearchQuery('');

    try {
      const result = await getTrendingMusic(20, regionCode);
      setVideos(result.videos);
      setTotalResults(result.totalResults);
      setNextPageToken(null);
      setHasMore(false);
    } catch (err) {
      setError(err.message || 'Failed to load trending music');
      console.error('Trending music error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setVideos([]);
    setNextPageToken(null);
    setTotalResults(0);
    setHasMore(false);
    setError(null);
    lastQueryRef.current = '';
  }, []);

  // Refresh current search
  const refresh = useCallback(() => {
    if (lastQueryRef.current) {
      searchVideos(lastQueryRef.current, false);
    }
  }, [searchVideos]);

  return {
    videos,
    loading,
    error,
    searchQuery,
    totalResults,
    hasMore,
    handleSearchChange,
    searchVideos,
    loadMore,
    loadTrending,
    clearSearch,
    refresh,
  };
};

export default useYouTube;
