const express = require('express');
const multer = require('multer');
var bucketController = require('../controllers/bucketController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), bucketController.uploadToS3);

router.get("/read/:prefix/:index", function(req, res) {
    bucketController.readCSV(req, res);
});

module.exports = router;
