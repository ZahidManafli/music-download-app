import { useState, useRef, useCallback, useEffect } from 'react';

const useAudioPlayer = () => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Play track
  const playTrack = useCallback((track) => {
    const audio = audioRef.current;
    if (!audio || !track?.audioUrl) return;

    if (currentTrack?.id === track.id) {
      // Same track - toggle play/pause
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
    } else {
      // New track
      setIsLoading(true);
      setCurrentTrack(track);
      audio.src = track.audioUrl;
      audio.play().catch((err) => {
        console.error('Playback error:', err);
        setIsLoading(false);
      });
    }
  }, [currentTrack, isPlaying]);

  // Play/Pause toggle
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  }, [currentTrack, isPlaying]);

  // Seek to position
  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.min(Math.max(0, time), duration);
  }, [duration]);

  // Seek by percentage (0-100)
  const seekPercentage = useCallback((percentage) => {
    const time = (percentage / 100) * duration;
    seek(time);
  }, [duration, seek]);

  // Set volume (0-1)
  const changeVolume = useCallback((newVolume) => {
    const audio = audioRef.current;
    if (!audio) return;

    const vol = Math.min(Math.max(0, newVolume), 1);
    audio.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Stop playback
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  // Skip forward/backward
  const skip = useCallback((seconds) => {
    seek(currentTime + seconds);
  }, [currentTime, seek]);

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    progress,
    playTrack,
    togglePlay,
    seek,
    seekPercentage,
    changeVolume,
    toggleMute,
    stop,
    skip,
  };
};

export default useAudioPlayer;
