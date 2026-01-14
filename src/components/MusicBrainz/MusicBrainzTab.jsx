import { useState, useCallback } from 'react';
import { FiSearch, FiX, FiMusic, FiUser, FiDisc, FiDatabase } from 'react-icons/fi';
import MusicBrainzGrid from './MusicBrainzGrid';
import MusicBrainzDetailModal from './MusicBrainzDetailModal';
import { SearchInput } from '../UI';
import useMusicBrainz from '../../hooks/useMusicBrainz';
import { buildYouTubeSearchQuery } from '../../services/musicbrainzApi';

// Entity type tabs configuration
const ENTITY_TYPES = [
  { id: 'recording', name: 'Tracks', icon: FiMusic, color: 'orange' },
  { id: 'artist', name: 'Artists', icon: FiUser, color: 'purple' },
  { id: 'release', name: 'Albums', icon: FiDisc, color: 'blue' },
];

const MusicBrainzTab = ({
  onCrossSearch,
}) => {
  const [previewEntity, setPreviewEntity] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const {
    results,
    loading,
    error,
    searchQuery,
    entityType,
    totalCount,
    hasMore,
    handleSearchChange,
    handleEntityTypeChange,
    loadMore,
    clearSearch,
  } = useMusicBrainz();

  // Handle search input
  const onSearchInputChange = useCallback((e) => {
    const value = e.target.value;
    handleSearchChange(value);
    if (value.trim()) {
      setHasSearched(true);
    }
  }, [handleSearchChange]);

  // Handle clear search
  const onClearSearch = useCallback(() => {
    clearSearch();
    setHasSearched(false);
  }, [clearSearch]);

  // Handle entity type tab change
  const onEntityTypeChange = useCallback((type) => {
    handleEntityTypeChange(type);
    if (searchQuery.trim()) {
      setHasSearched(true);
    }
  }, [handleEntityTypeChange, searchQuery]);

  // Handle entity preview
  const handlePreview = useCallback((entity) => {
    setPreviewEntity(entity);
  }, []);

  // Handle close preview
  const handleClosePreview = useCallback(() => {
    setPreviewEntity(null);
  }, []);

  // Handle cross-search to YouTube
  const handleCrossSearch = useCallback((entity) => {
    const query = buildYouTubeSearchQuery(entity);
    onCrossSearch?.(query);
  }, [onCrossSearch]);

  // Get active entity type config
  const activeConfig = ENTITY_TYPES.find(t => t.id === entityType) || ENTITY_TYPES[0];

  return (
    <div className="space-y-6">
      {/* Search header */}
      <div className="flex flex-col gap-4">
        {/* Search input */}
        <div className="relative">
          <SearchInput
            value={searchQuery}
            onChange={onSearchInputChange}
            onClear={onClearSearch}
            placeholder={`Search MusicBrainz for ${activeConfig.name.toLowerCase()}...`}
            className="w-full"
          />
        </div>

        {/* Entity type tabs */}
        <div className="flex items-center gap-2">
          {ENTITY_TYPES.map((type) => {
            const Icon = type.icon;
            const isActive = entityType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => onEntityTypeChange(type.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                  transition-all duration-300
                  ${isActive
                    ? type.color === 'orange'
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/25'
                      : type.color === 'purple'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {type.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results info */}
      {hasSearched && results.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            {totalCount > 0 ? (
              <>Showing {results.length} of {totalCount.toLocaleString()} {activeConfig.name.toLowerCase()}</>
            ) : (
              <>{results.length} results</>
            )}
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <FiDatabase className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-400">
              MusicBrainz
            </span>
          </div>
        </div>
      )}

      {/* Results grid */}
      <MusicBrainzGrid
        results={results}
        loading={loading}
        error={error}
        hasSearched={hasSearched}
        entityType={entityType}
        onPreview={handlePreview}
        onCrossSearch={handleCrossSearch}
        onLoadMore={loadMore}
        hasMore={hasMore}
      />

      {/* Detail modal */}
      <MusicBrainzDetailModal
        entity={previewEntity}
        isOpen={!!previewEntity}
        onClose={handleClosePreview}
        onCrossSearch={handleCrossSearch}
      />
    </div>
  );
};

export default MusicBrainzTab;
