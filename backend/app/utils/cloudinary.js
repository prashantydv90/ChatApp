import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary (make sure to set these environment variables)
console.log('Cloudinary Environment Variables:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET', 
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
});

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET;
};

// Helper function to convert buffer to stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Upload file to Cloudinary
export const uploadToCloudinary = (fileBuffer, fileName, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        public_id: `chat_files/${Date.now()}_${fileName}`,
        folder: 'chat_app',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    bufferToStream(fileBuffer).pipe(uploadStream);
  });
};

// Delete file from Cloudinary
export const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

// Export the configuration check
export { isCloudinaryConfigured }; 