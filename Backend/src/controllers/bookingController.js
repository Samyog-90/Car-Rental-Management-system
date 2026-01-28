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
        const newBooking = req.body;
        newBooking.status = "Pending";
        newBooking.createdAt = new Date();

        const result = await Booking.collection().insertOne(newBooking);
        res.status(201).json({ ...newBooking, _id: result.insertedId });
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
