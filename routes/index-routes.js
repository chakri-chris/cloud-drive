const express = require('express');
const authmiddleWare = require('../middlewares/auth');
const uploads = require('../config/multer');
const fileModel = require('../models/file.models');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

// ------------------- Home Route -------------------
router.get('/home', authmiddleWare, async (req, res) => {
    const userfiles = await fileModel.find({ user: req.user.id });
    res.render('home', {
        files: userfiles
    });
});

// ------------------- Upload Route -------------------
router.post('/upload', authmiddleWare, uploads.single('file'), async (req, res) => {
    const newFile = await fileModel.create({
        path: req.file.filename, // ✅ use filename, not full path
        originalname: req.file.originalname,
        user: req.user.id
    });
    res.json(newFile);
});

// ------------------- Download Route -------------------
router.get('/download/:path', authmiddleWare, async (req, res) => {
    try {
        const loginid = req.user.id;
        const path = req.params.path;

        const file = await fileModel.findOne({
            path: path,
            user: loginid
        });

        if (!file) {
            return res.status(401).json({
                message: "Unauthorized or file not found"
            });
        }

        const signedUrl = cloudinary.url(file.path, {
            sign_url: true,
            secure: true,
            expires_at: Math.floor(Date.now() / 1000) + 60 // Expires in 60 seconds
        });

        return res.redirect(signedUrl);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;
