import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const InputForm = ({ text, setText, handleSubmit, handleReset, loading, hasVideos }) => {
  const LANGUAGES = [
    { label: 'English', value: 'en-US', icon: '🇬🇧' },
    { label: 'Hindi', value: 'hi-IN', icon: '🇮🇳' },
    { label: 'Malayalam', value: 'ml-IN', icon: '🇮🇳' },
  ];

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [language, setLanguage] = useState(LANGUAGES[0].value);

  useEffect(() => {
    if (!listening && transcript) {
      setText(transcript);
      resetTranscript();
    }
  }, [listening, transcript, resetTranscript, setText]);

  return (
    <div className="space-y-6 max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
      {/* Language Selector (Top Right) */}
      <div className="flex justify-end">
        <div className="relative w-full sm:w-48">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="appearance-none w-full p-3 rounded-xl border border-violet-300 dark:border-violet-600 bg-white dark:bg-gray-700 text-violet-700 dark:text-violet-300 font-medium focus:ring-2 focus:ring-violet-400 text-sm cursor-pointer transition-all duration-200 shadow-sm hover:border-violet-400 hover:shadow-md pr-10"
            aria-label="Select language for speech recognition"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.icon} {lang.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-violet-500 dark:text-violet-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Input Field and Speech Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Text Input */}
        <div className="relative flex-1 w-full">
          <label htmlFor="inputText" className="text-gray-800 dark:text-gray-100 font-semibold text-lg mb-2 block">
            Enter your text
          </label>
          <input
            id="inputText"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={80}
            placeholder="e.g., Hello, My Name is Signify"
            className="w-full p-4 text-base rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-sm hover:shadow-md focus:bg-gray-50 dark:focus:bg-gray-600"
          />
        </div>

        {/* Speech Control Buttons */}
        <div className="flex sm:flex-col gap-3 mt-6 sm:mt-0 sm:pt-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => SpeechRecognition.startListening({ language })}
              className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg transition-all duration-300 hover:scale-110 focus:ring-4 focus:ring-violet-400/50 ${
                listening ? 'animate-pulse ring-4 ring-violet-400/50' : ''
              } ${!browserSupportsSpeechRecognition ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!browserSupportsSpeechRecognition}
              aria-label="Start Speech Recognition"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="7" y="2" width="6" height="10" rx="3" />
                <path d="M10 12v3m0 0h2m-2 0H8m4-3a4 4 0 10-8 0h8z" />
              </svg>
            </button>
            {!browserSupportsSpeechRecognition && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 shadow-md">
                !
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={SpeechRecognition.stopListening}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 focus:ring-2 focus:ring-gray-400/50 disabled:opacity-50 shadow-md hover:shadow-lg"
            disabled={!listening}
            aria-label="Stop Speech Recognition"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Transcript Display */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300 shadow-sm flex items-start gap-3 transition-all duration-200 border border-gray-100 dark:border-gray-600">
        <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="7" y="2" width="6" height="10" rx="3" />
          <path d="M10 12v3m0 0h2m-2 0H8m4-3a4 4 0 10-8 0h8z" />
        </svg>
        <div className="flex-1">
          <span className="font-semibold text-violet-600 dark:text-violet-400">Transcript:</span>{' '}
          <span className="italic text-gray-600 dark:text-gray-400">{transcript || 'Your speech transcript will appear here...'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleSubmit(language)}
          disabled={loading || !text.trim()}
          className={`flex-1 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 shadow-md hover:scale-102 focus:ring-2 focus:ring-violet-400/50 ${
            loading || !text.trim()
              ? 'bg-gray-400 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Processing...
            </div>
          ) : (
            'Submit'
          )}
        </button>
        {hasVideos && (
          <button
            onClick={handleReset}
            className="flex-1 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:scale-102 hover:shadow-xl focus:ring-2 focus:ring-gray-400/50"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default InputForm;
