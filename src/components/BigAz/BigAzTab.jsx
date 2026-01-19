import { useState, useCallback, useEffect } from 'react';
import { FiSearch, FiX, FiMusic, FiAlertCircle } from 'react-icons/fi';
import BigAzGrid from './BigAzGrid';
import BigAzDetailModal from './BigAzDetailModal';
import { SearchInput } from '../UI';
import useBigAz from '../../hooks/useBigAz';
import { isBigAzConfigured } from '../../services/bigazApi';

const BigAzTab = ({
  selectedSongs = [],
  onSelectSong,
  onAddToCart,
  initialSearchQuery = '',
}) => {
  const [previewSong, setPreviewSong] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const {
    songs,
    loading,
    error,
    searchQuery,
    totalResults,
    hasMore,
    handleSearchChange,
    loadMore,
    clearSearch,
  } = useBigAz();

  // Check if backend is configured
  const isConfigured = isBigAzConfigured();

  // Handle initial search query from cross-search
  useEffect(() => {
    if (initialSearchQuery && initialSearchQuery.trim() && isConfigured) {
      handleSearchChange(initialSearchQuery);
      setHasSearched(true);
    }
  }, [initialSearchQuery, isConfigured]);

  // Handle search input
  const onSearchChange = useCallback((e) => {
    const value = e.target.value;
    handleSearchChange(value);
    if (value.trim()) {
      setHasSearched(true);
    }
  }, [handleSearchChange]);

  // Handle clear search
  const onClearSearch = useCallback(() => {
    clearSearch();
    setHasSearched(false);
  }, [clearSearch]);

  // Handle song preview
  const handlePreview = useCallback((song) => {
    setPreviewSong(song);
  }, []);

  // Handle close preview
  const handleClosePreview = useCallback(() => {
    setPreviewSong(null);
  }, []);

  // Handle add to cart from modal
  const handleAddToCartFromModal = useCallback((song) => {
    onAddToCart(song);
  }, [onAddToCart]);

  // Check if song is in cart
  const isInCart = useCallback((songId) => {
    return selectedSongs.some(s => s.id === songId);
  }, [selectedSongs]);

  // Show configuration error
  if (!isConfigured) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
          <FiAlertCircle className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Backend Not Configured</h3>
        <p className="text-gray-400 max-w-md mb-4">
          Big.az requires a backend server to function. Please configure VITE_YOUTUBE_BACKEND_URL and VITE_YOUTUBE_BACKEND_API_KEY in your .env file.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClearSearch}
            placeholder="Search Big.az for music..."
            className="w-full"
          />
        </div>
      </div>

      {/* Results info */}
      {hasSearched && songs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            {totalResults > 0 ? (
              <>Showing {songs.length} of {totalResults.toLocaleString()} results</>
            ) : (
              <>{songs.length} results</>
            )}
          </p>
          {selectedSongs.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <FiMusic className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-400">
                {selectedSongs.length} song{selectedSongs.length !== 1 ? 's' : ''} selected
              </span>
            </div>
          )}
        </div>
      )}

      {/* Results grid */}
      <BigAzGrid
        songs={songs}
        selectedSongs={selectedSongs}
        loading={loading}
        error={error}
        hasSearched={hasSearched}
        onSelect={onSelectSong}
        onPreview={handlePreview}
        onLoadMore={loadMore}
        hasMore={hasMore}
      />

      {/* Preview modal */}
      <BigAzDetailModal
        song={previewSong}
        isOpen={!!previewSong}
        onClose={handleClosePreview}
        onAddToCart={handleAddToCartFromModal}
        isInCart={previewSong ? isInCart(previewSong.id) : false}
      />
    </div>
  );
};

export default BigAzTab;
