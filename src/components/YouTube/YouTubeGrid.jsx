import YouTubeCard from './YouTubeCard';
import { LoadingSpinner } from '../UI';
import { FaYoutube } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const YouTubeGrid = ({
  videos = [],
  selectedVideos = [],
  loading = false,
  error = null,
  hasSearched = false,
  onSelect,
  onPreview,
  onLoadMore,
  hasMore = false,
}) => {
  // Loading state
  if (loading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Searching YouTube..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <FaYoutube className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
        <p className="text-gray-400 max-w-md">{error}</p>
      </div>
    );
  }

  // Initial state (no search yet)
  if (!hasSearched && videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <FaYoutube className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Search YouTube Music</h3>
        <p className="text-gray-400 max-w-md mb-6">
          Search for your favorite music on YouTube. You can preview, select multiple videos, and add them to your download cart.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiSearch className="w-4 h-4" />
          <span>Enter a search term above to get started</span>
        </div>
      </div>
    );
  }

  // No results
  if (hasSearched && !loading && videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <FiSearch className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
        <p className="text-gray-400 max-w-md">
          Try different keywords or check your spelling.
        </p>
      </div>
    );
  }

  const isVideoSelected = (video) => selectedVideos.some(v => v.id === video.id);

  return (
    <div>
      {/* Results grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <YouTubeCard
              video={video}
              isSelected={isVideoSelected(video)}
              onSelect={onSelect}
              onPreview={onPreview}
            />
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default YouTubeGrid;
