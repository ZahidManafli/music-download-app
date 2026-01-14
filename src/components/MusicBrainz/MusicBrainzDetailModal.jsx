import { useState, useEffect } from 'react';
import { 
  FiX, FiMusic, FiUser, FiDisc, FiClock, FiCalendar, 
  FiMapPin, FiExternalLink, FiTag, FiHash, FiList
} from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';
import { formatDuration } from '../../utils/helpers';
import { getCoverArtUrl, getRecordingDetails, getArtistDetails, getReleaseDetails } from '../../services/musicbrainzApi';

// Default placeholder image
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%231a1a2e" width="400" height="400"/%3E%3Cg fill="%234a4a6a"%3E%3Ccircle cx="200" cy="160" r="60"/%3E%3Crect x="140" y="240" width="120" height="80" rx="8"/%3E%3C/g%3E%3C/svg%3E';

const MusicBrainzDetailModal = ({
  entity,
  isOpen,
  onClose,
  onCrossSearch,
}) => {
  const [imageError, setImageError] = useState(false);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Load full details when modal opens
  useEffect(() => {
    if (isOpen && entity?.mbid) {
      setLoadingDetails(true);
      setDetails(null);
      
      const loadDetails = async () => {
        try {
          let fullDetails;
          switch (entity.entityType) {
            case 'artist':
              fullDetails = await getArtistDetails(entity.mbid);
              break;
            case 'release':
              fullDetails = await getReleaseDetails(entity.mbid);
              break;
            case 'recording':
            default:
              fullDetails = await getRecordingDetails(entity.mbid);
              break;
          }
          setDetails(fullDetails);
        } catch (err) {
          console.error('Failed to load details:', err);
        } finally {
          setLoadingDetails(false);
        }
      };
      
      loadDetails();
    }
  }, [isOpen, entity?.mbid, entity?.entityType]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setImageError(false);
      setDetails(null);
    }
  }, [isOpen]);

  if (!isOpen || !entity) return null;

  const displayEntity = details || entity;
  const imageUrl = !imageError && displayEntity.image ? displayEntity.image : PLACEHOLDER_IMAGE;

  // Get entity-specific colors
  const getColors = () => {
    switch (entity.entityType) {
      case 'artist':
        return { primary: 'purple', bg: 'bg-purple-600', text: 'text-purple-400' };
      case 'release':
        return { primary: 'blue', bg: 'bg-blue-600', text: 'text-blue-400' };
      case 'recording':
      default:
        return { primary: 'orange', bg: 'bg-orange-600', text: 'text-orange-400' };
    }
  };

  const colors = getColors();

  // Render recording details
  const renderRecordingDetails = () => (
    <div className="space-y-4">
      {/* Artist */}
      <div className="flex items-start gap-3">
        <FiUser className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-400">Artist</p>
          <p className="text-white">{displayEntity.artist}</p>
        </div>
      </div>

      {/* Album */}
      {displayEntity.album && (
        <div className="flex items-start gap-3">
          <FiDisc className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Album</p>
            <p className="text-white">{displayEntity.album}</p>
          </div>
        </div>
      )}

      {/* Duration */}
      {displayEntity.duration > 0 && (
        <div className="flex items-start gap-3">
          <FiClock className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Duration</p>
            <p className="text-white">{formatDuration(displayEntity.duration)}</p>
          </div>
        </div>
      )}

      {/* Release Date */}
      {displayEntity.releaseDate && (
        <div className="flex items-start gap-3">
          <FiCalendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Release Date</p>
            <p className="text-white">{displayEntity.releaseDate}</p>
          </div>
        </div>
      )}

      {/* ISRC */}
      {displayEntity.isrc && (
        <div className="flex items-start gap-3">
          <FiHash className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">ISRC</p>
            <p className="text-white font-mono text-sm">{displayEntity.isrc}</p>
          </div>
        </div>
      )}

      {/* Tags */}
      {displayEntity.tags?.length > 0 && (
        <div className="flex items-start gap-3">
          <FiTag className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {displayEntity.tags.slice(0, 10).map((tag, index) => (
                <span 
                  key={index} 
                  className={`px-2 py-1 text-xs rounded-full ${colors.bg}/20 ${colors.text}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render artist details
  const renderArtistDetails = () => (
    <div className="space-y-4">
      {/* Type */}
      {displayEntity.type && (
        <div className="flex items-start gap-3">
          <FiUser className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Type</p>
            <p className="text-white">{displayEntity.type}</p>
          </div>
        </div>
      )}

      {/* Country/Area */}
      {(displayEntity.country || displayEntity.area) && (
        <div className="flex items-start gap-3">
          <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Location</p>
            <p className="text-white">{displayEntity.area || displayEntity.country}</p>
          </div>
        </div>
      )}

      {/* Active Years */}
      {displayEntity.beginDate && (
        <div className="flex items-start gap-3">
          <FiCalendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Active</p>
            <p className="text-white">
              {displayEntity.beginDate.substring(0, 4)}
              {displayEntity.endDate 
                ? ` - ${displayEntity.endDate.substring(0, 4)}` 
                : displayEntity.isActive 
                  ? ' - Present' 
                  : ''
              }
            </p>
          </div>
        </div>
      )}

      {/* Genres */}
      {displayEntity.genres?.length > 0 && (
        <div className="flex items-start gap-3">
          <FiMusic className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400 mb-2">Genres</p>
            <div className="flex flex-wrap gap-2">
              {displayEntity.genres.slice(0, 10).map((genre, index) => (
                <span 
                  key={index} 
                  className={`px-2 py-1 text-xs rounded-full ${colors.bg}/20 ${colors.text}`}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {displayEntity.tags?.length > 0 && (
        <div className="flex items-start gap-3">
          <FiTag className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {displayEntity.tags.slice(0, 10).map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 text-xs rounded-full bg-white/10 text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Release Groups */}
      {details?.releaseGroups?.length > 0 && (
        <div className="flex items-start gap-3">
          <FiList className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-2">Discography</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {details.releaseGroups.slice(0, 10).map((rg, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-white truncate flex-1 mr-2">{rg.title}</span>
                  <span className="text-gray-500 shrink-0">
                    {rg.type} • {rg.firstReleaseDate?.substring(0, 4) || 'Unknown'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render release details
  const renderReleaseDetails = () => (
    <div className="space-y-4">
      {/* Artist */}
      <div className="flex items-start gap-3">
        <FiUser className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-400">Artist</p>
          <p className="text-white">{displayEntity.artist}</p>
        </div>
      </div>

      {/* Release Type */}
      {displayEntity.releaseGroupType && (
        <div className="flex items-start gap-3">
          <FiDisc className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Type</p>
            <p className="text-white">{displayEntity.releaseGroupType}</p>
          </div>
        </div>
      )}

      {/* Release Date */}
      {displayEntity.releaseDate && (
        <div className="flex items-start gap-3">
          <FiCalendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Release Date</p>
            <p className="text-white">{displayEntity.releaseDate}</p>
          </div>
        </div>
      )}

      {/* Country */}
      {displayEntity.country && (
        <div className="flex items-start gap-3">
          <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Country</p>
            <p className="text-white">{displayEntity.country}</p>
          </div>
        </div>
      )}

      {/* Label */}
      {displayEntity.label && (
        <div className="flex items-start gap-3">
          <FiTag className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Label</p>
            <p className="text-white">{displayEntity.label}</p>
            {displayEntity.catalogNumber && (
              <p className="text-sm text-gray-500">{displayEntity.catalogNumber}</p>
            )}
          </div>
        </div>
      )}

      {/* Track Count */}
      {displayEntity.trackCount > 0 && (
        <div className="flex items-start gap-3">
          <FiMusic className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Tracks</p>
            <p className="text-white">{displayEntity.trackCount} tracks</p>
          </div>
        </div>
      )}

      {/* Barcode */}
      {displayEntity.barcode && (
        <div className="flex items-start gap-3">
          <FiHash className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-400">Barcode</p>
            <p className="text-white font-mono text-sm">{displayEntity.barcode}</p>
          </div>
        </div>
      )}

      {/* Track Listing */}
      {details?.media?.length > 0 && (
        <div className="flex items-start gap-3">
          <FiList className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-2">Track Listing</p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {details.media.map((medium, mIndex) => (
                <div key={mIndex}>
                  {details.media.length > 1 && (
                    <p className="text-xs text-gray-500 mb-1">
                      {medium.format || 'Medium'} {medium.position}
                    </p>
                  )}
                  {medium.tracks?.map((track, tIndex) => (
                    <div key={tIndex} className="flex items-center justify-between text-sm py-1">
                      <span className="text-gray-500 w-8">{track.number || track.position}.</span>
                      <span className="text-white flex-1 truncate">{track.title}</span>
                      {track.length > 0 && (
                        <span className="text-gray-500 ml-2">{formatDuration(track.length)}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render details based on entity type
  const renderDetails = () => {
    if (loadingDetails) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
        </div>
      );
    }

    switch (entity.entityType) {
      case 'artist':
        return renderArtistDetails();
      case 'release':
        return renderReleaseDetails();
      case 'recording':
      default:
        return renderRecordingDetails();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl glass border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0">
            <img
              src={imageUrl}
              alt={displayEntity.title || displayEntity.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md ${colors.bg} text-white text-xs font-medium`}>
              {entity.entityType === 'artist' ? (
                <><FiUser className="w-3.5 h-3.5" /><span>{displayEntity.type || 'Artist'}</span></>
              ) : entity.entityType === 'release' ? (
                <><FiDisc className="w-3.5 h-3.5" /><span>{displayEntity.releaseGroupType || 'Release'}</span></>
              ) : (
                <><FiMusic className="w-3.5 h-3.5" /><span>Track</span></>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-1">
              {displayEntity.title || displayEntity.name}
            </h2>
            
            {/* Disambiguation */}
            {displayEntity.disambiguation && (
              <p className="text-gray-400 text-sm mb-4">
                {displayEntity.disambiguation}
              </p>
            )}

            {/* Details section */}
            <div className="mt-4">
              {renderDetails()}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => onCrossSearch?.(displayEntity)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
              >
                <FaYoutube className="w-5 h-5" />
                Search on YouTube
              </button>
              
              <a
                href={`https://musicbrainz.org/${entity.entityType}/${entity.mbid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                <FiExternalLink className="w-5 h-5" />
                View on MusicBrainz
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicBrainzDetailModal;
