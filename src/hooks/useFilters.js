import { useState, useCallback, useEffect } from 'react';
import { REGIONS, GENRES } from '../data/constants';

const useFilters = () => {
  // Parse URL params on mount
  const getInitialState = () => {
    if (typeof window === 'undefined') {
      return {
        searchQuery: '',
        selectedRegion: 'all',
        selectedGenres: [],
        selectedCategory: 'all',
        artistSearch: '',
      };
    }
    
    const params = new URLSearchParams(window.location.search);
    return {
      searchQuery: params.get('q') || '',
      selectedRegion: params.get('region') || 'all',
      selectedGenres: params.get('genres')?.split(',').filter(Boolean) || [],
      selectedCategory: params.get('category') || 'all',
      artistSearch: params.get('artist') || '',
    };
  };

  const [filters, setFilters] = useState(getInitialState);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.searchQuery) params.set('q', filters.searchQuery);
    if (filters.selectedRegion !== 'all') params.set('region', filters.selectedRegion);
    if (filters.selectedGenres.length > 0) params.set('genres', filters.selectedGenres.join(','));
    if (filters.selectedCategory !== 'all') params.set('category', filters.selectedCategory);
    if (filters.artistSearch) params.set('artist', filters.artistSearch);

    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  const setSearchQuery = useCallback((query) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setSelectedRegion = useCallback((region) => {
    setFilters(prev => ({ ...prev, selectedRegion: region }));
  }, []);

  const toggleGenre = useCallback((genreId) => {
    setFilters(prev => {
      if (genreId === 'all') {
        return { ...prev, selectedGenres: [] };
      }
      
      const newGenres = prev.selectedGenres.includes(genreId)
        ? prev.selectedGenres.filter(g => g !== genreId)
        : [...prev.selectedGenres, genreId];
      
      return { ...prev, selectedGenres: newGenres };
    });
  }, []);

  const setSelectedCategory = useCallback((category) => {
    setFilters(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  const setArtistSearch = useCallback((artist) => {
    setFilters(prev => ({ ...prev, artistSearch: artist }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      selectedRegion: 'all',
      selectedGenres: [],
      selectedCategory: 'all',
      artistSearch: '',
    });
  }, []);

  // Get API params based on current filters
  const getApiParams = useCallback(() => {
    const params = {};

    if (filters.searchQuery) {
      params.query = filters.searchQuery;
    }

    if (filters.artistSearch) {
      params.query = filters.artistSearch;
    }

    // Get region tags
    if (filters.selectedRegion !== 'all') {
      const region = REGIONS.find(r => r.id === filters.selectedRegion);
      if (region?.tags.length > 0) {
        params.tags = [...(params.tags || []), ...region.tags];
      }
    }

    // Get genre tags
    if (filters.selectedGenres.length > 0) {
      const genreTags = filters.selectedGenres
        .map(id => GENRES.find(g => g.id === id)?.tag)
        .filter(Boolean);
      params.tags = [...(params.tags || []), ...genreTags];
    }

    // Get order based on category
    switch (filters.selectedCategory) {
      case 'popular':
        params.order = 'popularity_total';
        break;
      case 'new':
        params.order = 'releasedate_desc';
        break;
      case 'trending':
        params.order = 'popularity_week';
        break;
      default:
        params.order = 'popularity_total';
    }

    return params;
  }, [filters]);

  const hasActiveFilters = 
    filters.searchQuery ||
    filters.selectedRegion !== 'all' ||
    filters.selectedGenres.length > 0 ||
    filters.selectedCategory !== 'all' ||
    filters.artistSearch;

  return {
    ...filters,
    setSearchQuery,
    setSelectedRegion,
    toggleGenre,
    setSelectedCategory,
    setArtistSearch,
    clearAllFilters,
    getApiParams,
    hasActiveFilters,
  };
};

export default useFilters;
