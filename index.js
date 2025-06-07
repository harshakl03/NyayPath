const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

const ENV = require("./config/env");
const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const mediatorRoutes = require("./routes/mediatorRoutes");
const authRoutes = require("./routes/authRoutes");
const caseRoutes = require("./routes/caseRoutes");
const forumRoutes = require("./routes/forumRoutes");
const offlineBookingRoutes = require("./routes/offlineBookingRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Credentials",
    ],
    credentials: true,
  })
);

mongoose.set("strictQuery", false);
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mediators", mediatorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/case", caseRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/offline", offlineBookingRoutes);

app.listen(ENV.SERV_PORT, () => {
  console.log(`Server is Running Successfully on PORT ${ENV.SERV_PORT}`);
});
