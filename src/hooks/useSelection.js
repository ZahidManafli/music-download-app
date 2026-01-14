import { useState, useCallback } from 'react';

const useSelection = () => {
  const [selectedTracks, setSelectedTracks] = useState([]);

  // Toggle track selection
  const toggleSelection = useCallback((track) => {
    setSelectedTracks(prev => {
      const isSelected = prev.some(t => t.id === track.id);
      if (isSelected) {
        return prev.filter(t => t.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  }, []);

  // Add track to selection
  const addToSelection = useCallback((track) => {
    setSelectedTracks(prev => {
      const isSelected = prev.some(t => t.id === track.id);
      if (isSelected) return prev;
      return [...prev, track];
    });
  }, []);

  // Remove track from selection
  const removeFromSelection = useCallback((trackId) => {
    setSelectedTracks(prev => prev.filter(t => t.id !== trackId));
  }, []);

  // Select all tracks
  const selectAll = useCallback((tracks) => {
    setSelectedTracks(prev => {
      const newTracks = tracks.filter(t => !prev.some(p => p.id === t.id));
      return [...prev, ...newTracks];
    });
  }, []);

  // Deselect all tracks
  const deselectAll = useCallback(() => {
    setSelectedTracks([]);
  }, []);

  // Check if track is selected
  const isSelected = useCallback((trackId) => {
    return selectedTracks.some(t => t.id === trackId);
  }, [selectedTracks]);

  // Get selection count
  const selectionCount = selectedTracks.length;

  // Check if all provided tracks are selected
  const areAllSelected = useCallback((tracks) => {
    return tracks.length > 0 && tracks.every(t => selectedTracks.some(s => s.id === t.id));
  }, [selectedTracks]);

  return {
    selectedTracks,
    toggleSelection,
    addToSelection,
    removeFromSelection,
    selectAll,
    deselectAll,
    isSelected,
    selectionCount,
    areAllSelected,
  };
};

export default useSelection;
