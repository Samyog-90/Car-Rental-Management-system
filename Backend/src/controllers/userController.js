const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { fullName, email, password } = req.body;

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
        const user = await User.collection().findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
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
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
