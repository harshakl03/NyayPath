const Admin = require("../Models/Admin");
const connectDB = require("../config/db");

const admins = [
  {
    _id: "ADMIN1001",
    full_name: "ADMIN1",
  },
];

(async function () {
  connectDB();
  try {
    await Admin.deleteMany();
    console.log("Admin collection flushed!!!");

    await Admin.insertMany(admins);
    console.log("Admin data seeded!!!");
    process.exit();
  } catch (err) {
    console.log("Error flushing or seeding Admin data", err);
    process.exit(1);
  }
})();
