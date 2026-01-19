import { useState, useEffect, useRef } from 'react';
import { FiX, FiPlus, FiCheck, FiExternalLink, FiPlay, FiPause, FiDownload, FiMusic } from 'react-icons/fi';
import { Button } from '../UI';
import { getSongDetails, getAudioUrl } from '../../services/bigazApi';

const BigAzDetailModal = ({
  song,
  isOpen,
  onClose,
  onAddToCart,
  isInCart = false,
}) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songDetails, setSongDetails] = useState(null);
  const audioRef = useRef(null);

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

  // Fetch song details and audio URL when modal opens
  useEffect(() => {
    if (isOpen && song) {
      fetchAudioUrl();
    } else {
      // Reset state when modal closes
      setAudioUrl(null);
      setError(null);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isOpen, song]);

  const fetchAudioUrl = async () => {
    if (!song) return;

    setLoading(true);
    setError(null);

    try {
      // First, fetch song details to get audio parameters
      const details = await getSongDetails(song.htmlFileName);
      setSongDetails(details);

      // Then fetch audio URL
      const url = await getAudioUrl(song.id, details.audioParams);
      setAudioUrl(url);
    } catch (err) {
      console.error('Error fetching audio URL:', err);
      setError(err.message || 'Failed to load audio');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  if (!isOpen || !song) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl glass rounded-2xl overflow-hidden animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Song Info */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center shrink-0">
              <FiMusic className="w-10 h-10 text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white line-clamp-2 mb-1">
                {song.title}
              </h2>
              <p className="text-gray-400">{song.artist}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium shrink-0">
              <span>Big.az</span>
            </div>
          </div>

          {/* Audio Player */}
          <div className="mb-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-400">Loading audio...</div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                <p className="text-sm text-red-400">{error}</p>
                <button
                  onClick={fetchAudioUrl}
                  className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {audioUrl && !loading && (
              <div className="space-y-4">
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={handleAudioEnded}
                  onPlay={handleAudioPlay}
                  onPause={handleAudioPause}
                  className="w-full"
                  controls
                />
                
                {/* Custom controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayPause}
                    disabled={!audioUrl}
                    className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                  >
                    {isPlaying ? (
                      <FiPause className="w-6 h-6" />
                    ) : (
                      <FiPlay className="w-6 h-6 ml-0.5" />
                    )}
                  </button>
                  
                  <div className="flex-1 text-sm text-gray-400">
                    {audioUrl && (
                      <a
                        href={audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline truncate block"
                      >
                        {audioUrl}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={isInCart ? 'secondary' : 'primary'}
              onClick={() => onAddToCart(song)}
              icon={isInCart ? FiCheck : FiPlus}
              className={isInCart ? 'bg-green-600/20 border-green-500/30 text-green-400' : ''}
            >
              {isInCart ? 'Added to Cart' : 'Add to Download Cart'}
            </Button>
            
            {song.htmlFileName && (
              <a
                href={`https://mp3.big.az/${song.htmlFileName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
              >
                <FiExternalLink className="w-4 h-4" />
                Open on Big.az
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BigAzDetailModal;
