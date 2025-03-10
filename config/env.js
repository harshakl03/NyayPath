const dotenv = require("dotenv");
dotenv.config();

const ENV = {
  SERV_PORT: process.env.SERV_PORT,
  DB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};

module.exports = ENV;
