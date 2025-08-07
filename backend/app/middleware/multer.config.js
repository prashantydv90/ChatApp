import multer from 'multer';

// Configure multer for memory storage (we'll upload to Cloudinary directly)
const storage = multer.memoryStorage();

// File filter to accept images, videos, and documents
const fileFilter = (req, file, cb) => {
  // Accept images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  }
  // Accept videos
  else if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  }
  // Accept PDFs and documents
  else if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype === 'text/plain'
  ) {
    cb(null, true);
  }
  else {
    cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export default upload; 