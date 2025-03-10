const mongoose = require("mongoose");

const MediatorSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  full_name: { type: String, required: true },
  DOB: { type: Date, required: true },
  gender: { type: String, required: true },
  number: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  languages_spoken: { type: [String], required: true },
  specializations: { type: [String], required: true },
  mediation_type: { type: [String], required: true },
  education_qualification: { type: [String], required: true },
  certification_number: { type: String, required: true, unique: true },
  certified_by: { type: String, required: true },
  mci_registration_number: { type: String, unique: true, sparse: true },
  empanelment_authority: { type: String },
  empanelment_id: { type: Number, unique: true, sparse: true },
  years_of_experience: { type: Number, required: true, min: 0 },
  profile_pic: { type: String },
  cases: { type: [String], ref: "Case" },
  price: { type: Number, min: 0 },
  status: {
    type: String,
    enum: ["Available", "Busy", "On Leave"],
    default: "Available",
  },
  mode: {
    type: String,
    enum: ["Online", "Offline", "Hybrid"],
    required: true,
  },
  level: {
    type: String,
    enum: ["Basic", "Intermediate", "Advanced"],
    required: true,
  },
  verification_status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Mediator", MediatorSchema);
