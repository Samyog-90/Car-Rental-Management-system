const Tesseract = require("tesseract.js");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const extractData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { docType } = req.body; // optional: hand-provided doc type
    const imagePath = req.file.path;
    const processedImagePath = path.join(
      path.dirname(imagePath),
      "processed-" + req.file.filename
    );

    // 1. Preprocessing with sharp
    // Auto-rotate and enhance contrast/sharpness
    await sharp(imagePath)
      .rotate() // uses EXIF data for rotation
      .normalize() // enhance contrast
      .sharpen()
      .toFile(processedImagePath);

    // 2. OCR using Tesseract
    const { data: { text } } = await Tesseract.recognize(processedImagePath, "eng", {
      // logger: (m) => console.log(m),
    });

    // delete processed image after OCR (or keep it if you want)
    // fs.unlinkSync(processedImagePath);

    // 3. Analyze and Parse Text
    const extractedData = parseOCRText(text, docType);

    res.status(200).json({
      message: "OCR successful",
      text, // for debugging
      extractedData,
      docType: extractedData.detectedDocType || docType
    });
  } catch (error) {
    console.error("OCR Error:", error);
    res.status(500).json({ message: "Failed to process image with OCR", error: error.message });
  }
};

const parseOCRText = (text, forcedType) => {
  const result = {
    detectedDocType: "",
    fields: {}
  };

  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const normalizedText = text.toLowerCase();

  // Simple classification logic based on keywords
  let type = forcedType || "";
  if (!type) {
    if (normalizedText.includes("driving") || normalizedText.includes("license") || normalizedText.includes("driver")) {
      type = "LICENSE_FRONT"; 
      // check for "categories", "class", "restriction" to pick back
      if (normalizedText.includes("categories") || normalizedText.includes("class") || normalizedText.includes("restriction") || normalizedText.includes("authority")) {
        type = "LICENSE_BACK";
      }
    } else if (normalizedText.includes("national") || normalizedText.includes("id") || normalizedText.includes("citizen")) {
      type = "NID_FRONT";
      if (normalizedText.includes("address") || normalizedText.includes("permanent") || normalizedText.includes("details")) {
        type = "NID_BACK";
      }
    }
  }

  result.detectedDocType = type;

  // Extraction logic (highly dependent on doc layout - these are generic patterns)
  // License Front: Full Name, License Number, DOB, Issue Date, Expiry Date
  if (type === "LICENSE_FRONT") {
    result.fields = {
      fullName: extractPattern(text, /Name[:\s]+([A-Z\s]+)/i),
      licenseNumber: extractPattern(text, /License\s*No[:\s]*([A-Z0-9-]+)/i),
      dob: extractPattern(text, /DOB[:\s]*([\d\-\/]+)/i),
      issueDate: extractPattern(text, /Issue[:\s]*([\d\-\/]+)/i),
      expiryDate: extractPattern(text, /Expiry[:\s]*([\d\-\/]+)/i)
    };
  } else if (type === "LICENSE_BACK") {
    // License Back: Categories, Issuing Authority
    result.fields = {
      categories: extractPattern(text, /Categories[:\s]*([A-Z0-9,\s]+)/i),
      issuingAuthority: extractPattern(text, /Authority[:\s]*([A-Z\s]+)/i)
    };
  } else if (type === "NID_FRONT") {
    // NID Front: Full Name, NID Number, DOB, Gender
    result.fields = {
      fullName: extractPattern(text, /Name[:\s]+([A-Z\s]+)/i),
      nidNumber: extractPattern(text, /ID\s*No[:\s]*([\d\s]+)/i),
      dob: extractPattern(text, /DOB[:\s]*([\d\-\/]+)/i),
      gender: extractPattern(text, /Gender[:\s]*([MF])/i)
    };
  } else if (type === "NID_BACK") {
    // NID Back: Address, Additional Details
    result.fields = {
      address: extractPattern(text, /Address[:\s]*(.+)/i),
      additionalInfo: extractPattern(text, /Details[:\s]*(.+)/i)
    };
  }

  // Fallback: If some mandatory fields are missing, try more aggressive extraction
  if (!result.fields.fullName) {
      // Find longest uppercase line starting with something alphabetical
      const capitalizedLines = lines.filter(l => /^[A-Z\s]{5,}$/.test(l));
      if (capitalizedLines.length > 0) result.fields.fullName = capitalizedLines[0];
  }

  return result;
};

const saveExtractedData = async (req, res) => {
  try {
    const { data, docType } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!data) {
      return res.status(400).json({ message: "No data to save" });
    }

    const { getDB } = require("../config/db");
    const db = getDB();
    const { ObjectId } = require("mongodb");

    const updateField = {};
    updateField[`documents.${docType}`] = {
      ...data,
      verifiedAt: new Date(),
      status: "VERIFIED"
    };

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateField }
    );

    res.status(200).json({ message: "Document data saved successfully" });
  } catch (error) {
    console.error("Save OCR Data Error:", error);
    res.status(500).json({ message: "Failed to save document data" });
  }
};

const extractPattern = (text, regex) => {
  const match = text.match(regex);
  return match ? match[1].trim() : "";
};

module.exports = {
  extractData,
  saveExtractedData
};
