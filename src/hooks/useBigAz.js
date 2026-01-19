import { useState, useCallback, useRef } from 'react';
import { searchBigAzMusic } from '../services/bigazApi';
import { debounce } from '../utils/helpers';

const useBigAz = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  
  const lastQueryRef = useRef('');

  // Search Big.az music
  const searchSongs = useCallback(async (query, append = false) => {
    if (!query.trim()) {
      setSongs([]);
      setHasMore(false);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await searchBigAzMusic(query);

      if (append) {
        setSongs(prev => [...prev, ...result.songs]);
      } else {
        setSongs(result.songs);
      }

      setHasMore(result.hasMore || false);
      setTotalResults(result.totalResults || result.songs.length);
      lastQueryRef.current = query;
    } catch (err) {
      setError(err.message || 'Failed to search Big.az');
      console.error('Big.az search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      searchSongs(query, false);
    }, 500),
    [searchSongs]
  );

  // Handle search input change
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setSongs([]);
      setHasMore(false);
      setTotalResults(0);
    }
  }, [debouncedSearch]);

  // Load more results
  const loadMore = useCallback(() => {
    if (!loading && hasMore && lastQueryRef.current) {
      searchSongs(lastQueryRef.current, true);
    }
  }, [loading, hasMore, searchSongs]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSongs([]);
    setHasMore(false);
    setTotalResults(0);
    setError(null);
    lastQueryRef.current = '';
  }, []);

  // Refresh current search
  const refresh = useCallback(() => {
    if (lastQueryRef.current) {
      searchSongs(lastQueryRef.current, false);
    }
  }, [searchSongs]);

  return {
    songs,
    loading,
    error,
    searchQuery,
    totalResults,
    hasMore,
    handleSearchChange,
    searchSongs,
    loadMore,
    clearSearch,
    refresh,
  };
};

export default useBigAz;
