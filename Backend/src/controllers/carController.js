const Car = require("../models/Car");
const { ObjectId } = require("mongodb");

exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.collection().find().toArray();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await Car.collection().findOne({ _id: new ObjectId(req.params.id) });
        if (!car) return res.status(404).json({ message: "Car not found" });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCar = async (req, res) => {
    try {
        const newCar = req.body;
        newCar.createdAt = new Date();
        const result = await Car.collection().insertOne(newCar);
        res.status(201).json({ ...newCar, _id: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCar = req.body;
        // Remove _id from update body if present to avoid immutable field error
        delete updatedCar._id;

        const result = await Car.collection().updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedCar }
        );

        if (result.matchedCount === 0) return res.status(404).json({ message: "Car not found" });

        res.json({ message: "Car updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Car.collection().deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: "Car not found" });
        res.json({ message: "Car deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
