import { useEffect } from 'react';
import { FiX, FiPlus, FiCheck, FiExternalLink, FiEye, FiThumbsUp, FiCalendar } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';
import { formatDuration } from '../../utils/helpers';
import { formatViewCount } from '../../services/youtubeApi';
import { Button } from '../UI';

const VideoPreviewModal = ({
  video,
  isOpen,
  onClose,
  onAddToCart,
  isInCart = false,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl glass rounded-2xl overflow-hidden animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* YouTube Embed */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={`${video.embedUrl}?autoplay=1&rel=0`}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Info */}
        <div className="p-6">
          {/* Title and badge */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white line-clamp-2">
                {video.title}
              </h2>
              <p className="text-gray-400 mt-1">{video.channel}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium shrink-0">
              <FaYoutube className="w-4 h-4" />
              <span>YouTube</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-1.5">
              <FiEye className="w-4 h-4" />
              <span>{formatViewCount(video.viewCount)}</span>
            </div>
            {video.likeCount > 0 && (
              <div className="flex items-center gap-1.5">
                <FiThumbsUp className="w-4 h-4" />
                <span>{formatViewCount(video.likeCount).replace(' views', '')}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <FiCalendar className="w-4 h-4" />
              <span>{formatDate(video.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-medium">{formatDuration(video.duration)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={isInCart ? 'secondary' : 'primary'}
              onClick={() => onAddToCart(video)}
              icon={isInCart ? FiCheck : FiPlus}
              className={isInCart ? 'bg-green-600/20 border-green-500/30 text-green-400' : ''}
            >
              {isInCart ? 'Added to Cart' : 'Add to Download Cart'}
            </Button>
            
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
            >
              <FiExternalLink className="w-4 h-4" />
              Open on YouTube
            </a>
          </div>

          {/* Backend notice */}
          <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-400">
              <strong>Note:</strong> Downloading YouTube videos requires a backend server. 
              Videos added to cart will be ready for download once you connect your backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal;
