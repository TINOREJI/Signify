const KeywordDisplay = ({ processedKeywords, currentIndex }) => {
  const getCurrentWordIndex = (processedKeywords, currentIndex) => {
    let count = 0;
    for (let i = 0; i < processedKeywords.length; i++) {
      count += processedKeywords[i].videos.length;
      if (currentIndex < count) return i;
    }
    return -1;
  };

  if (processedKeywords.length === 0) return null;

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Detected Keywords</h2>
      <div className="flex flex-wrap gap-3">
        {processedKeywords.map((item, index) => {
          const isActive = index === getCurrentWordIndex(processedKeywords, currentIndex);
          return (
            <div
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform shadow-sm ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white scale-105 shadow-md'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 hover:scale-105'
              }`}
            >
              {item.word[0].toUpperCase() + item.word.slice(1).toLowerCase()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeywordDisplay;
