const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  full_name: { type: String, required: true },
  number: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  language_preference: { type: String, required: true },
  cases_involved: { type: [String], ref: "Case" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = new mongoose.model("User", UserSchema);
