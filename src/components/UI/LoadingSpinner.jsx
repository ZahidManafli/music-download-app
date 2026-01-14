const LoadingSpinner = ({ 
  size = 'md', 
  text = '', 
  fullScreen = false,
  className = '' 
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const Spinner = () => (
    <div className={`relative ${sizes[size]}`}>
      {/* Outer ring */}
      <div 
        className={`
          absolute inset-0 rounded-full 
          border-4 border-white/10
        `}
      />
      {/* Spinning gradient ring */}
      <div 
        className={`
          absolute inset-0 rounded-full 
          border-4 border-transparent border-t-pink-500 border-r-purple-600
          animate-spin
        `}
      />
      {/* Inner glow */}
      <div 
        className={`
          absolute inset-2 rounded-full 
          bg-gradient-to-br from-pink-500/20 to-purple-600/20
          animate-pulse
        `}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
        <Spinner />
        {text && (
          <p className="mt-4 text-white text-lg animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Spinner />
      {text && (
        <p className="text-gray-400 text-sm animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
