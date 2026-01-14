import { useState, useCallback, useEffect } from 'react';
import { FiSearch, FiX, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';
import YouTubeGrid from './YouTubeGrid';
import VideoPreviewModal from './VideoPreviewModal';
import { SearchInput, Button } from '../UI';
import useYouTube from '../../hooks/useYouTube';
import { isYouTubeConfigured } from '../../services/youtubeApi';

const YouTubeTab = ({
  selectedVideos = [],
  onSelectVideo,
  onAddToCart,
  initialSearchQuery = '',
}) => {
  const [previewVideo, setPreviewVideo] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const {
    videos,
    loading,
    error,
    searchQuery,
    totalResults,
    hasMore,
    handleSearchChange,
    loadMore,
    loadTrending,
    clearSearch,
  } = useYouTube();

  // Check if API key is configured
  const isConfigured = isYouTubeConfigured();

  // Handle initial search query from cross-search (MusicBrainz)
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

  // Handle video preview
  const handlePreview = useCallback((video) => {
    setPreviewVideo(video);
  }, []);

  // Handle close preview
  const handleClosePreview = useCallback(() => {
    setPreviewVideo(null);
  }, []);

  // Handle add to cart from modal
  const handleAddToCartFromModal = useCallback((video) => {
    onAddToCart(video);
  }, [onAddToCart]);

  // Check if video is in cart
  const isInCart = useCallback((videoId) => {
    return selectedVideos.some(v => v.id === videoId);
  }, [selectedVideos]);

  // Load trending on button click
  const handleLoadTrending = useCallback(() => {
    setHasSearched(true);
    loadTrending();
  }, [loadTrending]);

  // API key not configured warning
  if (!isConfigured) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
          <FiAlertCircle className="w-12 h-12 text-yellow-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">YouTube API Key Required</h3>
        <p className="text-gray-400 max-w-md mb-6">
          To use YouTube search, you need to add your YouTube Data API v3 key to the environment variables.
        </p>
        <div className="text-left bg-white/5 rounded-xl p-4 max-w-md">
          <p className="text-sm text-gray-300 mb-2">Add to your <code className="text-pink-400">.env</code> file:</p>
          <code className="text-sm text-green-400 block bg-black/30 rounded p-2">
            VITE_YOUTUBE_API_KEY=your_api_key_here
          </code>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Get your API key from{' '}
          <a 
            href="https://console.cloud.google.com/apis/credentials" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300"
          >
            Google Cloud Console
          </a>
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
            placeholder="Search YouTube for music..."
            className="w-full"
          />
        </div>

        {/* Trending button */}
        <Button
          variant="secondary"
          onClick={handleLoadTrending}
          disabled={loading}
          icon={FiTrendingUp}
          className="shrink-0"
        >
          Trending Music
        </Button>
      </div>

      {/* Results info */}
      {hasSearched && videos.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            {totalResults > 0 ? (
              <>Showing {videos.length} of {totalResults.toLocaleString()} results</>
            ) : (
              <>{videos.length} results</>
            )}
          </p>
          {selectedVideos.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <FaYoutube className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-400">
                {selectedVideos.length} video{selectedVideos.length !== 1 ? 's' : ''} selected
              </span>
            </div>
          )}
        </div>
      )}

      {/* Results grid */}
      <YouTubeGrid
        videos={videos}
        selectedVideos={selectedVideos}
        loading={loading}
        error={error}
        hasSearched={hasSearched}
        onSelect={onSelectVideo}
        onPreview={handlePreview}
        onLoadMore={loadMore}
        hasMore={hasMore}
      />

      {/* Preview modal */}
      <VideoPreviewModal
        video={previewVideo}
        isOpen={!!previewVideo}
        onClose={handleClosePreview}
        onAddToCart={handleAddToCartFromModal}
        isInCart={previewVideo ? isInCart(previewVideo.id) : false}
      />
    </div>
  );
};

export default YouTubeTab;
