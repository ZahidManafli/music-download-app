import { useState, useEffect, useCallback, useRef } from 'react';
import { FiGrid, FiList, FiFilter, FiX, FiMusic, FiDatabase } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';

// Layout components
import { Header, Sidebar, Footer } from './components/Layout';

// Music components
import { MusicGrid, MusicList, MusicPlayer } from './components/Music';

// YouTube components
import { YouTubeTab } from './components/YouTube';

// MusicBrainz components
import { MusicBrainzTab } from './components/MusicBrainz';

// Filter components
import { CategoryTabs } from './components/Filters';

// Download components
import { DownloadCart, DownloadProgress } from './components/Download';

// UI components
import { Button, LoadingSpinner } from './components/UI';

// Hooks
import useFilters from './hooks/useFilters';
import useMusic from './hooks/useMusic';
import useSelection from './hooks/useSelection';
import useDownload from './hooks/useDownload';
import useAudioPlayer from './hooks/useAudioPlayer';

// Styles
import './App.css';

// Source tabs configuration
const SOURCES = [
  { id: 'jamendo', name: 'Free Music', icon: FiMusic },
  { id: 'youtube', name: 'YouTube', icon: FaYoutube },
  { id: 'musicbrainz', name: 'MusicBrainz', icon: FiDatabase },
];

