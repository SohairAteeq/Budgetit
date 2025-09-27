// src/components/AfterLoginNavbar.jsx
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut, ChevronDown } from "lucide-react";
import { AppContext } from "../context/AppContext";
import walletLogo from "../assets/wallet.svg";
import defaultImage from "../assets/defaultImage2.jpg"

const AfterLoginNavbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppContext);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        return storedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Apply dark/light mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sidebarOpen")
    setUser(null);
    navigate("/home");
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center relative">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <img src={walletLogo} alt="Wallet" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Budgetit
            </span>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-6">
            {/* User Dropdown */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <img
                    src={user.profileImageUrl || defaultImage}
                    alt={user.fullName}
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {user.fullName}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 dark:text-gray-300 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border dark:border-gray-700">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center px-4 py-4 border-b dark:border-gray-700">
                      <img
                        src={user.profileImageUrl || defaultImage}
                        alt={user.fullName}
                        className="w-16 h-16 rounded-full object-cover border mb-2"
                      />
                      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                        {user.fullName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {user.email || "No email available"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col">
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {darkMode ? (
                          <Sun className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <Moon className="w-4 h-4 text-indigo-400" />
                        )}
                        {darkMode ? "Light Mode" : "Dark Mode"}
                      </button>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 z-50"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-gray-800 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
            )}
          </button>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md border-t dark:border-gray-700 z-50 flex flex-col gap-4 px-6 py-6 max-h-[90vh] overflow-y-auto">
              {/* Profile Section */}
              {user && (
                <div className="flex flex-col items-center py-4 border-b dark:border-gray-700">
                  <img
                    src={user.profileImageUrl || "/default-avatar.png"}
                    alt={user.fullName}
                    className="w-20 h-20 rounded-full object-cover border mb-3"
                  />
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {user.fullName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {user.email || "No email available"}
                  </p>
                </div>
              )}

              {/* Dark Mode */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium transition"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-400" />
                )}
                {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center justify-center gap-3 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AfterLoginNavbar;
