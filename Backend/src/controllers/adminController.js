const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.collection().findOne({ email });

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.collection().findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await Admin.collection().insertOne({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date()
    });

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


