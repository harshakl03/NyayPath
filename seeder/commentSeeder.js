const Comment = require("../Models/Comment");
const connectDB = require("../config/db");

const comments = [
  {
    _id: "COMMENT1001",
    post_id: "POST1001",
    created_by: "USER1004",
    created_by_model: "User",
    content:
      "Yes, pre-litigation mediation is now mandatory for civil disputes before going to court.",
    created_at: new Date(),
  },
  {
    _id: "COMMENT1002",
    post_id: "POST1001",
    created_by: "MED1004",
    created_by_model: "Mediator",
    content: "Some types of cases are exempt from mandatory mediation.",
    created_at: new Date(),
  },
  {
    _id: "COMMENT1003",
    post_id: "POST1002",
    created_by: "USER1005",
    created_by_model: "User",
    content:
      "You need a stable internet connection and a secure video conferencing platform.",
    created_at: new Date(),
  },
  {
    _id: "COMMENT1004",
    post_id: "POST1003",
    created_by: "MED1005",
    created_by_model: "Mediator",
    content:
      "Mediation agreements are not automatically binding but can be enforced through the courts.",
    created_at: new Date(),
  },
];

(async function () {
  connectDB();

  try {
    await Comment.deleteMany();
    console.log("Comment collection flushed!!!");

    await Comment.insertMany(comments);
    console.log("Comment collection seeded!!!");
    process.exit();
  } catch (err) {
    console.log("Error flushing or seeding Comment data", err);
    process.exit(1);
  }
})();
