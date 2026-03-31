
const express = require("express");
const upload = require("../controllers/UploadController");
const {authToken, authorizeByRole} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", authToken, authorizeByRole('oscar'), upload.single("image"), (req, res) => {
    res.json({
        imageUrl: req.file.location,
    });
});

module.exports = router;