const express = require("express");
const router = express.Router();
const { connectDB } = require("../config/db");
const { register, login } = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);

// GET all users
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection("users").find().toArray();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");
    const { getDB } = require("../config/db");
    const db = getDB();

    const result = await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
