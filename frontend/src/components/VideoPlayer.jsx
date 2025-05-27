import { useRef, useEffect, useMemo } from 'react';

const VideoPlayer = ({
  processedKeywords,
  currentIndex,
  setCurrentIndex,
  isVideoPlaying,
  setIsVideoPlaying,
  loading,
}) => {
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const placeholderImage = '/assets/Placeholder.png';

  const getVideoPath = (name) => {
    const path = name ? `/assets/Videos/${name}.mp4` : '/assets/Videos/default.mp4';
    return path;
  };

  // Memoize flattenedVideos to avoid recalculating on every render
  const flattenedVideos = useMemo(() => processedKeywords?.flatMap((item) => item.videos) || [], [processedKeywords]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (currentIndex + 1 < flattenedVideos.length) {
        setCurrentIndex((prev) => prev + 1);
        setIsVideoPlaying(true); // Keep playing state for next video
      } else {
        setIsVideoPlaying(false); // All videos finished
      }
    };

    const handleCanPlay = () => {
      if (!isVideoPlaying) {
        video.play().catch((e) => console.error('Video play error:', e));
        setIsVideoPlaying(true);
      }
    };

    const handleError = () => {
      if (video.src !== '/assets/Videos/default.mp4') {
        video.src = '/assets/Videos/default.mp4';
        video.load();
      } else {
        setIsVideoPlaying(false);
        setCurrentIndex((prev) => Math.min(prev + 1, flattenedVideos.length - 1));
      }
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [currentIndex, flattenedVideos, isVideoPlaying, setCurrentIndex, setIsVideoPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (flattenedVideos.length > 0 && currentIndex < flattenedVideos.length && video) {
      const newPath = getVideoPath(flattenedVideos[currentIndex]);
      video.src = newPath;
      video.load();
      setIsVideoPlaying(false); // Reset to trigger playback on load
    }
  }, [flattenedVideos, currentIndex]);

  return (
    <div className="flex flex-col items-center space-y-3 w-full h-full transition-all duration-300 shadow-lg hover:shadow-xl">
      <div className="relative w-full h-full rounded-r-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 bg-opacity-80 dark:bg-opacity-80 z-10 transition-opacity duration-300">
            <svg className="animate-spin h-10 w-10 text-violet-600 dark:text-violet-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        )}
        <img
          ref={imageRef}
          src={placeholderImage}
          alt="Video Placeholder"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            isVideoPlaying && flattenedVideos.length > 0 ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <video
          ref={videoRef}
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            isVideoPlaying && flattenedVideos.length > 0 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Playback Indicator */}
        {isVideoPlaying && flattenedVideos.length > 0 && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 dark:bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 animate-fade-in">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Playing</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
