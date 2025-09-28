import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import walletLogo from "../assets/wallet.svg";

const HomeNavbar = () => {
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
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    if (window.location.pathname !== "/home") {
      navigate("/home"); // Ensure we’re on homepage first
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white text-gray-800 dark:bg-gray-900 dark:text-white shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center relative">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            <img src={walletLogo} alt="Wallet" className="w-8 h-8" />
            <span className="text-xl font-bold whitespace-nowrap">Budgetit</span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="group relative font-medium text-gray-700 dark:text-gray-200 transition duration-300 hover:text-indigo-500 dark:hover:text-indigo-400"
            >
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="group relative font-medium text-gray-700 dark:text-gray-200 transition duration-300 hover:text-indigo-500 dark:hover:text-indigo-400"
            >
              About Us
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="group relative font-medium text-gray-700 dark:text-gray-200 transition duration-300 hover:text-indigo-500 dark:hover:text-indigo-400"
            >
              Contact Us
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {/* Right: Dark Mode + Buttons */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label="Toggle Dark Mode"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Login */}
            <button
              onClick={() => navigate("/login")}
              className="relative inline-block px-4 sm:px-6 py-2 rounded-lg font-bold text-white
                         bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-700
                         overflow-hidden group hover:scale-105 transform transition-all duration-300
                         shadow-[0_0_20px_rgba(99,102,241,0.7)] text-sm sm:text-base"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-400
                               blur-xl opacity-50 group-hover:opacity-100 animate-pulse rounded-lg"></span>
              <span className="relative z-10">Login</span>
            </button>

            {/* Get Started */}
            <button
              onClick={() => navigate("/signup")}
              className="relative inline-block px-4 sm:px-6 py-2 rounded-lg font-bold text-white
                         bg-gradient-to-r from-green-600 via-green-400 to-green-600
                         overflow-hidden group hover:scale-105 transform transition-all duration-300
                         shadow-[0_0_20px_rgba(34,197,94,0.7)] text-sm sm:text-base"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-300 via-green-500 to-green-300
                               blur-xl opacity-50 group-hover:opacity-100 animate-pulse rounded-lg"></span>
              <span className="relative z-10">Get Started</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 z-50"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md border-t dark:border-gray-700 z-50 flex flex-col gap-3 px-4 py-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => scrollToSection("home")}
                className="block py-2 text-base hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block py-2 text-base hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block py-2 text-base hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                Contact Us
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center justify-center py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition gap-2 text-base"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

              {/* Mobile Login */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="relative block py-2 px-4 rounded-lg text-center font-bold text-white
                           bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-700
                           overflow-hidden group hover:scale-105 transform transition-all duration-300
                           shadow-[0_0_20px_rgba(99,102,241,0.7)] text-sm sm:text-base"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-400
                                 blur-xl opacity-50 group-hover:opacity-100 animate-pulse rounded-lg"></span>
                <span className="relative z-10">Login</span>
              </button>

              {/* Mobile Get Started */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/signup");
                }}
                className="relative block py-2 px-4 rounded-lg text-center font-bold text-white
                           bg-gradient-to-r from-green-600 via-green-400 to-green-600
                           overflow-hidden group hover:scale-105 transform transition-all duration-300
                           shadow-[0_0_20px_rgba(34,197,94,0.7)] text-sm sm:text-base"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-green-300 via-green-500 to-green-300
                                 blur-xl opacity-50 group-hover:opacity-100 animate-pulse rounded-lg"></span>
                <span className="relative z-10">Get Started</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
