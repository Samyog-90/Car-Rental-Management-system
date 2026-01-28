const express = require("express");
const router = express.Router();
const { getAllBookings, createBooking, updateBookingStatus } = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public or User route
router.post("/", createBooking);

// Admin routes
router.get("/", authMiddleware, getAllBookings);
router.put("/:id/status", authMiddleware, updateBookingStatus);

module.exports = router;
