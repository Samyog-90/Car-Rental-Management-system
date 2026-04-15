const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Public route to send message
router.post("/send", messageController.sendMessage);

// Protected admin routes
router.get("/all", verifyToken, isAdmin, messageController.getMessages);
router.put("/read/:id", verifyToken, isAdmin, messageController.markAsRead);
router.delete("/:id", verifyToken, isAdmin, messageController.deleteMessage);

module.exports = router;
