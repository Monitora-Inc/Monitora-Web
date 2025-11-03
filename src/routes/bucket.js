const express = require('express');
const multer = require('multer');
const { uploadToS3 } = require('../controllers/bucketController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadToS3);

module.exports = router;
