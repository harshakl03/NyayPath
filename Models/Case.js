const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema({
  _id: { type: String, required: true, ref: "Booking" },
  case_type: { type: String, required: true },
  language: { type: String, required: true },
  parties: { type: [String], ref: "User", required: true },
  initiated_by: {
    type: String,
    ref: "User",
    required: true,
  },
  location: { type: String },
  mediation_mode: {
    type: String,
    enum: ["Online", "Offline", "Hybrid"],
    required: true,
  },
  assigned_mediator: {
    type: [String],
    ref: "Mediator",
  },
  status: {
    type: String,
    enum: [
      "Filed",
      "Mediator Assigned",
      "Mediator Rejected",
      "In Progress",
      "Closed",
    ],
    default: "Filed",
  },
  result: {
    type: String,
    enum: ["Success", "Failed"],
  },
  documents: [
    {
      url: { type: String, required: true },
      type: { type: String, required: true },
      uploaded_at: { type: Date, default: Date.now },
    },
  ],
  rate: { type: Number, min: 0 },
  priority: { type: String, enum: ["Normal", "Urgent"], default: "Normal" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Case", CaseSchema);
