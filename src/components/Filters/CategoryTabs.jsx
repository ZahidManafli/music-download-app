import { CATEGORIES } from '../../data/constants';
import { FiMusic, FiStar, FiClock, FiTrendingUp } from 'react-icons/fi';

const CategoryTabs = ({ selectedCategory, onCategoryChange }) => {
  const categoryIcons = {
    all: FiMusic,
    popular: FiStar,
    new: FiClock,
    trending: FiTrendingUp,
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((category) => {
        const Icon = categoryIcons[category.id] || FiMusic;
        const isSelected = selectedCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              whitespace-nowrap font-medium text-sm
              transition-all duration-300
              ${isSelected 
                ? 'gradient-btn text-white shadow-lg shadow-pink-500/25' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
