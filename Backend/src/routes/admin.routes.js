const express = require("express");
const router = express.Router();
const { adminLogin, adminRegister, getDashboardStats, getUsers, deleteUser, getAdminProfile, changePassword } = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", adminLogin);
router.post("/register", adminRegister);

router.get("/profile", authMiddleware, getAdminProfile);
router.put("/change-password", authMiddleware, changePassword);
router.get("/stats", authMiddleware, getDashboardStats);
router.get("/users", authMiddleware, getUsers);
router.delete("/users/:id", authMiddleware, deleteUser);

module.exports = router;
