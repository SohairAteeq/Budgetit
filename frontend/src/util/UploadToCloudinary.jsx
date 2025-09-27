import { Import } from "lucide-react";
import { ApiEndPoints } from "./ApiEndPoints";
import { CLOUDINARY_CLOUD_NAME } from "./ApiEndPoints";
import { CLOUDINARY_CLOUD_UNSIGNED_PRESET } from "./ApiEndPoints";

// src/util/uploadToCloudinary.js
export const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_CLOUD_UNSIGNED_PRESET); // replace with your preset
    data.append("cloud_name", CLOUDINARY_CLOUD_NAME);
  
    try {
      const res = await fetch(
        ApiEndPoints.UPLOAD_IMAGE,
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();
      console.log(result)
      return result.secure_url; // Cloudinary returns the URL
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      return null;
    }
  };
  