import { FiX, FiGlobe, FiMusic, FiStar, FiTrendingUp, FiClock, FiUser } from 'react-icons/fi';
import { REGIONS, GENRES, CATEGORIES } from '../../data/constants';

const Sidebar = ({ 
  isOpen, 
  onClose,
  selectedRegion,
  onRegionChange,
  selectedGenres,
  onGenreToggle,
  selectedCategory,
  onCategoryChange,
  artistSearch,
  onArtistSearchChange,
}) => {
  const categoryIcons = {
    all: FiMusic,
    popular: FiStar,
    new: FiClock,
    trending: FiTrendingUp,
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-72 glass border-r border-white/10
          transform transition-transform duration-300 ease-out z-50
          overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 space-y-6">
          {/* Close button (mobile) */}
          <button 
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiMusic className="w-4 h-4" />
              Categories
            </h3>
            <div className="space-y-1">
              {CATEGORIES.map((category) => {
                const Icon = categoryIcons[category.id] || FiMusic;
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                      transition-all duration-200
                      ${selectedCategory === category.id 
                        ? 'gradient-btn text-white' 
                        : 'text-gray-300 hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiGlobe className="w-4 h-4" />
              Region
            </h3>
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="
                w-full px-4 py-2.5 rounded-xl
                bg-white/5 border border-white/10
                text-white appearance-none cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-pink-500/50
                transition-all duration-200
              "
            >
              {REGIONS.map((region) => (
                <option key={region.id} value={region.id} className="bg-gray-900">
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiMusic className="w-4 h-4" />
              Genres
            </h3>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => onGenreToggle(genre.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2 rounded-xl
                    transition-all duration-200
                    ${selectedGenres.includes(genre.id) 
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
                      : 'text-gray-300 hover:bg-white/10'
                    }
                  `}
                >
                  <span className="text-lg">{genre.icon}</span>
                  <span className="text-sm font-medium">{genre.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Artist Search */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiUser className="w-4 h-4" />
              Artist
            </h3>
            <input
              type="text"
              value={artistSearch}
              onChange={(e) => onArtistSearchChange(e.target.value)}
              placeholder="Search artist..."
              className="
                w-full px-4 py-2.5 rounded-xl
                bg-white/5 border border-white/10
                text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-pink-500/50
                transition-all duration-200
              "
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
