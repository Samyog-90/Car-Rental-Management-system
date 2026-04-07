const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");

// Check NID validity (Mock Govt API)
router.get("/check/:nidNumber", async (req, res) => {
    try {
        const { nidNumber } = req.params;
        const db = getDB();


        const nid = await db
            .collection("nids")
            .findOne({ nidNumber });

        if (!nid) {
      
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
