import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchInput = ({ 
  value = '', 
  onChange, 
  onClear,
  placeholder = 'Search music, artists, albums...', 
  className = '',
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
    inputRef.current?.focus();
  };

  return (
    <div 
      className={`
        relative flex items-center w-full
        ${isFocused ? 'ring-2 ring-pink-500/50' : ''}
        rounded-xl transition-all duration-300
        ${className}
      `}
    >
      <div className="absolute left-4 text-gray-400">
        <FiSearch className="w-5 h-5" />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="
          w-full py-3 pl-12 pr-10
          bg-white/5 border border-white/10
          rounded-xl text-white placeholder-gray-400
          focus:outline-none focus:bg-white/10
          transition-all duration-300
        "
      />
      
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
