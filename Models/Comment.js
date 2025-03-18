const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  post_id: { type: String, ref: "Post", required: true },
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
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
