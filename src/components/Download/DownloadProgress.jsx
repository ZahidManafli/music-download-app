import { FiDownload, FiCheck, FiX } from 'react-icons/fi';

const DownloadProgress = ({
  isVisible,
  progress = 0,
  currentTrack = '',
  totalTracks = 0,
  currentIndex = 0,
  status = 'downloading', // 'downloading' | 'complete' | 'error'
  onClose,
}) => {
  if (!isVisible) return null;

  const statusConfig = {
    downloading: {
      icon: FiDownload,
      iconClass: 'text-pink-500 animate-bounce',
      title: 'Downloading...',
      bgClass: 'from-pink-500/20 to-purple-500/20',
    },
    complete: {
      icon: FiCheck,
      iconClass: 'text-green-500',
      title: 'Download Complete!',
      bgClass: 'from-green-500/20 to-emerald-500/20',
    },
    error: {
      icon: FiX,
      iconClass: 'text-red-500',
      title: 'Download Failed',
      bgClass: 'from-red-500/20 to-orange-500/20',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
      <div className={`glass rounded-2xl p-4 w-80 bg-gradient-to-r ${config.bgClass}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Icon className={`w-5 h-5 ${config.iconClass}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium">{config.title}</h4>
            {status === 'downloading' && (
              <p className="text-sm text-gray-400 truncate">
                {currentTrack} ({currentIndex + 1}/{totalTracks})
              </p>
            )}
          </div>
          {(status === 'complete' || status === 'error') && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {status === 'downloading' && (
          <div className="mt-3">
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full progress-bar transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadProgress;
