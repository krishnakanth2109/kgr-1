// --- START OF FILE api/uploadApi.js ---
import axios from 'axios';

// --- IMPORTANT: ADD YOUR CLOUDINARY DETAILS HERE ---
const CLOUD_NAME = "YOUR_CLOUD_NAME";
const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; // Create an Unsigned preset in Cloudinary

// This function uploads a file and calls onProgress with the upload percentage
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) {
            onProgress(percent);
          }
        },
      }
    );
    // Return the secure URL of the uploaded file
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("File upload failed.");
  }
};