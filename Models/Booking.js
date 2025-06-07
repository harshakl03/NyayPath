const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  case_id: {
    type: String,
    ref: "Case",
    unique: true,
    sparse: true,
  },
  created_by: {
    type: String,
    ref: "User",
    unique: true,
    sparse: true,
  },
  phone_number: {
    type: [String],
  },
  language: {
    type: String,
  },
  case_type: { type: String },
  booking_mode: { type: String, enum: ["Offline", "Online"], required: true },
  status: {
    type: String,
    enum: ["Booked", "Cancelled", "In Progress"],
    default: "In Progress",
  },
  booked_at: { type: Date, default: Date.now },
});

module.exports = new mongoose.model("Booking", BookingSchema);
