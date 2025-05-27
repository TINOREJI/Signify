import { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import KeywordDisplay from '../components/KeywordDisplay';
import InputForm from '../components/InputForm';
import ErrorMessage from '../components/ErrorMessage';

const TextToSign = () => {
  const [text, setText] = useState('');
  const [processedKeywords, setProcessedKeywords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [videoMap, setVideoMap] = useState(null);

  // Load videoMap.json dynamically
  useEffect(() => {
    const loadVideoMap = async () => {
      try {
        // Try public/assets first
        let response = await fetch('/assets/videoMap.json');
        if (!response.ok) {
          console.warn(`Failed to fetch from /assets/videoMap.json: ${response.status}`);
          // Fallback to src/assets
          response = await fetch(new URL('../assets/videoMap.json', import.meta.url).href);
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVideoMap(data);
        console.log('Loaded videoMap:', data);
        if (!data || Object.keys(data).length === 0) {
          setErrorMsg('Error: videoMap.json is empty.');
        }
      } catch (error) {
        setErrorMsg(`Failed to load videoMap.json: ${error.message}. Please check the file.`);
        console.error('Error loading videoMap:', error);
        setVideoMap({}); // Fallback to empty object
      }
    };
    loadVideoMap();
  }, []);

  // Function to split word into letters if not in videoMap
  const splitWordToLetters = (word, missingItems) => {
    if (!videoMap) {
      missingItems.add('videoMap not loaded');
      return ['default'];
    }
    const formatted = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    if (videoMap[formatted]) {
      return [formatted];
    }
    missingItems.add(word);
    const letters = [];
    const filtered = word.toLowerCase().replace(/[^a-z]/g, '');
    for (const char of filtered) {
      const upper = char.toUpperCase();
      if (videoMap[upper]) {
        letters.push(upper);
      } else {
        missingItems.add(`letter ${upper}`);
      }
    }
    console.log(`Word: ${word}, Formatted: ${formatted}, Letters:`, letters);
    return letters.length > 0 ? letters : ['default'];
  };

  // Handle form submission
  const handleSubmit = async (language) => {
    if (!videoMap) {
      setErrorMsg('videoMap.json not loaded yet. Please try again.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const missingItems = new Set();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/process-text', {
        text,
        language: language.split('-')[0],
      });
      const rawKeywords = response.data.keywords || [];
      setCurrentIndex(0);
      const finalList = [];

      for (const word of rawKeywords) {
        const videos = splitWordToLetters(word, missingItems);
        finalList.push({ word, videos });
      }

      setProcessedKeywords(finalList);
    } catch (error) {
      setErrorMsg('Failed to process input. Please try again.');
      console.error('Error processing text:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset states
  const handleReset = () => {
    setText('');
    setProcessedKeywords([]);
    setCurrentIndex(0);
    setIsVideoPlaying(false);
  };

  return (
    <div className="container mx-auto px-0 py-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 max-w-7xl">
      <h1 className="text-4xl font-bold text-center text-violet-700 dark:text-violet-300 mb-8 tracking-tight">
        Text to Sign Language Visualizer
      </h1>
      <div className="mb-6 px-4">
        <ErrorMessage errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
      </div>
      <div className="flex flex-col lg:flex-row gap-0 mt-6 w-full h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {/* Left Side: Keywords + Input */}
        <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 p-8 transition-all duration-200">
          <div className="w-full max-w-lg">
            <InputForm 
              text={text}
              setText={setText}
              handleSubmit={handleSubmit}
              handleReset={handleReset}
              loading={loading}
              hasVideos={processedKeywords.length > 0}
            />
          </div>
        </div>
        {/* Right Side: Video */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center bg-gray-900 dark:bg-black/80 transition-all duration-200">
          {videoMap ? (
            <VideoPlayer
              processedKeywords={processedKeywords}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              isVideoPlaying={isVideoPlaying}
              setIsVideoPlaying={setIsVideoPlaying}
              loading={loading}
            />
          ) : (
            <div className="text-center text-red-600 dark:text-red-400 mt-10 font-medium">
              Loading video map...
            </div>
          )}
        </div>
      </div>
      <div className="w-full mt-6 px-4">
        <KeywordDisplay processedKeywords={processedKeywords} currentIndex={currentIndex} />
      </div>
    </div>
  );
};

export default TextToSign;
