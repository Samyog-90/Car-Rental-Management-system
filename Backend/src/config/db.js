const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

let client;
let db;

async function connectDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();

    db = client.db("car_rental_db");
    console.log("MongoDB connected successfully");

    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

const getDB = () => {
  if (!db) {
    throw new Error("Database not connected!");
  }
  return db;
}

module.exports = { connectDB, getDB };
