
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../Configs/cloudinary.js';

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'skincare-products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

export const parser = multer({ storage });
