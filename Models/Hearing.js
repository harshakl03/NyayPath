const mongoose = require("mongoose");

const HearingSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  case_id: { type: String, ref: "Case", required: true },
  booking_id: { type: String, ref: "Booking", required: true },
  mediator_id: { type: String, ref: "Mediator", required: true },
  online_details: {
    meet_link: { type: String },
    last_meet: { type: Date, default: Date.now },
  },
  offline_details: {
    meeting_address: { type: String },
  },
  recording: [
    {
      file_path: { type: String },
      timestamp: { type: Date },
    },
  ],
  status: {
    type: String,
    enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
  },
  scheduled_date: { type: Date },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hearing", HearingSchema);
