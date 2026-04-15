const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { extractData, saveExtractedData } = require("../controllers/ocrController");
const authMiddleware = require("../middlewares/authMiddleware");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../uploads/ocr");
    if (!require("fs").existsSync(uploadDir)) {
      require("fs").mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB Limit
});

// OCR processing route
router.post("/process", upload.single("documentImage"), extractData);

// Save confirmed OCR data route
router.post("/save", authMiddleware, saveExtractedData);

module.exports = router;
