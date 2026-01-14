import { FiCheck } from 'react-icons/fi';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label, 
  disabled = false,
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <label 
      className={`
        inline-flex items-center gap-2 cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div 
          className={`
            ${sizes[size]} rounded-md border-2 transition-all duration-200
            flex items-center justify-center
            ${checked 
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-transparent' 
              : 'bg-transparent border-gray-500 hover:border-pink-500'
            }
          `}
        >
          {checked && (
            <FiCheck className={`${iconSizes[size]} text-white`} />
          )}
        </div>
      </div>
      {label && (
        <span className="text-gray-300 text-sm">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
