const express = require('express');
const multer = require('multer');
const Image = require('../models/Image');

const router = express.Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Image upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const newImage = new Image({
      name: req.file.originalname,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    await newImage.save();
    res.status(201).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Fetch all images route
router.get('/images', async (req, res) => {
  try {
    const images = await Image.find({});
    // console.log(images);
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

module.exports = router;
