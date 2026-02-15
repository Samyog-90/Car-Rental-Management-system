require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json()); // ✅ once only

async function startServer() {
  await connectDB();
  console.log("Backend & Database connected");

  app.use("/api/users", require("./routes/userRoutes"));
  app.use("/api/gov/license", require("./routes/licenseRoutes"));
  app.use("/api/admin", require("./routes/admin.routes"));
  app.use("/api/cars", require("./routes/carRoutes"));
  app.use("/api/bookings", require("./routes/bookingRoutes"));
  app.use("/api/payment", require("./routes/paymentRoutes"));

  // Serve static files from uploads directory
  app.use('/uploads', express.static('uploads'));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
