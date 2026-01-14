import { 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiVolume2, 
  FiVolumeX,
  FiDownload,
  FiX
} from 'react-icons/fi';
import { formatDuration, truncateText } from '../../utils/helpers';

const MusicPlayer = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLoading,
  progress,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onSkip,
  onDownload,
  onClose,
}) => {
  if (!currentTrack) return null;

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    onSeek(percentage);
  };

  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    onVolumeChange(percentage);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Track info */}
          <div className="flex items-center gap-3 min-w-0 w-1/4">
            <img
              src={currentTrack.image || '/placeholder-album.png'}
              alt={currentTrack.name}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h4 className="font-medium text-white truncate">
                {truncateText(currentTrack.name, 20)}
              </h4>
              <p className="text-sm text-gray-400 truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col items-center gap-2">
            {/* Play controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onSkip(-10)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <FiSkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={onTogglePlay}
                disabled={isLoading}
                className="w-12 h-12 rounded-full gradient-btn flex items-center justify-center text-white disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <FiPause className="w-5 h-5" />
                ) : (
                  <FiPlay className="w-5 h-5 ml-0.5" />
                )}
              </button>
              
              <button
                onClick={() => onSkip(10)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <FiSkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xl flex items-center gap-3">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatDuration(currentTime)}
              </span>
              
              <div 
                className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full progress-bar rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              
              <span className="text-xs text-gray-400 w-10">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Volume & Actions */}
          <div className="flex items-center gap-4 w-1/4 justify-end">
            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onToggleMute}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <FiVolumeX className="w-5 h-5" />
                ) : (
                  <FiVolume2 className="w-5 h-5" />
                )}
              </button>
              
              <div 
                className="w-24 h-1.5 bg-white/10 rounded-full cursor-pointer"
                onClick={handleVolumeClick}
              >
                <div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>

            {/* Download */}
            <button
              onClick={() => onDownload(currentTrack)}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <FiDownload className="w-5 h-5" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
