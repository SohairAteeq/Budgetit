// Login.jsx
import { useState, useContext } from "react";
import { assets } from "../assets/assets.js";
import { ApiEndPoints } from "../util/ApiEndPoints.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../util/axiosConfig.jsx";
import { AppContext } from "../context/AppContext";
import NavbarHome from "../components/NavbarHome.jsx";
import Footer from "../components/Footer.jsx";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axiosConfig.post(ApiEndPoints.login, {
        email,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);

        let user = res.data?.user
        console.log(user)
        setUser(user);

        toast.success("Welcome back! 🎉", { duration: 4000 });
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);

      if (err.response?.status === 400) {
        setError("Invalid email or password");
        toast.error("Invalid credentials ❌", { duration: 4000 });
      } else if (err.response?.status === 403) {
        setError("Your account is not activated. Please check your email.");
        toast.error("Account not activated ⚠️", { duration: 4000 });
      } else {
        setError(err.response?.data?.message || err.message);
        toast.error("Something went wrong 😕", { duration: 4000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarHome className="backdrop-blur-sm" />

      {/* Main Container */}
      <div className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center dark:bg-gray-900 transition-colors duration-500">
        {/* Background */}
        <img
          src={assets.login_bg}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover blur-sm dark:opacity-30 opacity-60 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70 transition-colors duration-500"></div>

        {/* Login Form */}
        <div className="relative z-10 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 w-[90%] max-w-md transition-colors duration-500">
          <div className="text-center mb-6">
            <img
              src={assets.logo}
              alt="BudgetIt Logo"
              className="w-12 h-12 mx-auto mb-3"
            />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Log in to continue managing your money 💰
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-colors duration-300"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-colors duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors duration-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm dark:bg-red-900/70 dark:border-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 
              hover:from-green-700 hover:to-emerald-700 text-white py-2 
              rounded-lg font-medium text-sm transition-transform transform 
              hover:scale-[1.02] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed`}
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
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-5">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-green-600 dark:text-green-400 hover:underline font-medium"
            >
              Sign Up
            </a>
          </p>
        </div>
        
      </div>
    </>
  );
};

export default Login;
