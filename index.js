const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();

const ENV = require("./config/env");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const mediatorRoutes = require("./routes/mediatorRoutes");
const authRoutes = require("./routes/authRoutes");
const caseRoutes = require("./routes/caseRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.set("strictQuery", false);
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.use("/api/users", userRoutes);
app.use("/api/mediators", mediatorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/case", caseRoutes);

app.listen(ENV.SERV_PORT, () => {
  console.log(`Server is Running Successfully on PORT ${ENV.SERV_PORT}`);
});
