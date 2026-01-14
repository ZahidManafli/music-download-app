import { FiPlay, FiCheck, FiPlus, FiEye } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';
import { formatDuration, truncateText } from '../../utils/helpers';
import { formatViewCount } from '../../services/youtubeApi';

const YouTubeCard = ({
  video,
  isSelected = false,
  onSelect,
  onPreview,
}) => {
  const handlePreviewClick = (e) => {
    e.stopPropagation();
    onPreview(video);
  };

  const handleSelectClick = (e) => {
    e.stopPropagation();
    onSelect(video);
  };

  return (
    <div 
      className={`
        music-card group relative rounded-2xl overflow-hidden
        glass border transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'border-red-500/50 ring-2 ring-red-500/30' 
          : 'border-white/10 hover:border-white/20'
        }
      `}
      onClick={handlePreviewClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center transform hover:scale-110 transition-transform">
            <FiPlay className="w-7 h-7 text-white ml-1" />
          </div>
        </div>

        {/* YouTube badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-600 text-white text-xs font-medium">
          <FaYoutube className="w-3.5 h-3.5" />
          <span>YouTube</span>
        </div>

        {/* Selection checkbox */}
        <button
          onClick={handleSelectClick}
          className={`
            absolute top-3 right-3 w-8 h-8 rounded-lg
            flex items-center justify-center
            transition-all duration-200
            ${isSelected 
              ? 'bg-red-600 text-white' 
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
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/80 text-xs text-white font-medium">
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-red-400 transition-colors min-h-[2.5rem]">
          {truncateText(video.title, 60)}
        </h3>
        <p className="text-sm text-gray-400 truncate mt-1">
          {video.channel}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <FiEye className="w-3.5 h-3.5" />
          <span>{formatViewCount(video.viewCount)}</span>
        </div>
      </div>
    </div>
  );
};

export default YouTubeCard;
