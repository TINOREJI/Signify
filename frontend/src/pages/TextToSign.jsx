import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TextToSign = () => {
  const [text, setText] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [processedKeywords, setProcessedKeywords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const placeholderImage = '/assets/Placeholder.png';

  // Check if video file exists
  const checkIfVideoExists = async (path) => {
    try {
      const res = await fetch(path, { method: 'HEAD' });
      const contentType = res.headers.get('Content-Type') || '';
      return res.ok && contentType.includes('video');
    } catch {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/process-text', { text });
      const rawKeywords = response.data.keywords || [];
      setKeywords(rawKeywords);
      setCurrentIndex(0);
      const finalList = [];

      // Process each keyword for video existence
      for (const word of rawKeywords) {
        const formatted = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        const path = `/assets/Videos/${formatted}.mp4`;
        const exists = await checkIfVideoExists(path);

        if (exists) {
          finalList.push({ word, videos: [formatted] });
        } else {
          const letters = [];
          const filtered = word.replace(/[^a-zA-Z0-9]/g, '');
          for (const char of filtered) {
            const upper = char.toUpperCase();
            const charPath = `/assets/Videos/${upper}.mp4`;
            if (await checkIfVideoExists(charPath)) letters.push(upper);
          }
          finalList.push({ word, videos: letters });
        }
      }

      setProcessedKeywords(finalList);
    } catch (error) {
      setErrorMsg('Failed to process input. Please try again.');
      console.error('Error processing text:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get video path based on keyword
  const getVideoPath = (name) => (name ? `/assets/Videos/${name}.mp4` : '/assets/default.mp4');

  const flattenedVideos = processedKeywords.flatMap((item) => item.videos);

  // Get current word index
  const getCurrentWordIndex = () => {
    let count = 0;
    for (let i = 0; i < processedKeywords.length; i++) {
      count += processedKeywords[i].videos.length;
      if (currentIndex < count) return i;
    }
    return -1;
  };

  // Video ended handler
  useEffect(() => {
    const video = videoRef.current;
    const handleEnded = () => {
      setIsVideoPlaying(false);
      if (currentIndex + 1 < flattenedVideos.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          if (video) video.style.display = 'none';
          if (imageRef.current) imageRef.current.style.display = 'block';
        }, 200);
      }
    };

    if (video) {
      video.addEventListener('ended', handleEnded);
      video.oncanplaythrough = () => {
        if (!isVideoPlaying) {
          video.play();
          setIsVideoPlaying(true);
          if (imageRef.current) imageRef.current.style.display = 'none';
          video.style.display = 'block';
        }
      };
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handleEnded);
        video.oncanplaythrough = null;
      }
    };
  }, [currentIndex, flattenedVideos]);

  // Update video source on currentIndex change
  useEffect(() => {
    const video = videoRef.current;
    if (flattenedVideos.length > 0 && video) {
      const videoPath = window.location.origin + getVideoPath(flattenedVideos[currentIndex]);
      if (video.src !== videoPath) {
        video.pause();
        video.src = getVideoPath(flattenedVideos[currentIndex]);
        video.load();
        video.oncanplaythrough = () => {
          video.play();
          setIsVideoPlaying(true);
          if (imageRef.current) imageRef.current.style.display = 'none';
          video.style.display = 'block';
        };
      }
    }
  }, [currentIndex, flattenedVideos]);

  // Reset all states
  const handleReset = () => {
    setText('');
    setKeywords([]);
    setProcessedKeywords([]);
    setCurrentIndex(0);
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
    }
  };

    // --- Speech to Text Professional Section ---
  const LANGUAGES = [
    { label: 'English', value: 'en-US' },
    { label: 'Hindi', value: 'hi-IN' },
    { label: 'Malayalam', value: 'ml-IN' },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [language, setLanguage] = useState(LANGUAGES[0].value);

  useEffect(() => {
    if (!listening && transcript) {
      setText(transcript);
      resetTranscript();
    }
  }, [listening, transcript, resetTranscript, setText]);


  return (
    <div className="container mx-auto max-w-xl px-4 py-6 space-y-6 max-h-[100vh] flex flex-col justify-between">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-blue-950">Text to Sign Language Visualizer</h1>

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
          {errorMsg}
        </div>
      )}

      {/* Video + Progress */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-full max-w-xl h-[300px] border-2 border-dashed rounded-lg shadow-xl overflow-hidden">
          <img
            ref={imageRef}
            src={placeholderImage}
            alt="Video Placeholder"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
          />
          <video
            ref={videoRef}
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
          >
            <source
              src={getVideoPath(flattenedVideos[currentIndex])}
              type="video/mp4"
              onError={(e) => {
                e.target.src = '/assets/Videos/default.mp4';
                e.target.onerror = null;
              }}
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Keywords */}
      {processedKeywords.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Detected Keywords</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {processedKeywords.map((item, index) => {
              const isActive = index === getCurrentWordIndex();
              return (
                <div
                  key={index}
                  className={`p-2 rounded-xl text-center font-bold transition duration-300 ease-in-out transform text-sm ${
                    isActive
                      ? 'bg-blue-400 text-white scale-105 shadow-md'
                      : 'bg-gray-300 text-gray-600 scale-90 hover:scale-105'
                  }`}
                >
                  {item.word[0].toUpperCase() + item.word.slice(1).toLowerCase()}
                </div>
              );
            })}
          </div>
        </div>
      )}
      

      {/* Input + Buttons */}
      <div className="bg-white shadow-xl rounded-xl p-6 space-y-4 border border-gray-200">
        <label htmlFor="inputText" className="text-base font-semibold text-gray-700">
          Enter text to Translate:
        </label>
        
        <input
          id="inputText"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={80}
          placeholder="e.g. Hello My Name is Signify"
          className="w-full p-2 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {/* Speech Recognition */}
        <div className="mb-4 rounded-lg border border-blue-100 bg-white p-4 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="bg-white border border-blue-100 rounded-md px-3 py-2 text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
            aria-label="Select language"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => SpeechRecognition.startListening({ language })}
              className={`w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                listening ? 'ring-2 ring-blue-400' : ''
              }`}
              disabled={!browserSupportsSpeechRecognition}
              aria-label="Start Speech Recognition"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <rect x="7" y="2" width="6" height="10" rx="3" />
                <path d="M10 12v3m0 0h2m-2 0H8m4-3a4 4 0 10-8 0h8z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={SpeechRecognition.stopListening}
              className="px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 text-blue-800 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={!listening}
              aria-label="Stop Speech Recognition"
            >
              Stop
            </button>
            <button
              type="button"
              onClick={resetTranscript}
              className="px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 text-blue-800 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Reset Transcript"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="mt-2 text-blue-900 text-xs">
          <span className="font-semibold">Transcript:</span>{' '}
          <span className="italic">{transcript || 'Your speech transcript will appear here...'}</span>
        </div>
      </div>

        {/* Submit and Reset Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className={`flex-1 py-2 text-base rounded-lg font-semibold transition duration-300 ${
              loading
                ? 'bg-blue-950 cursor-not-allowed'
                : 'bg-blue-950 hover:bg-blue-900 text-white shadow-md'
            }`}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
          {flattenedVideos.length > 0 && (
            <button
              onClick={handleReset}
              className="flex-1 py-2 text-base rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToSign;
