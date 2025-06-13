const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: 'myfolder',
        resource_type: 'auto', // ✅ handles image/pdf/video/etc.
        format: file.mimetype.split('/')[1], // e.g., 'jpeg'
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // ✅ Optional: unique + readable
    }),
});

const uploads = multer({ storage });

module.exports = uploads;
