const Message = require("../models/Message");
const { ObjectId } = require("mongodb");

exports.sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result = await Message.collection().insertOne({
            name,
            email,
            subject,
            message,
            createdAt: new Date(),
            status: 'unread'
        });

        res.status(201).json({ 
            message: "Message sent successfully", 
            messageId: result.insertedId 
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getMessages = async (req, res) => {
    try {
        // Only admin should access this, check handled by middleware
        const messages = await Message.collection()
            .find()
            .sort({ createdAt: -1 })
            .toArray();
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.collection().updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'read' } }
        );
        res.json({ message: "Message marked as read" });
    } catch (error) {
        console.error("Error updating message:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.collection().deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
