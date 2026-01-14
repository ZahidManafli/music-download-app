import { FiPlay, FiPause, FiDownload, FiCheck, FiPlus, FiMoreVertical } from 'react-icons/fi';
import { formatDuration, truncateText } from '../../utils/helpers';
import { LoadingSpinner } from '../UI';

const MusicListItem = ({
  track,
  index,
  isSelected,
  isPlaying,
  onSelect,
  onPlay,
  onDownload,
}) => {
  return (
    <div 
      className={`
        group flex items-center gap-4 p-3 rounded-xl
        transition-all duration-200
        ${isSelected 
          ? 'bg-pink-500/10 border border-pink-500/30' 
          : 'hover:bg-white/5 border border-transparent'
        }
      `}
    >
      {/* Index / Play indicator */}
      <div className="w-8 text-center">
        <span className="text-gray-500 text-sm group-hover:hidden">
          {index + 1}
        </span>
        <button
          onClick={() => onPlay(track)}
          className="hidden group-hover:block text-white"
        >
          {isPlaying ? (
            <FiPause className="w-4 h-4 mx-auto" />
          ) : (
            <FiPlay className="w-4 h-4 mx-auto" />
          )}
        </button>
      </div>

      {/* Album art */}
      <img
        src={track.image || '/placeholder-album.png'}
        alt={track.name}
        className="w-12 h-12 rounded-lg object-cover"
        loading="lazy"
      />

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium truncate ${isPlaying ? 'text-pink-400' : 'text-white'}`}>
          {track.name}
        </h4>
        <p className="text-sm text-gray-400 truncate">
          {track.artist}
        </p>
      </div>

      {/* Album */}
      <div className="hidden md:block w-48 text-sm text-gray-400 truncate">
        {truncateText(track.album, 25)}
      </div>

      {/* Duration */}
      <div className="w-16 text-right text-sm text-gray-400">
        {formatDuration(track.duration)}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onSelect(track)}
          className={`
            p-2 rounded-lg transition-colors
            ${isSelected 
              ? 'bg-pink-500 text-white' 
              : 'hover:bg-white/10 text-gray-400 hover:text-white'
            }
          `}
        >
          {isSelected ? (
            <FiCheck className="w-4 h-4" />
          ) : (
            <FiPlus className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={() => onDownload(track)}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <FiDownload className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const MusicList = ({
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
      {/* Header */}
      <div className="flex items-center gap-4 px-3 py-2 text-sm text-gray-500 border-b border-white/10">
        <div className="w-8 text-center">#</div>
        <div className="w-12" />
        <div className="flex-1">Title</div>
        <div className="hidden md:block w-48">Album</div>
        <div className="w-16 text-right">Duration</div>
        <div className="w-20" />
      </div>

      {/* Track list */}
      <div className="space-y-1 mt-2">
        {tracks.map((track, index) => (
          <MusicListItem
            key={track.id}
            track={track}
            index={index}
            isSelected={isTrackSelected(track)}
            isPlaying={isTrackPlaying(track)}
            onSelect={onSelect}
            onPlay={onPlay}
            onDownload={onDownload}
          />
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

export default MusicList;
