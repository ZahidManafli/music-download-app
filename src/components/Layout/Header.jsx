import { FiMusic, FiShoppingCart, FiMenu } from 'react-icons/fi';
import { SearchInput } from '../UI';

const Header = ({ 
  searchQuery, 
  onSearchChange, 
  selectedCount = 0, 
  onCartClick,
  onMenuClick,
  showSearch = true,
}) => {
  return (
    <header className="sticky top-0 z-40 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center">
              <FiMusic className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">MusicBox</h1>
              <p className="text-xs text-gray-400">Free Music Downloads</p>
            </div>
          </div>

          {/* Search Bar - only shown when showSearch is true */}
          {showSearch && (
            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <SearchInput 
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search tracks, artists, albums..."
              />
            </div>
          )}

          {/* Spacer when search is hidden */}
          {!showSearch && <div className="flex-1" />}

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:scale-105"
          >
            <FiShoppingCart className="w-6 h-6 text-white" />
            {selectedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-btn flex items-center justify-center text-xs font-bold text-white">
                {selectedCount > 99 ? '99+' : selectedCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Search - only shown when showSearch is true */}
        {showSearch && (
          <div className="mt-4 md:hidden">
            <SearchInput 
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search music..."
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
