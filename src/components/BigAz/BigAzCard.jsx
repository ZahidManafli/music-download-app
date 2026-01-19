import { FiPlay, FiCheck, FiPlus, FiMusic } from 'react-icons/fi';
import { truncateText } from '../../utils/helpers';

const BigAzCard = ({
  song,
  isSelected = false,
  onSelect,
  onPreview,
}) => {
  const handlePreviewClick = (e) => {
    e.stopPropagation();
    onPreview(song);
  };

  const handleSelectClick = (e) => {
    e.stopPropagation();
    onSelect(song);
  };

  return (
    <div 
      className={`
        music-card group relative rounded-2xl overflow-hidden
        glass border transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'border-blue-500/50 ring-2 ring-blue-500/30' 
          : 'border-white/10 hover:border-white/20'
        }
      `}
      onClick={handlePreviewClick}
    >
      {/* Thumbnail placeholder */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <FiMusic className="w-16 h-16 text-blue-400/50" />
        </div>
        
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center transform hover:scale-110 transition-transform">
            <FiPlay className="w-7 h-7 text-white ml-1" />
          </div>
        </div>

        {/* Big.az badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-600 text-white text-xs font-medium">
          <span>Big.az</span>
        </div>

        {/* Selection checkbox */}
        <button
          onClick={handleSelectClick}
          className={`
            absolute top-3 right-3 w-8 h-8 rounded-lg
            flex items-center justify-center
            transition-all duration-200
            ${isSelected 
              ? 'bg-blue-600 text-white' 
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
      </div>

      {/* Song Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors min-h-[2.5rem]">
          {truncateText(song.title, 60)}
        </h3>
        <p className="text-sm text-gray-400 truncate mt-1">
          {song.artist}
        </p>
      </div>
    </div>
  );
};

export default BigAzCard;
