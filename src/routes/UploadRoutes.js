
const express = require("express");
const upload = require("../controllers/uploadController");

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
    res.json({
        imageUrl: req.file.location,
    });
});

module.exports = router;