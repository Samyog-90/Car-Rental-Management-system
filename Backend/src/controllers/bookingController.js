const Booking = require("../models/Booking");
const { ObjectId } = require("mongodb");

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.collection().find().toArray();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const bookingData = req.body;

        // Add file paths if they exist
        if (req.files) {
            if (req.files.licenseFront) bookingData.licenseFront = req.files.licenseFront[0].path;
            if (req.files.licenseBack) bookingData.licenseBack = req.files.licenseBack[0].path;
            if (req.files.nidFront) bookingData.nidFront = req.files.nidFront[0].path;
            if (req.files.nidBack) bookingData.nidBack = req.files.nidBack[0].path;
        }

        bookingData.status = "Pending";
        bookingData.createdAt = new Date();

        const result = await Booking.collection().insertOne(bookingData);
        res.status(201).json({ ...bookingData, _id: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // e.g., "Approved", "Rejected", "Completed"

        const result = await Booking.collection().updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );

        if (result.matchedCount === 0) return res.status(404).json({ message: "Booking not found" });

        res.json({ message: `Booking marked as ${status}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
