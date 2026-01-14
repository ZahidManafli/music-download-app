import { useState, useCallback, useEffect, useRef } from 'react';
import { searchTracks } from '../services/musicApi';
import { debounce } from '../utils/helpers';

const useMusic = (initialParams = {}) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const offsetRef = useRef(0);
  const paramsRef = useRef(initialParams);

  // Fetch tracks
  const fetchTracks = useCallback(async (params = {}, append = false) => {
    setLoading(true);
    setError(null);

    try {
      const offset = append ? offsetRef.current : 0;
      const result = await searchTracks({
        ...params,
        offset,
        limit: 20,
      });

      if (append) {
        setTracks(prev => [...prev, ...result.tracks]);
      } else {
        setTracks(result.tracks);
      }

      setTotal(result.total);
      setHasMore(result.hasMore);
      offsetRef.current = offset + result.tracks.length;
    } catch (err) {
      setError(err.message || 'Failed to fetch tracks');
      console.error('Error fetching tracks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  const debouncedFetch = useCallback(
    debounce((params) => {
      paramsRef.current = params;
      offsetRef.current = 0;
      fetchTracks(params, false);
    }, 300),
    [fetchTracks]
  );

  // Load more tracks (for infinite scroll)
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchTracks(paramsRef.current, true);
    }
  }, [loading, hasMore, fetchTracks]);

  // Refresh tracks
  const refresh = useCallback(() => {
    offsetRef.current = 0;
    fetchTracks(paramsRef.current, false);
  }, [fetchTracks]);

  // Update params and fetch
  const updateParams = useCallback((newParams) => {
    paramsRef.current = { ...paramsRef.current, ...newParams };
    debouncedFetch(paramsRef.current);
  }, [debouncedFetch]);

  return {
    tracks,
    loading,
    error,
    hasMore,
    total,
    fetchTracks,
    loadMore,
    refresh,
    updateParams,
    debouncedFetch,
  };
};

export default useMusic;
