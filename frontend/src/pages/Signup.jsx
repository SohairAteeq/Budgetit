import { useState } from "react";
import { assets } from "../assets/assets.js";
import { validateEmail } from "../util/validateEmail.js";
import { ApiEndPoints } from "../util/ApiEndPoints.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../util/axiosConfig.jsx";
import Footer from "../components/Footer.jsx";


// Components
import AvatarUpload from "../components/AvatarUpload.jsx";
import InputField from "../components/InputField.jsx";
import SubmitButton from "../components/SubmitButton.jsx";
import NavbarHome from "../components/NavbarHome.jsx";

// Utils
import { uploadToCloudinary } from "../util/UploadToCloudinary.jsx";
import defaultImage2 from "../assets/defaultImage2.jpg";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const DEFAULT_IMAGE_URL = defaultImage2;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError("Please enter your fullname");
      return;
    }
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let profileImageUrl = DEFAULT_IMAGE_URL;
      if (profileImage) {
        const uploadedUrl = await uploadToCloudinary(profileImage);
        if (uploadedUrl) profileImageUrl = uploadedUrl;
      }

      await axiosConfig.post(ApiEndPoints.register, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      toast.success(
        "Profile created! 📧 Check your email for the activation link.",
        { duration: 5000 }
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarHome />
      <div className="relative w-screen h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden dark:bg-gray-900 transition-colors duration-500">
        {/* Background */}
        <img
          src={assets.login_bg}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover blur-sm dark:opacity-30 opacity-60 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70 transition-colors duration-500"></div>

        {/* Signup Card */}
        <div className="relative z-10 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 w-[85%] max-w-[450px] transition-colors duration-500">
          {/* Header */}
          <div className="text-center mb-6">
            <img
              src={assets.logo}
              alt="BudgetIt Logo"
              className="w-12 h-12 mx-auto mb-3"
            />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Create Your Account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Get started with managing your money smartly
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-4">
            <AvatarUpload
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 dark:text-gray-300">
              <InputField
                label="Full Name"
                type="text"
                value={fullName}
                placeholder="John Doe"
                onChange={(e) => setFullName(e.target.value)}
                className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 border-gray-300 dark:placeholder-gray-400 placeholder-gray-500"
              />

              <InputField
                label="Email"
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 border-gray-300 dark:placeholder-gray-400 placeholder-gray-500"
              />
            </div>

            {/* Replaced PasswordField with inline input + toggle */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-colors duration-300"
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

            <SubmitButton loading={loading}>Sign Up</SubmitButton>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-5">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-600 dark:text-green-400 hover:underline font-medium"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
