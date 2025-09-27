const SubmitButton = ({ loading, children }) => {
    return (
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 
          hover:from-green-700 hover:to-emerald-700 text-white py-2 
          rounded-lg font-medium text-sm transition-transform transform 
          hover:scale-[1.02] flex items-center justify-center`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Creating...
          </>
        ) : (
          children
        )}
      </button>
    );
  };
  
  export default SubmitButton;
  