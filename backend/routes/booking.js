import express from "express";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

const router = express.Router();


// ==========================================
// CREATE BOOKING
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      customerId,
      karigarId,
      skill,
      date,
      time,
      address,
      description,
      amount,
    } = req.body;

    if (
      !customerId ||
      !karigarId ||
      !skill ||
      !date ||
      !time ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Required booking details missing",
      });
    }

    const customer = await User.findById(customerId);
    const karigar = await User.findById(karigarId);

    if (!customer || customer.role !== "customer") {
      return res.status(400).json({
        success: false,
        message: "Invalid customer",
      });
    }

    if (!karigar || karigar.role !== "karigar") {
      return res.status(400).json({
        success: false,
        message: "Invalid karigar",
      });
    }

    const booking = await Booking.create({
      customer: customerId,
      karigar: karigarId,
      skill,
      date,
      time,
      address,
      description: description || "",
      amount: Number(amount) || 0,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create booking",
    });
  }
});


// ==========================================
// PENDING BOOKINGS FOR KARIGAR
// ==========================================
router.get("/karigar/:karigarId", async (req, res) => {
  try {
    const { karigarId } = req.params;

    const karigar = await User.findById(karigarId);

    if (!karigar || karigar.role !== "karigar") {
      return res.status(400).json({
        success: false,
        message: "Invalid karigar",
      });
    }

    const bookings = await Booking.find({
      karigar: karigarId,
      status: "pending",
    })
      .populate("customer", "name mobile email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Karigar Bookings Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch booking requests",
    });
  }
});


// ==========================================
// ACTIVE BOOKINGS FOR KARIGAR
// ==========================================
router.get("/karigar/:karigarId/active", async (req, res) => {
  try {
    const { karigarId } = req.params;

    const karigar = await User.findById(karigarId);

    if (!karigar || karigar.role !== "karigar") {
      return res.status(400).json({
        success: false,
        message: "Invalid karigar",
      });
    }

    const bookings = await Booking.find({
      karigar: karigarId,
      status: {
        $in: ["accepted", "started"],
      },
    })
      .populate("customer", "name mobile email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Active Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch active jobs",
    });
  }
});


// ==========================================
// CUSTOMER BOOKINGS
// ==========================================
router.get("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await User.findById(customerId);

    if (!customer || customer.role !== "customer") {
      return res.status(400).json({
        success: false,
        message: "Invalid customer",
      });
    }

    const bookings = await Booking.find({
      customer: customerId,
    })
      .populate(
        "karigar",
        "name mobile email skill experience rate rating"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Customer Bookings Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch customer bookings",
    });
  }
});


// ==========================================
// ACCEPT BOOKING
// ==========================================
router.put("/:bookingId/accept", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This booking is no longer pending",
      });
    }

    booking.status = "accepted";

    await booking.save();

    res.json({
      success: true,
      message: "Booking accepted successfully",
      booking,
    });
  } catch (error) {
    console.error("Accept Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to accept booking",
    });
  }
});


// ==========================================
// REJECT BOOKING
// ==========================================
router.put("/:bookingId/reject", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This booking is no longer pending",
      });
    }

    booking.status = "rejected";

    await booking.save();

    res.json({
      success: true,
      message: "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    console.error("Reject Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to reject booking",
    });
  }
});


// ==========================================
// START WORK
// ==========================================
router.put("/:bookingId/start", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Booking must be accepted before starting work",
      });
    }

    booking.status = "started";

    await booking.save();

    res.json({
      success: true,
      message: "Work started successfully",
      booking,
    });
  } catch (error) {
    console.error("Start Work Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to start work",
    });
  }
});


// ==========================================
// COMPLETE WORK
// ==========================================
router.put("/:bookingId/complete", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "started") {
      return res.status(400).json({
        success: false,
        message: "Work must be started before completion",
      });
    }

    booking.status = "completed";

    await booking.save();

    res.json({
      success: true,
      message: "Work completed successfully",
      booking,
    });
  } catch (error) {
    console.error("Complete Work Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to complete work",
    });
  }
});


// ==========================================
// PAYMENT
// ==========================================
router.put("/:bookingId/pay", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment is available after work completion",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment has already been completed",
      });
    }

    booking.paymentStatus = "paid";
    booking.paymentMethod = paymentMethod || "Demo Payment";
    booking.paymentDate = new Date();

    await booking.save();

    res.json({
      success: true,
      message: "Payment completed successfully",
      booking,
    });
  } catch (error) {
    console.error("Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to process payment",
    });
  }
});


// ==========================================
// RATE KARIGAR
// ==========================================
router.put("/:bookingId/rate", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, review } = req.body;

    const numericRating = Number(rating);

    if (
      !numericRating ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can rate the karigar after work completion",
      });
    }

    if (booking.rating > 0) {
      return res.status(400).json({
        success: false,
        message: "This booking has already been rated",
      });
    }

    booking.rating = numericRating;
    booking.review = review || "";
    booking.ratedAt = new Date();

    await booking.save();

    // Update karigar average rating
    const ratedBookings = await Booking.find({
      karigar: booking.karigar,
      rating: { $gt: 0 },
    });

    const totalRating = ratedBookings.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const averageRating =
      ratedBookings.length > 0
        ? totalRating / ratedBookings.length
        : 0;

    await User.findByIdAndUpdate(booking.karigar, {
      rating: Number(averageRating.toFixed(1)),
    });

    res.json({
      success: true,
      message: "Thank you for your rating",
      rating: numericRating,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.error("Rating Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to submit rating",
    });
  }
});


export default router;