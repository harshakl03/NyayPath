const Forum = require("../Models/Forum");
const connectDB = require("../config/db");

const forums = [
  {
    _id: "FORUM1001",
    title: "Understanding Mediation Laws in India",
    description: "Discuss the Mediation Act, 2023, and its implications.",
    created_by: "USER1001",
    created_by_model: "User",
    category: "Legal",
    tags: ["mediation", "law", "dispute resolution"],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: "FORUM1002",
    title: "Best Practices for Online Mediation",
    description: "Tips for effective online mediation.",
    created_by: "MED1001",
    created_by_model: "Mediator",
    category: "General",
    tags: ["online mediation", "virtual hearings"],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: "FORUM1003",
    title: "Handling Business Disputes",
    description: "How to resolve corporate disputes through mediation.",
    created_by: "USER1002",
    created_by_model: "User",
    category: "Dispute",
    tags: ["business", "corporate mediation"],
    created_at: new Date(),
    updated_at: new Date(),
  },
];

(async function () {
  connectDB();

  try {
    await Forum.deleteMany();
    console.log("Forum collection flushed!!!");

    await Forum.insertMany(forums);
    console.log("Forum collection seeded!!!");
    process.exit();
  } catch (err) {
    console.log("Error flushing or seeding Forum data", err);
    process.exit(1);
  }
})();
