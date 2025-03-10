const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  case_id: {
    type: String,
    ref: "Case",
    required: true,
  },
  created_by: {
    type: String,
    ref: "User",
    required: true,
  },
  scheduled_date: { type: Date },
  booking_mode: { type: String, enum: ["Offline", "Online"], required: true },
  status: {
    type: String,
    enum: ["Booked", "Cancelled", "In Progress"],
    default: "In Progress",
  },
  booked_at: { type: Date, default: Date.now },
});

module.exports = new mongoose.model("Booking", BookingSchema);
