require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");
const { seedData } = require("./config/seed_data"); 

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json()); 

async function startServer() {
  try {
    await connectDB();
    await seedData(); // Run seeding
    console.log("Backend & Database connected");

    app.use("/api/users", require("./routes/userRoutes"));
    app.use("/api/gov/license", require("./routes/licenseRoutes"));
    app.use("/api/gov/nid", require("./routes/nidRoutes"));
    app.use("/api/admin", require("./routes/admin.routes"));
    app.use("/api/cars", require("./routes/carRoutes"));
    app.use("/api/bookings", require("./routes/bookingRoutes"));
    app.use("/api/payment", require("./routes/paymentRoutes"));
    app.use("/api/ocr", require("./routes/ocrRoutes"));


    app.use('/uploads', express.static('uploads'));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();

