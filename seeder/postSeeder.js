const Post = require("../Models/Post");
const connectDB = require("../config/db");

const posts = [
  {
    _id: "POST1001",
    forum_id: "FORUM1001",
    created_by: "MED1002",
    created_by_model: "Mediator",
    content:
      "Can anyone explain how mandatory pre-litigation mediation works under the Mediation Act?",
    upvotes: 5,
    downvotes: 0,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: "POST1002",
    forum_id: "FORUM1002",
    created_by: "USER1003",
    created_by_model: "User",
    content:
      "What are the key technical requirements for online mediation sessions?",
    upvotes: 8,
    downvotes: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: "POST1003",
    forum_id: "FORUM1003",
    created_by: "MED1003",
    created_by_model: "Mediator",
    content: "Is mediation legally binding for business contract disputes?",
    upvotes: 3,
    downvotes: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

(async function () {
  connectDB();

  try {
    await Post.deleteMany();
    console.log("Post collection flushed!!!");

    await Post.insertMany(posts);
    console.log("Post collection seeded!!!");
    process.exit();
  } catch (err) {
    console.log("Error flushing or seeding Post data", err);
    process.exit(1);
  }
})();
