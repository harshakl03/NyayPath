const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  forum_id: { type: String, ref: "Forum", required: true },
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
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
