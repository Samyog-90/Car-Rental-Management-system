const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

exports.register = async (req, res) => {
    const { fullName, email, password, contactNumber } = req.body;

    try {
        const existingUser = await User.collection().findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await User.collection().insertOne({
            fullName,
            email,
            contactNumber: contactNumber || "",
            password: hashedPassword,
            createdAt: new Date(),
            role: 'user'
        });

        res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.collection().findOne({ 
            email: { $regex: new RegExp(`^${email}$`, "i") } 
        });
        if (!user) {
            return res.status(400).json({ message: "Debug: User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Debug: Password mismatch" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "secret_key",
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                contactNumber: user.contactNumber || "",
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.collection().findOne(
            { _id: new ObjectId(req.user.id) },
            { projection: { password: 0 } }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { fullName, email, contactNumber } = req.body;
        const result = await User.collection().updateOne(
            { _id: new ObjectId(req.user.id) },
            { $set: { fullName, email, contactNumber } }
        );
        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.collection().findOne({ _id: new ObjectId(req.user.id) });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.collection().updateOne(
            { _id: new ObjectId(req.user.id) },
            { $set: { password: hashedPassword } }
        );

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const Notification = require("../models/Notification");
        const notifications = await Notification.collection()
            .find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .toArray();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.markNotificationRead = async (req, res) => {
    try {
        const Notification = require("../models/Notification");
        const { id } = req.params;
        await Notification.collection().updateOne(
            { _id: new ObjectId(id), userId: req.user.id },
            { $set: { read: true } }
        );
        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
