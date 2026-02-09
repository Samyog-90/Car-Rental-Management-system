const express = require("express");
const router = express.Router();
const { getAllBookings, createBooking, updateBookingStatus } = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

// Public or User route
router.post("/", upload.fields([
    { name: 'licenseFront', maxCount: 1 },
    { name: 'licenseBack', maxCount: 1 },
    { name: 'nidFront', maxCount: 1 },
    { name: 'nidBack', maxCount: 1 }
]), createBooking);

// Admin routes
router.get("/", authMiddleware, getAllBookings);
router.put("/:id/status", authMiddleware, updateBookingStatus);

module.exports = router;