function App() {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeSource, setActiveSource] = useState('jamendo'); // 'jamendo' | 'youtube' | 'musicbrainz'
  const [crossSearchQuery, setCrossSearchQuery] = useState(''); // For cross-search from MusicBrainz to YouTube

  // Refs
  const youtubeTabRef = useRef(null);

  // Hooks
  const filters = useFilters();
  const music = useMusic();
  const selection = useSelection();
  const download = useDownload();
  const player = useAudioPlayer();

  // Fetch tracks when filters change (only for Jamendo)
  useEffect(() => {
    if (activeSource === 'jamendo') {
      const params = filters.getApiParams();
      music.debouncedFetch(params);
    }
  }, [
    activeSource,
    filters.searchQuery,
    filters.selectedRegion,
    filters.selectedGenres,
    filters.selectedCategory,
    filters.artistSearch,
  ]);

  // Handle search (only for Jamendo source)
  const handleSearchChange = useCallback((e) => {
    if (activeSource === 'jamendo') {
      filters.setSearchQuery(e.target.value);
    }
  }, [filters, activeSource]);

  // Handle track selection (for Jamendo tracks)
  const handleSelectTrack = useCallback((track) => {
    selection.toggleSelection({ ...track, source: 'jamendo' });
  }, [selection]);

  // Handle YouTube video selection
  const handleSelectYouTubeVideo = useCallback((video) => {
    selection.toggleSelection({ ...video, source: 'youtube' });
  }, [selection]);

  // Handle add YouTube video to cart
  const handleAddYouTubeToCart = useCallback((video) => {
    if (!selection.isSelected(video.id)) {
      selection.addToSelection({ ...video, source: 'youtube' });
    }
  }, [selection]);

  // Handle track play
  const handlePlayTrack = useCallback((track) => {
    player.playTrack(track);
  }, [player]);

  // Handle single track download
  const handleDownloadTrack = useCallback((track) => {
    if (track.source === 'youtube') {
      // Check if YouTube backend is configured
      if (download.isYouTubeBackendConfigured()) {
        download.downloadYouTubeVideo(track);
      } else {
        alert('YouTube backend not configured. Add VITE_YOUTUBE_BACKEND_URL and VITE_YOUTUBE_BACKEND_API_KEY to your .env file.');
        if (!selection.isSelected(track.id)) {
          selection.addToSelection(track);
        }
        setCartOpen(true);
      }
      return;
    }
    download.downloadSingleTrack(track);
  }, [download, selection]);

  // Handle download all as ZIP
  const handleDownloadAll = useCallback(() => {
    const jamendoTracks = selection.selectedTracks.filter(t => t.source !== 'youtube');
    const youtubeVideos = selection.selectedTracks.filter(t => t.source === 'youtube');
    const timestamp = new Date().toISOString().slice(0, 10);
    
    // Download Jamendo tracks
    if (jamendoTracks.length > 0) {
      download.downloadAsZip(jamendoTracks, `music-download-${timestamp}`);
    }
    
    // Download YouTube videos if backend is configured
    if (youtubeVideos.length > 0) {
      if (download.isYouTubeBackendConfigured()) {
        download.downloadYouTubeAsZip(youtubeVideos, `youtube-music-${timestamp}`);
      } else {
        alert(`${youtubeVideos.length} YouTube video(s) require backend configuration. Add VITE_YOUTUBE_BACKEND_URL and VITE_YOUTUBE_BACKEND_API_KEY to your .env file.`);
      }
    }
  }, [download, selection.selectedTracks]);

  // Handle clear selection
  const handleClearSelection = useCallback(() => {
    selection.deselectAll();
  }, [selection]);

  // Handle player close
  const handlePlayerClose = useCallback(() => {
    player.stop();
  }, [player]);

  // Get selected items for current source
  const getSelectedForSource = useCallback((source) => {
    return selection.selectedTracks.filter(t => t.source === source);
  }, [selection.selectedTracks]);

  // Handle cross-search from MusicBrainz to YouTube
  const handleCrossSearch = useCallback((query) => {
    setCrossSearchQuery(query);
    setActiveSource('youtube');
  }, []);

  // Clear cross-search query after it's been used
  useEffect(() => {
    if (activeSource !== 'youtube' && crossSearchQuery) {
      setCrossSearchQuery('');
    }
  }, [activeSource, crossSearchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        searchQuery={activeSource === 'jamendo' ? filters.searchQuery : ''}
        onSearchChange={handleSearchChange}
        selectedCount={selection.selectionCount}
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={activeSource === 'jamendo'}
      />

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar - only show for Jamendo */}
        {activeSource === 'jamendo' && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            selectedRegion={filters.selectedRegion}
            onRegionChange={filters.setSelectedRegion}
            selectedGenres={filters.selectedGenres}
            onGenreToggle={filters.toggleGenre}
            selectedCategory={filters.selectedCategory}
            onCategoryChange={filters.setSelectedCategory}
            artistSearch={filters.artistSearch}
            onArtistSearchChange={filters.setArtistSearch}
          />
        )}

        {/* Main area */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Source tabs */}
            <div className="flex items-center gap-2 mb-6">
              {SOURCES.map((source) => {
                const Icon = source.icon;
                const isActive = activeSource === source.id;
                const count = getSelectedForSource(source.id).length;
                
                return (
                  <button
                    key={source.id}
                    onClick={() => setActiveSource(source.id)}
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
                      transition-all duration-300
                      ${isActive
                        ? source.id === 'youtube'
                          ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                          : source.id === 'musicbrainz'
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/25'
                            : 'gradient-btn text-white shadow-lg shadow-pink-500/25'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {source.name}
                    {count > 0 && (
                      <span className={`
                        ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                        ${isActive ? 'bg-white/20' : 'bg-white/10'}
                      `}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Jamendo Content */}
            {activeSource === 'jamendo' && (
              <>
                {/* Top bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  {/* Category tabs */}
                  <CategoryTabs
                    selectedCategory={filters.selectedCategory}
                    onCategoryChange={filters.setSelectedCategory}
                  />

                  {/* View controls */}
                  <div className="flex items-center gap-3">
                    {/* Active filters indicator */}
                    {filters.hasActiveFilters && (
                      <button
                        onClick={filters.clearAllFilters}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-400 text-sm hover:bg-pink-500/30 transition-colors"
                      >
                        <FiFilter className="w-4 h-4" />
                        Clear Filters
                        <FiX className="w-4 h-4" />
                      </button>
                    )}

                    {/* Selection controls */}
                    {selection.selectionCount > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm">
                        <span className="text-gray-400">
                          {selection.selectionCount} selected
                        </span>
                        <button
                          onClick={handleClearSelection}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* View mode toggle */}
                    <div className="flex items-center rounded-lg bg-white/5 p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-white/10 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <FiGrid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === 'list'
                            ? 'bg-white/10 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <FiList className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results count */}
                {music.total > 0 && (
                  <p className="text-gray-400 text-sm mb-4">
                    Showing {music.tracks.length} of {music.total} tracks
                  </p>
                )}

                {/* Error state */}
                {music.error && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                      <span className="text-4xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
                    <p className="text-gray-400 max-w-md mb-4">{music.error}</p>
                    <Button onClick={music.refresh}>Try Again</Button>
                  </div>
                )}

                {/* Music content */}
                {!music.error && (
                  viewMode === 'grid' ? (
                    <MusicGrid
                      tracks={music.tracks}
                      selectedTracks={selection.selectedTracks}
                      currentTrack={player.currentTrack}
                      isPlaying={player.isPlaying}
                      loading={music.loading}
                      onSelect={handleSelectTrack}
                      onPlay={handlePlayTrack}
                      onDownload={handleDownloadTrack}
                      onLoadMore={music.loadMore}
                      hasMore={music.hasMore}
                    />
                  ) : (
                    <MusicList
                      tracks={music.tracks}
                      selectedTracks={selection.selectedTracks}
                      currentTrack={player.currentTrack}
                      isPlaying={player.isPlaying}
                      loading={music.loading}
                      onSelect={handleSelectTrack}
                      onPlay={handlePlayTrack}
                      onDownload={handleDownloadTrack}
                      onLoadMore={music.loadMore}
                      hasMore={music.hasMore}
                    />
                  )
                )}
              </>
            )}

            {/* YouTube Content */}
            {activeSource === 'youtube' && (
              <YouTubeTab
                ref={youtubeTabRef}
                selectedVideos={getSelectedForSource('youtube')}
                onSelectVideo={handleSelectYouTubeVideo}
                onAddToCart={handleAddYouTubeToCart}
                initialSearchQuery={crossSearchQuery}
              />
            )}

            {/* MusicBrainz Content */}
            {activeSource === 'musicbrainz' && (
              <MusicBrainzTab
                onCrossSearch={handleCrossSearch}
              />
            )}
          </div>
        </main>
      </div>

      {/* Download Cart */}
      <DownloadCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        selectedTracks={selection.selectedTracks}
        onRemoveTrack={selection.removeFromSelection}
        onClearAll={handleClearSelection}
        onDownloadAll={handleDownloadAll}
        downloadProgress={download.progress > 0 ? download.progress : null}
        isDownloading={download.isDownloading}
      />

      {/* Download Progress Toast */}
      <DownloadProgress
        isVisible={download.status !== 'idle' && !cartOpen}
        progress={download.progress}
        currentTrack={download.currentTrack}
        totalTracks={selection.selectionCount}
        currentIndex={download.currentIndex}
        status={download.status}
        onClose={download.resetDownload}
      />

      {/* Music Player */}
      <MusicPlayer
        currentTrack={player.currentTrack}
        isPlaying={player.isPlaying}
        currentTime={player.currentTime}
        duration={player.duration}
        volume={player.volume}
        isMuted={player.isMuted}
        isLoading={player.isLoading}
        progress={player.progress}
        onTogglePlay={player.togglePlay}
        onSeek={player.seekPercentage}
        onVolumeChange={player.changeVolume}
        onToggleMute={player.toggleMute}
        onSkip={player.skip}
        onDownload={handleDownloadTrack}
        onClose={handlePlayerClose}
      />

      {/* Footer - add padding when player is visible */}
      <div className={player.currentTrack ? 'pb-24' : ''}>
        <Footer />
      </div>
    </div>
  );
}

export default App;
