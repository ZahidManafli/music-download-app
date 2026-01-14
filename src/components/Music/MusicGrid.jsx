import MusicCard from './MusicCard';
import { LoadingSpinner } from '../UI';

const MusicGrid = ({
  tracks = [],
  selectedTracks = [],
  currentTrack = null,
  isPlaying = false,
  loading = false,
  onSelect,
  onPlay,
  onDownload,
  onLoadMore,
  hasMore = false,
}) => {
  if (loading && tracks.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Loading tracks..." />
      </div>
    );
  }

  if (!loading && tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <span className="text-4xl">🎵</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No tracks found</h3>
        <p className="text-gray-400 max-w-md">
          Try adjusting your filters or search query to find more music.
        </p>
      </div>
    );
  }

  const isTrackSelected = (track) => selectedTracks.some(t => t.id === track.id);
  const isTrackPlaying = (track) => currentTrack?.id === track.id && isPlaying;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tracks.map((track, index) => (
          <div 
            key={track.id} 
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <MusicCard
              track={track}
              isSelected={isTrackSelected(track)}
              isPlaying={isTrackPlaying(track)}
              onSelect={onSelect}
              onPlay={onPlay}
              onDownload={onDownload}
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

export default MusicGrid;
