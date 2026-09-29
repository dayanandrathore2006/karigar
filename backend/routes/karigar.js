import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get all available karigars
router.get("/", async (req, res) => {
  try {
    const { skill } = req.query;

    const filter = {
      role: "karigar",
      available: true,
    };

    // Agar specific skill select ki gayi hai
    if (skill) {
      filter.skill = {
        $regex: skill,
        $options: "i",
      };
    }

    const karigars = await User.find(filter)
      .select("-password")
      .sort({ rating: -1 });

    res.json({
      success: true,
      count: karigars.length,
      karigars,
    });
  } catch (error) {
    console.error("Get Karigars Error:", error);

    res.status(500).json({
      success: false,
      message: "Karigars fetch nahi ho paaye",
    });
  }
});

export default router;