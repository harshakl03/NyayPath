const mongoose = require("mongoose");

const ForumSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  created_by: {
    type: String,
    required: true,
    refPath: "created_by_model",
  },
  created_by_model: {
    type: String,
    enum: ["User", "Mediator"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Legal", "General", "Dispute", "Mediation"],
    required: true,
  },
  tags: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Forum", ForumSchema);
