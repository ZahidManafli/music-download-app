import { FiPlay, FiPause, FiDownload, FiCheck, FiPlus } from 'react-icons/fi';
import { formatDuration, truncateText } from '../../utils/helpers';

const MusicCard = ({
  track,
  isSelected = false,
  isPlaying = false,
  onSelect,
  onPlay,
  onDownload,
}) => {
  return (
    <div 
      className={`
        music-card group relative rounded-2xl overflow-hidden
        glass border transition-all duration-300
        ${isSelected 
          ? 'border-pink-500/50 ring-2 ring-pink-500/30' 
          : 'border-white/10 hover:border-white/20'
        }
      `}
    >
      {/* Album Art */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={track.image || '/placeholder-album.png'}
          alt={track.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {/* Play button */}
          <button
            onClick={() => onPlay(track)}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-all transform hover:scale-110"
          >
            {isPlaying ? (
              <FiPause className="w-5 h-5 text-white" />
            ) : (
              <FiPlay className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>
          
          {/* Download button */}
          <button
            onClick={() => onDownload(track)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-all transform hover:scale-110"
          >
            <FiDownload className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Selection checkbox */}
        <button
          onClick={() => onSelect(track)}
          className={`
            absolute top-3 right-3 w-8 h-8 rounded-lg
            flex items-center justify-center
            transition-all duration-200
            ${isSelected 
              ? 'gradient-btn text-white' 
              : 'bg-black/50 backdrop-blur text-white/70 hover:text-white opacity-0 group-hover:opacity-100'
            }
            ${isSelected ? 'opacity-100' : ''}
          `}
        >
          {isSelected ? (
            <FiCheck className="w-4 h-4" />
          ) : (
            <FiPlus className="w-4 h-4" />
          )}
        </button>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur text-xs text-white font-medium">
          {formatDuration(track.duration)}
        </div>
      </div>

      {/* Track Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white truncate group-hover:text-pink-400 transition-colors">
          {truncateText(track.name, 25)}
        </h3>
        <p className="text-sm text-gray-400 truncate mt-1">
          {truncateText(track.artist, 25)}
        </p>
        {track.album && (
          <p className="text-xs text-gray-500 truncate mt-1">
            {truncateText(track.album, 30)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MusicCard;
