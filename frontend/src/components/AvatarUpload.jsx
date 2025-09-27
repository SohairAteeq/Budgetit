import { useState } from "react";
import { assets } from "../assets/assets.js";
import defaultImage2 from "../assets/defaultImage2.jpg"

const AvatarUpload = ({ profileImage, setProfileImage }) => {
  const [previewImage, setPreviewImage] = useState(assets.default_avatar);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="relative flex justify-center mb-6">
      <div className="relative w-24 h-24">
        <img
          src={profileImage ? previewImage : defaultImage2}
          alt="Profile Preview"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        />

        {/* Upload Button */}
        <label
          htmlFor="profile-upload"
          className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 
             text-white w-6 h-6 flex items-center justify-center 
             rounded-full cursor-pointer shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </label>


        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default AvatarUpload;
