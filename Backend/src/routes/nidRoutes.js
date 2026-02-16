const express = require("express");
const router = express.Router();
const { connectDB } = require("../config/db");

// Check NID validity (Mock Govt API)
router.get("/check/:nidNumber", async (req, res) => {
    try {
        const { nidNumber } = req.params;
        const db = await connectDB();

        // Mock logic: In a real app, this would query a government database
        // For this demo, let's assume we have a 'citizenships' or 'nids' collection
        // OR we can simple allow any NID that follows a specific format for demo purposes if DB is empty

        // Strategy: Try to find in DB. If DB is empty/not setup, fallback to regex check for demo?
        // Let's stick to the pattern in licenseRoutes for consistency: DB Verification.

        const nid = await db
            .collection("nids")
            .findOne({ nidNumber });

        if (!nid) {
            // For demo convenience, let's strictly return 404 like the license route
            // But to help the user test, maybe we can accept a specific magic number?
            // Let's stick to DB first.
            return res.status(404).json({
                valid: false,
                message: "National ID not found"
            });
        }

        res.status(200).json({
            valid: true,
            fullName: nid.fullName,
            dob: nid.dob,
            address: nid.address
        });
    } catch (error) {
        console.error("NID Check Error:", error);
        res.status(500).json({ message: "Government service error" });
    }
});

module.exports = router;
