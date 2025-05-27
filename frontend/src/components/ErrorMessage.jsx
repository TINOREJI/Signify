const ErrorMessage = ({ errorMsg, setErrorMsg }) => {
  if (!errorMsg) return null;

  return (
    <div className="w-full max-w-7xl mx-auto mb-6">
      <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errorMsg}</span>
        </div>
        <button
          onClick={() => setErrorMsg('')}
          className="text-red-700 dark:text-red-200 hover:text-red-900 dark:hover:text-red-400 font-bold"
          aria-label="Close error message"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;