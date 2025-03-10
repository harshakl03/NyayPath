const mongoose = require("mongoose");
const ENV = require("./env");

const connectDB = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log(
      `MongoDB Connected Successfully on Port ${
        ENV.DB_URL.split("/")[2].split(":")[1]
      } to the DB: ${ENV.DB_URL.split("/")[3]}`
    );
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
  }
};

module.exports = connectDB;
