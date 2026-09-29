import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ===============================
// REGISTER
// ===============================
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      password,
      role,
      skill,
      experience,
      rate,
    } = req.body;

    // Check required fields
    if (!name || !mobile || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, mobile, password and role are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ mobile });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      mobile,
      email,
      password: hashedPassword,
      role,
      skill: skill || "",
      experience: experience || 0,
      rate: rate || 0,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// ===============================
// LOGIN
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile and password are required",
      });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid mobile number or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid mobile number or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

export default router;