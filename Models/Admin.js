const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  full_name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = new mongoose.model("Admin", AdminSchema);
