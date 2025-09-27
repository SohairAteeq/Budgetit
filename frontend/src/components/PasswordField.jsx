import { useState } from "react";

const PasswordField = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-600 mb-1">
        Password
      </label>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-green-500 text-sm dark:border-gray-600"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 text-sm"
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
  );
};

export default PasswordField;
