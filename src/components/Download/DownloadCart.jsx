import { FiX, FiTrash2, FiDownload, FiMusic, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';
import { formatDuration, truncateText } from '../../utils/helpers';
import { Button } from '../UI';

// Check if YouTube backend is configured
const isYouTubeBackendConfigured = () => {
  return !!(import.meta.env.VITE_YOUTUBE_BACKEND_URL && import.meta.env.VITE_YOUTUBE_BACKEND_API_KEY);
};

const DownloadCart = ({
  isOpen,
  onClose,
  selectedTracks = [],
  onRemoveTrack,
  onClearAll,
  onDownloadAll,
  downloadProgress = null,
  isDownloading = false,
}) => {
  // Separate tracks by source
  const jamendoTracks = selectedTracks.filter(t => t.source !== 'youtube');
  const youtubeTracks = selectedTracks.filter(t => t.source === 'youtube');
  
  const totalDuration = selectedTracks.reduce((acc, track) => acc + (track.duration || 0), 0);
  const youtubeBackendReady = isYouTubeBackendConfigured();
  
  // Calculate total downloadable tracks
  const downloadableCount = jamendoTracks.length + (youtubeBackendReady ? youtubeTracks.length : 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Slide-out panel */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-full max-w-md
          glass border-l border-white/10
          transform transition-transform duration-300 ease-out z-50
          flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FiDownload className="w-5 h-5 text-pink-500" />
              Download Cart
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {selectedTracks.length} item{selectedTracks.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Track list */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <FiMusic className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Cart is empty</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Select tracks by clicking the + button on each track card to add them here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Free Music section */}
              {jamendoTracks.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiMusic className="w-4 h-4 text-pink-500" />
                    <span className="text-sm font-medium text-gray-300">
                      Free Music ({jamendoTracks.length})
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                      Ready to download
                    </span>
                  </div>
                  {jamendoTracks.map((track, index) => (
                    <div 
                      key={track.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group animate-fadeIn mb-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <img
                        src={track.image || '/placeholder-album.png'}
                        alt={track.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">
                          {truncateText(track.name || track.title, 25)}
                        </h4>
                        <p className="text-sm text-gray-400 truncate">
                          {track.artist || track.channel}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDuration(track.duration)}
                      </span>
                      <button
                        onClick={() => onRemoveTrack(track.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* YouTube section */}
              {youtubeTracks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FaYoutube className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-300">
                      YouTube ({youtubeTracks.length})
                    </span>
                    {youtubeBackendReady ? (
                      <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 flex items-center gap-1">
                        <FiCheck className="w-3 h-3" />
                        Backend ready
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">
                        Backend not configured
                      </span>
                    )}
                  </div>
                  {youtubeTracks.map((track, index) => (
                    <div 
                      key={track.id}
                      className={`flex items-center gap-3 p-3 rounded-xl group animate-fadeIn mb-2 ${
                        youtubeBackendReady 
                          ? 'bg-green-500/5 border border-green-500/20' 
                          : 'bg-red-500/5 border border-red-500/20'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative">
                        <img
                          src={track.image || track.thumbnail}
                          alt={track.name || track.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                          <FaYoutube className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">
                          {truncateText(track.name || track.title, 25)}
                        </h4>
                        <p className="text-sm text-gray-400 truncate">
                          {track.artist || track.channel}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDuration(track.duration)}
                      </span>
                      <button
                        onClick={() => onRemoveTrack(track.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedTracks.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4">
            {/* YouTube backend notice */}
            {youtubeTracks.length > 0 && !youtubeBackendReady && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <FiAlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-yellow-400 font-medium">Backend not configured</p>
                  <p className="text-yellow-400/70 mt-1">
                    Add VITE_YOUTUBE_BACKEND_URL and VITE_YOUTUBE_BACKEND_API_KEY to your .env file to download YouTube videos.
                  </p>
                </div>
              </div>
            )}

            {/* Backend configured success notice */}
            {youtubeTracks.length > 0 && youtubeBackendReady && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <FiCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-green-400 font-medium">YouTube backend connected</p>
                  <p className="text-green-400/70 mt-1">
                    {youtubeTracks.length} YouTube video{youtubeTracks.length !== 1 ? 's' : ''} ready to download.
                  </p>
                </div>
              </div>
            )}

            {/* Download progress */}
            {downloadProgress !== null && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Downloading...</span>
                  <span className="text-white">{Math.round(downloadProgress)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full progress-bar transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Total duration:</span>
                <span className="text-white font-medium">{formatDuration(totalDuration)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Ready to download:</span>
                <span className="text-green-400 font-medium">
                  {downloadableCount} item{downloadableCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={onClearAll}
                disabled={isDownloading}
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={onDownloadAll}
                loading={isDownloading}
                disabled={isDownloading || downloadableCount === 0}
              >
                <FiDownload className="w-4 h-4 mr-2" />
                {downloadableCount > 0 
                  ? `Download (${downloadableCount})`
                  : 'No downloads available'
                }
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DownloadCart;
