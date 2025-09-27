const InputField = ({ label, type, placeholder, value, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                   placeholder-gray-400 dark:placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-colors duration-300"
      />
    </div>
  );
};

export default InputField;

  