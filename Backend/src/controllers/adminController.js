const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const User = require("../models/User");
    const user = await User.collection().findOne({ 
      email: { $regex: new RegExp(`^${email}$`, "i") }, 
      role: "admin" 
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials or not an admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: user._id,
        name: user.fullName,
        role: user.role
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

exports.getDashboardStats = async (req, res) => {
  try {
    const Car = require("../models/Car");
    const User = require("../models/User");
    const Booking = require("../models/Booking");

    const totalCars = await Car.collection().countDocuments();
    const totalUsers = await User.collection().countDocuments();
    const bookings = await Booking.collection().find().toArray();

    const activeBookings = bookings.filter(b => b.status === "Pending" || b.status === "Approved").length;

    let totalRevenue = 0;
    
    // Generate Chart Data (Last 7 days)
    const chartDataMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      chartDataMap[dateStr] = 0;
    }

    bookings.forEach(b => {
      // Calculate Revenue
      if (b.totalPrice) {
        const priceStr = String(b.totalPrice).replace(/[^0-9.]/g, '');
        const price = parseFloat(priceStr);
        if (!isNaN(price)) {
            totalRevenue += price;

            if (b.createdAt) {
                const bDateStr = new Date(b.createdAt).toISOString().split('T')[0];
                if (chartDataMap[bDateStr] !== undefined) {
                    chartDataMap[bDateStr] += price;
                }
            }
        }
      }
    });

    const chartData = Object.keys(chartDataMap).map(date => ({
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: chartDataMap[date]
    }));

    // Generate Recent Activity
    const recentActivity = bookings
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5)
      .map(b => ({
        message: `New booking for ${b.carName || 'Vehicle'}`,
        time: b.createdAt
      }));

    res.json({
      totalCars,
      totalUsers,
      activeBookings,
      totalRevenue: `Rs. ${totalRevenue.toLocaleString()}`,
      chartData,
      recentActivity
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const User = require("../models/User");
    const users = await User.collection().find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const User = require("../models/User");
    const { ObjectId } = require("mongodb");
    const result = await User.collection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");
    const User = require("../models/User");
    const admin = await User.collection().findOne(
      { _id: new ObjectId(req.admin.id), role: 'admin' },
      { projection: { password: 0 } }
    );
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { ObjectId } = require("mongodb");
    const User = require("../models/User");
    const admin = await User.collection().findOne({ _id: new ObjectId(req.admin.id), role: 'admin' });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.collection().updateOne(
      { _id: new ObjectId(req.admin.id) },
      { $set: { password: hashedPassword } }
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
