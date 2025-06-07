const dotenv = require("dotenv");
dotenv.config();

const ENV = {
  SERV_PORT: process.env.SERV_PORT,
  DB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
  AZURE_OPENAI_KEY: process.env.AZURE_OPENAI_KEY,
  AZURE_DEPLOYMENT_NAME: process.env.AZURE_DEPLOYMENT_NAME,
  AZURE_API_VERSION: process.env.AZURE_API_VERSION,
};

module.exports = ENV;
