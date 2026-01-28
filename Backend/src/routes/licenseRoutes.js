const express = require("express");
const router = express.Router();
const { connectDB } = require("../config/db");

// Check license validity (Mock Govt API)
router.get("/check/:licenseNumber", async (req, res) => {
  try {
    const { licenseNumber } = req.params;
    const db = await connectDB();

    const license = await db
      .collection("licenses")
      .findOne({ licenseNumber });

    if (!license) {
      return res.status(404).json({
        valid: false,
        message: "License not found"
      });
    }

    if (license.status !== "VALID") {
      return res.status(400).json({
        valid: false,
        status: license.status,
        message: "License is not valid"
      });
    }

    res.status(200).json({
      valid: true,
      holderName: license.holderName,
      expiryDate: license.expiryDate
    });
  } catch (error) {
    res.status(500).json({ message: "Government service error" });
  }
});

module.exports = router;
