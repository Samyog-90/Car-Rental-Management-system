const express = require("express");
const router = express.Router();
const { getAllCars, getCarById, createCar, updateCar, deleteCar } = require("../controllers/carController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public routes (if any, e.g. viewing cars)
router.get("/", getAllCars);
router.get("/:id", getCarById);

// Protected Admin routes
router.post("/", authMiddleware, createCar);
router.put("/:id", authMiddleware, updateCar);
router.delete("/:id", authMiddleware, deleteCar);

module.exports = router;
