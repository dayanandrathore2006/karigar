import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    karigar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skill: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "started",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      default: "",
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    // Rating is empty until the customer rates the completed booking
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    review: {
      type: String,
      default: "",
    },

    ratedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;