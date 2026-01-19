import { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { sanitizeFilename } from '../utils/helpers';

// YouTube backend configuration
const YOUTUBE_BACKEND_URL = import.meta.env.VITE_YOUTUBE_BACKEND_URL || '';
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_BACKEND_API_KEY || '';

const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle' | 'downloading' | 'complete' | 'error'
  const [error, setError] = useState(null);

  // Check if YouTube backend is configured
  const isYouTubeBackendConfigured = useCallback(() => {
    return YOUTUBE_BACKEND_URL && YOUTUBE_API_KEY;
  }, []);

  // Download single track (Jamendo)
  const downloadSingleTrack = useCallback(async (track) => {
    try {
      setIsDownloading(true);
      setStatus('downloading');
      setCurrentTrack(track.name || track.title);

      const downloadUrl = track.audioDownloadUrl || track.audioUrl;
      if (!downloadUrl) {
        throw new Error('No download URL available');
      }

      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const filename = sanitizeFilename(`${track.artist || track.channel} - ${track.name || track.title}.mp3`);
      saveAs(blob, filename);

      setStatus('complete');
      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
      }, 2000);
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
        setError(null);
      }, 3000);
    }
  }, []);

  // Download YouTube video via backend
  const downloadYouTubeVideo = useCallback(async (video) => {
    if (!isYouTubeBackendConfigured()) {
      setError('YouTube backend not configured. Add VITE_YOUTUBE_BACKEND_URL and VITE_YOUTUBE_BACKEND_API_KEY to your .env file.');
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setError(null);
      }, 5000);
      return;
    }

    try {
      setIsDownloading(true);
      setStatus('downloading');
      setCurrentTrack(video.title || video.name);
      setProgress(10);

      const title = encodeURIComponent(video.title || video.name || 'download');
      const url = `${YOUTUBE_BACKEND_URL}/api/download?videoId=${video.id}&title=${title}`;

      setProgress(20);

      const response = await fetch(url, {
        headers: {
          'x-api-key': YOUTUBE_API_KEY,
        },
      });

      setProgress(50);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Download failed');
      }

      setProgress(70);

      const blob = await response.blob();
      const filename = sanitizeFilename(`${video.channel || 'YouTube'} - ${video.title || video.name}.mp3`);
      
      setProgress(90);
      
      saveAs(blob, filename);

      setProgress(100);
      setStatus('complete');

      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
        setProgress(0);
      }, 2000);
    } catch (err) {
      console.error('YouTube download error:', err);
      setError(err.message);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
        setProgress(0);
        setError(null);
      }, 3000);
    }
  }, [isYouTubeBackendConfigured]);

  // Download multiple tracks as ZIP (for Jamendo tracks)
  const downloadAsZip = useCallback(async (tracks, zipFilename = 'music-download') => {
    if (tracks.length === 0) return;

    try {
      setIsDownloading(true);
      setStatus('downloading');
      setProgress(0);
      setError(null);

      const zip = new JSZip();
      const totalTracks = tracks.length;

      for (let i = 0; i < totalTracks; i++) {
        const track = tracks[i];
        setCurrentTrack(track.name || track.title);
        setCurrentIndex(i);

        try {
          const downloadUrl = track.audioDownloadUrl || track.audioUrl;
          if (!downloadUrl) {
            console.warn(`No download URL for track: ${track.name || track.title}`);
            continue;
          }

          const response = await fetch(downloadUrl);
          if (!response.ok) {
            console.warn(`Failed to download: ${track.name || track.title}`);
            continue;
          }

          const blob = await response.blob();
          const filename = sanitizeFilename(`${track.artist || track.channel} - ${track.name || track.title}.mp3`);
          
          zip.file(filename, blob);

          // Update progress
          const progressPercent = ((i + 1) / totalTracks) * 90; // Reserve 10% for ZIP generation
          setProgress(progressPercent);
        } catch (trackError) {
          console.warn(`Error downloading ${track.name || track.title}:`, trackError);
          // Continue with next track
        }
      }

      // Generate ZIP file
      setCurrentTrack('Creating ZIP file...');
      const zipBlob = await zip.generateAsync(
        { type: 'blob' },
        (metadata) => {
          const zipProgress = 90 + (metadata.percent / 100) * 10;
          setProgress(zipProgress);
        }
      );

      // Save ZIP file
      const finalFilename = sanitizeFilename(`${zipFilename}.zip`);
      saveAs(zipBlob, finalFilename);

      setProgress(100);
      setStatus('complete');

      // Reset after delay
      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
        setProgress(0);
        setCurrentTrack('');
        setCurrentIndex(0);
      }, 2000);

    } catch (err) {
      console.error('ZIP download error:', err);
      setError(err.message || 'Failed to create ZIP file');
      setStatus('error');
      
      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
        setProgress(0);
        setError(null);
      }, 3000);
    }
  }, []);

  // Download YouTube videos as ZIP via backend
  const downloadYouTubeAsZip = useCallback(async (videos, zipFilename = 'youtube-music') => {
    if (videos.length === 0) return;

    if (!isYouTubeBackendConfigured()) {
      setError('YouTube backend not configured');
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setError(null);
      }, 5000);
      return;
    }

    try {
      setIsDownloading(true);
      setStatus('downloading');
      setProgress(0);
      setError(null);

      const zip = new JSZip();
      const totalVideos = videos.length;

      for (let i = 0; i < totalVideos; i++) {
        const video = videos[i];
        setCurrentTrack(video.title || video.name);
        setCurrentIndex(i);

        try {
          const title = encodeURIComponent(video.title || video.name || 'download');
          const url = `${YOUTUBE_BACKEND_URL}/api/download?videoId=${video.id}&title=${title}`;

          const response = await fetch(url, {
            headers: {
              'x-api-key': YOUTUBE_API_KEY,
            },
          });

          if (!response.ok) {
            console.warn(`Failed to download: ${video.title || video.name}`);
            continue;
          }

          const blob = await response.blob();
          const filename = sanitizeFilename(`${video.channel || 'YouTube'} - ${video.title || video.name}.mp3`);
          
          zip.file(filename, blob);

          // Update progress
          const progressPercent = ((i + 1) / totalVideos) * 90;
          setProgress(progressPercent);
        } catch (trackError) {
          console.warn(`Error downloading ${video.title || video.name}:`, trackError);
        }
      }

      // Generate ZIP file
      setCurrentTrack('Creating ZIP file...');
      const zipBlob = await zip.generateAsync(
        { type: 'blob' },
        (metadata) => {
          const zipProgress = 90 + (metadata.percent / 100) * 10;
          setProgress(zipProgress);
        }
      );

      // Save ZIP file
      const finalFilename = sanitizeFilename(`${zipFilename}.zip`);
      saveAs(zipBlob, finalFilename);

      setProgress(100);
      setStatus('complete');

      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
        setProgress(0);
        setCurrentTrack('');
        setCurrentIndex(0);
      }, 2000);

    } catch (err) {
      console.error('YouTube ZIP download error:', err);
      setError(err.message || 'Failed to create ZIP file');
      setStatus('error');
      
      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
        setProgress(0);
        setError(null);
      }, 3000);
    }
  }, [isYouTubeBackendConfigured]);

  // Download Big.az track via backend
  const downloadBigAzTrack = useCallback(async (song) => {
    if (!isYouTubeBackendConfigured()) {
      setError('Backend not configured. Add VITE_YOUTUBE_BACKEND_URL and VITE_YOUTUBE_BACKEND_API_KEY to your .env file.');
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setError(null);
      }, 5000);
      return;
    }

    try {
      setIsDownloading(true);
      setStatus('downloading');
      setCurrentTrack(song.title || song.name);
      setProgress(10);

      const title = encodeURIComponent(song.title || song.name || 'download');
      const artist = encodeURIComponent(song.artist || '');
      const url = `${YOUTUBE_BACKEND_URL}/api/bigaz/download/${song.id}?title=${title}&artist=${artist}`;

      setProgress(20);

      const response = await fetch(url, {
        headers: {
          'x-api-key': YOUTUBE_API_KEY,
        },
      });

      setProgress(50);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Download failed');
      }

      setProgress(70);

      const blob = await response.blob();
      const filename = sanitizeFilename(`${song.artist || 'Big.az'} - ${song.title || song.name}.mp3`);
      
      setProgress(90);
      
      saveAs(blob, filename);

      setProgress(100);
      setStatus('complete');

      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
        setProgress(0);
      }, 2000);
    } catch (err) {
      console.error('Big.az download error:', err);
      setError(err.message);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
        setProgress(0);
        setError(null);
      }, 3000);
    }
  }, [isYouTubeBackendConfigured]);

  // Download Big.az songs as ZIP via backend
  const downloadBigAzAsZip = useCallback(async (songs, zipFilename = 'bigaz-music') => {
    if (songs.length === 0) return;

    if (!isYouTubeBackendConfigured()) {
      setError('Backend not configured');
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setError(null);
      }, 5000);
      return;
    }

    try {
      setIsDownloading(true);
      setStatus('downloading');
      setProgress(0);
      setError(null);

      const zip = new JSZip();
      const totalSongs = songs.length;

      for (let i = 0; i < totalSongs; i++) {
        const song = songs[i];
        setCurrentTrack(song.title || song.name);
        setCurrentIndex(i);

        try {
          const title = encodeURIComponent(song.title || song.name || 'download');
          const artist = encodeURIComponent(song.artist || '');
          const url = `${YOUTUBE_BACKEND_URL}/api/bigaz/download/${song.id}?title=${title}&artist=${artist}`;

          const response = await fetch(url, {
            headers: {
              'x-api-key': YOUTUBE_API_KEY,
            },
          });

          if (!response.ok) {
            console.warn(`Failed to download: ${song.title || song.name}`);
            continue;
          }

          const blob = await response.blob();
          const filename = sanitizeFilename(`${song.artist || 'Big.az'} - ${song.title || song.name}.mp3`);
          
          zip.file(filename, blob);

          // Update progress
          const progressPercent = ((i + 1) / totalSongs) * 90;
          setProgress(progressPercent);
        } catch (trackError) {
          console.warn(`Error downloading ${song.title || song.name}:`, trackError);
        }
      }

      // Generate ZIP file
      setCurrentTrack('Creating ZIP file...');
      const zipBlob = await zip.generateAsync(
        { type: 'blob' },
        (metadata) => {
          const zipProgress = 90 + (metadata.percent / 100) * 10;
          setProgress(zipProgress);
        }
      );

      // Save ZIP file
      const finalFilename = sanitizeFilename(`${zipFilename}.zip`);
      saveAs(zipBlob, finalFilename);

      setProgress(100);
      setStatus('complete');

      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
        setProgress(0);
        setCurrentTrack('');
        setCurrentIndex(0);
      }, 2000);

    } catch (err) {
      console.error('Big.az ZIP download error:', err);
      setError(err.message || 'Failed to create ZIP file');
      setStatus('error');
      
      setTimeout(() => {
        setStatus('idle');
        setIsDownloading(false);
        setProgress(0);
        setError(null);
      }, 3000);
    }
  }, [isYouTubeBackendConfigured]);

  // Reset download state
  const resetDownload = useCallback(() => {
    setIsDownloading(false);
    setProgress(0);
    setCurrentTrack('');
    setCurrentIndex(0);
    setStatus('idle');
    setError(null);
  }, []);

  return {
    isDownloading,
    progress,
    currentTrack,
    currentIndex,
    status,
    error,
    downloadSingleTrack,
    downloadYouTubeVideo,
    downloadBigAzTrack,
    downloadAsZip,
    downloadYouTubeAsZip,
    downloadBigAzAsZip,
    resetDownload,
    isYouTubeBackendConfigured,
  };
};

export default useDownload;
