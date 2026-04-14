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

exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.collection().find({ userId }).sort({ createdAt: -1 }).toArray();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const bookingData = { ...req.body };
        if (req.user) {
            bookingData.userId = req.user.id;
        }

        // Add file paths if they exist
        if (req.files) {
            if (req.files.licenseFront?.[0]) bookingData.licenseFront = req.files.licenseFront[0].path;
            if (req.files.licenseBack?.[0]) bookingData.licenseBack = req.files.licenseBack[0].path;
            if (req.files.nidFront?.[0]) bookingData.nidFront = req.files.nidFront[0].path;
            if (req.files.nidBack?.[0]) bookingData.nidBack = req.files.nidBack[0].path;
        }

        bookingData.status = "Pending";
        bookingData.createdAt = new Date();

        console.log("Creating booking with data:", bookingData);
        const result = await Booking.collection().insertOne(bookingData);
        console.log("Booking created successfully:", result.insertedId);
        res.status(201).json({ ...bookingData, _id: result.insertedId });
    } catch (err) {
        console.error("Booking Creation Error:", err);
        res.status(500).json({ message: "Internal Server Error: " + err.message });
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

        // Create Notification if Approved
        if (status === "Approved") {
            const notificationModel = require("../models/Notification");
            const booking = await Booking.collection().findOne({ _id: new ObjectId(id) });
            if (booking && booking.userId) {
                await notificationModel.collection().insertOne({
                    userId: booking.userId,
                    bookingId: id,
                    message: `Your booking for ${booking.carName} has been approved! The car is on its way.`,
                    type: "approval",
                    read: false,
                    createdAt: new Date()
                });
            }
        }

        res.json({ message: `Booking marked as ${status}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
