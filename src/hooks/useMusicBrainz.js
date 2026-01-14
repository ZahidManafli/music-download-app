import { useState, useCallback, useRef } from 'react';
import { searchMusicBrainz } from '../services/musicbrainzApi';
import { debounce } from '../utils/helpers';

const useMusicBrainz = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityType, setEntityType] = useState('recording'); // 'recording' | 'artist' | 'release'
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  const lastQueryRef = useRef('');
  const lastEntityTypeRef = useRef('recording');
  const LIMIT = 25;

  // Search MusicBrainz
  const searchEntities = useCallback(async (query, type, append = false) => {
    if (!query.trim()) {
      setResults([]);
      setOffset(0);
      setTotalCount(0);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentOffset = append ? offset + LIMIT : 0;
      const result = await searchMusicBrainz({
        query,
        entityType: type,
        limit: LIMIT,
        offset: currentOffset,
      });

      if (append) {
        setResults(prev => [...prev, ...result.results]);
      } else {
        setResults(result.results);
      }

      setOffset(currentOffset);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      lastQueryRef.current = query;
      lastEntityTypeRef.current = type;
    } catch (err) {
      setError(err.message || 'Failed to search MusicBrainz');
      console.error('MusicBrainz search error:', err);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  // Debounced search (500ms to respect rate limiting)
  const debouncedSearch = useCallback(
    debounce((query, type) => {
      searchEntities(query, type, false);
    }, 500),
    [searchEntities]
  );

  // Handle search input change
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim()) {
      debouncedSearch(query, entityType);
    } else {
      setResults([]);
      setOffset(0);
      setTotalCount(0);
      setHasMore(false);
    }
  }, [debouncedSearch, entityType]);

  // Handle entity type change
  const handleEntityTypeChange = useCallback((type) => {
    setEntityType(type);
    setResults([]);
    setOffset(0);
    setTotalCount(0);
    setHasMore(false);
    setError(null);
    
    // Re-search with new entity type if there's a query
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery, type);
    }
  }, [searchQuery, debouncedSearch]);

  // Load more results
  const loadMore = useCallback(() => {
    if (!loading && hasMore && lastQueryRef.current) {
      searchEntities(lastQueryRef.current, lastEntityTypeRef.current, true);
    }
  }, [loading, hasMore, searchEntities]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setResults([]);
    setOffset(0);
    setTotalCount(0);
    setHasMore(false);
    setError(null);
    lastQueryRef.current = '';
  }, []);

  // Refresh current search
  const refresh = useCallback(() => {
    if (lastQueryRef.current) {
      searchEntities(lastQueryRef.current, lastEntityTypeRef.current, false);
    }
  }, [searchEntities]);

  return {
    // State
    results,
    loading,
    error,
    searchQuery,
    entityType,
    totalCount,
    hasMore,
    
    // Actions
    handleSearchChange,
    handleEntityTypeChange,
    searchEntities,
    loadMore,
    clearSearch,
    refresh,
  };
};

export default useMusicBrainz;
