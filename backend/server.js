import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import karigarRoutes from "./routes/karigar.js";
import bookingRoutes from "./routes/booking.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "KARIGAR Backend is Running 🚀",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/karigars", karigarRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully ✅");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Local: http://localhost:${PORT}`);
      console.log(`Mobile: http://192.168.29.46:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed ❌");
    console.error(error.message);
  });