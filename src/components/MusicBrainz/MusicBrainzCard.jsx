import { useState } from 'react';
import { FiMusic, FiUser, FiDisc, FiClock, FiCalendar, FiMapPin, FiExternalLink, FiSearch } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';
import { formatDuration, truncateText } from '../../utils/helpers';

// Default placeholder image for when cover art is not available
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 250 250"%3E%3Crect fill="%231a1a2e" width="250" height="250"/%3E%3Cg fill="%234a4a6a"%3E%3Ccircle cx="125" cy="100" r="40"/%3E%3Crect x="85" y="150" width="80" height="60" rx="5"/%3E%3C/g%3E%3C/svg%3E';

const MusicBrainzCard = ({
  entity,
  onPreview,
  onCrossSearch,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    onPreview?.(entity);
  };

  const handleCrossSearchClick = (e) => {
    e.stopPropagation();
    onCrossSearch?.(entity);
  };

  // Get entity-specific icon
  const getEntityIcon = () => {
    switch (entity.entityType) {
      case 'artist':
        return FiUser;
      case 'release':
        return FiDisc;
      case 'recording':
      default:
        return FiMusic;
    }
  };

  // Get entity-specific badge color
  const getBadgeColor = () => {
    switch (entity.entityType) {
      case 'artist':
        return 'bg-purple-600';
      case 'release':
        return 'bg-blue-600';
      case 'recording':
      default:
        return 'bg-orange-600';
    }
  };

  // Get entity-specific label
  const getEntityLabel = () => {
    switch (entity.entityType) {
      case 'artist':
        return entity.type || 'Artist';
      case 'release':
        return entity.releaseGroupType || 'Release';
      case 'recording':
      default:
        return 'Track';
    }
  };

  const EntityIcon = getEntityIcon();
  const imageUrl = !imageError && entity.thumbnail ? entity.thumbnail : PLACEHOLDER_IMAGE;

  // Render recording card
  const renderRecordingContent = () => (
    <>
      <h3 className="font-semibold text-white line-clamp-2 group-hover:text-orange-400 transition-colors min-h-[2.5rem]">
        {truncateText(entity.title, 60)}
      </h3>
      <p className="text-sm text-gray-400 truncate mt-1">
        {entity.artist}
      </p>
      {entity.album && (
        <p className="text-xs text-gray-500 truncate mt-1">
          <FiDisc className="inline w-3 h-3 mr-1" />
          {entity.album}
        </p>
      )}
      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        {entity.duration > 0 && (
          <span className="flex items-center gap-1">
            <FiClock className="w-3 h-3" />
            {formatDuration(entity.duration)}
          </span>
        )}
        {entity.releaseYear && (
          <span className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            {entity.releaseYear}
          </span>
        )}
      </div>
    </>
  );

  // Render artist card
  const renderArtistContent = () => (
    <>
      <h3 className="font-semibold text-white line-clamp-2 group-hover:text-purple-400 transition-colors min-h-[2.5rem]">
        {entity.name}
      </h3>
      {entity.disambiguation && (
        <p className="text-sm text-gray-400 truncate mt-1">
          {entity.disambiguation}
        </p>
      )}
      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        {entity.country && (
          <span className="flex items-center gap-1">
            <FiMapPin className="w-3 h-3" />
            {entity.country}
          </span>
        )}
        {entity.beginDate && (
          <span className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            {entity.beginDate.substring(0, 4)}
            {entity.endDate ? ` - ${entity.endDate.substring(0, 4)}` : entity.isActive ? ' - Present' : ''}
          </span>
        )}
      </div>
      {entity.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {entity.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );

  // Render release card
  const renderReleaseContent = () => (
    <>
      <h3 className="font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors min-h-[2.5rem]">
        {truncateText(entity.title, 60)}
      </h3>
      <p className="text-sm text-gray-400 truncate mt-1">
        {entity.artist}
      </p>
      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        {entity.releaseYear && (
          <span className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            {entity.releaseYear}
          </span>
        )}
        {entity.trackCount > 0 && (
          <span className="flex items-center gap-1">
            <FiMusic className="w-3 h-3" />
            {entity.trackCount} tracks
          </span>
        )}
        {entity.country && (
          <span className="flex items-center gap-1">
            <FiMapPin className="w-3 h-3" />
            {entity.country}
          </span>
        )}
      </div>
      {entity.label && (
        <p className="text-xs text-gray-500 truncate mt-1">
          {entity.label}
        </p>
      )}
    </>
  );

  // Render content based on entity type
  const renderContent = () => {
    switch (entity.entityType) {
      case 'artist':
        return renderArtistContent();
      case 'release':
        return renderReleaseContent();
      case 'recording':
      default:
        return renderRecordingContent();
    }
  };

  // Get hover color class based on entity type
  const getHoverBorderColor = () => {
    switch (entity.entityType) {
      case 'artist':
        return 'hover:border-purple-500/30';
      case 'release':
        return 'hover:border-blue-500/30';
      case 'recording':
      default:
        return 'hover:border-orange-500/30';
    }
  };

  return (
    <div 
      className={`
        music-card group relative rounded-2xl overflow-hidden
        glass border border-white/10 transition-all duration-300 cursor-pointer
        ${getHoverBorderColor()}
      `}
      onClick={handlePreviewClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <img
          src={imageUrl}
          alt={entity.title || entity.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={handleImageError}
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handlePreviewClick}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
            title="View Details"
          >
            <FiExternalLink className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleCrossSearchClick}
            className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-500 transition-colors"
            title="Search on YouTube"
          >
            <FaYoutube className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Entity type badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md ${getBadgeColor()} text-white text-xs font-medium`}>
          <EntityIcon className="w-3.5 h-3.5" />
          <span>{getEntityLabel()}</span>
        </div>

        {/* Score badge (relevance) */}
        {entity.score > 0 && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-xs text-white font-medium">
            {entity.score}%
          </div>
        )}
      </div>

      {/* Entity Info */}
      <div className="p-4">
        {renderContent()}
      </div>

      {/* YouTube search button at bottom */}
      <div className="px-4 pb-4">
        <button
          onClick={handleCrossSearchClick}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium transition-colors"
        >
          <FiSearch className="w-4 h-4" />
          Search on YouTube
        </button>
      </div>
    </div>
  );
};

export default MusicBrainzCard;
