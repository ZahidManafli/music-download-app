import MusicBrainzCard from './MusicBrainzCard';
import { LoadingSpinner } from '../UI';
import { FiMusic, FiUser, FiDisc, FiSearch, FiDatabase } from 'react-icons/fi';

const MusicBrainzGrid = ({
  results = [],
  loading = false,
  error = null,
  hasSearched = false,
  entityType = 'recording',
  onPreview,
  onCrossSearch,
  onLoadMore,
  hasMore = false,
}) => {
  // Get entity-specific icon and colors
  const getEntityConfig = () => {
    switch (entityType) {
      case 'artist':
        return {
          icon: FiUser,
          color: 'purple',
          label: 'artists',
          searchHint: 'Search for artists by name',
        };
      case 'release':
        return {
          icon: FiDisc,
          color: 'blue',
          label: 'albums',
          searchHint: 'Search for albums, singles, or EPs',
        };
      case 'recording':
      default:
        return {
          icon: FiMusic,
          color: 'orange',
          label: 'tracks',
          searchHint: 'Search for songs and recordings',
        };
    }
  };

  const config = getEntityConfig();
  const EntityIcon = config.icon;

  // Loading state
  if (loading && results.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Searching MusicBrainz..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className={`w-20 h-20 rounded-full bg-${config.color}-500/10 flex items-center justify-center mb-4`}>
          <FiDatabase className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
        <p className="text-gray-400 max-w-md">{error}</p>
      </div>
    );
  }

  // Initial state (no search yet)
  if (!hasSearched && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className={`w-24 h-24 rounded-full bg-${config.color}-500/10 flex items-center justify-center mb-6`}>
          <EntityIcon className={`w-12 h-12 text-${config.color}-500`} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Search MusicBrainz</h3>
        <p className="text-gray-400 max-w-md mb-6">
          Explore the world's largest open music encyclopedia. Search for {config.label} and find detailed metadata, then search YouTube to download.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiSearch className="w-4 h-4" />
          <span>{config.searchHint}</span>
        </div>
      </div>
    );
  }

  // No results
  if (hasSearched && !loading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <FiSearch className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No {config.label} found</h3>
        <p className="text-gray-400 max-w-md">
          Try different keywords or check your spelling. You can also try searching for a different entity type.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.map((entity, index) => (
          <div 
            key={entity.id} 
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <MusicBrainzCard
              entity={entity}
              onPreview={onPreview}
              onCrossSearch={onCrossSearch}
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

export default MusicBrainzGrid;
