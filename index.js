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
const forumRoutes = require("./routes/forumRoutes");
const offlineBookingRoutes = require("./routes/offlineBookingRoutes");
const chatRoutes = require("./routes/chatRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const meetingScheduler = require("./services/meetingScheduler");
const Hearing = require("./Models/Hearing");

// When server starts, reschedule all future meetings
async function initializeMeetingScheduler() {
  try {
    const futureHearings = await Hearing.find({
      scheduled_date: { $gt: new Date() },
      "online_details.meet_link": { $exists: true },
    });

    for (const hearing of futureHearings) {
      await meetingScheduler.scheduleActivation(
        hearing.case_id,
        hearing.scheduled_date
      );
    }
    console.log("Meeting scheduler initialized");
  } catch (err) {
    console.error("Failed to initialize meeting scheduler:", err);
  }
}

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

// Call after your database connection is established
initializeMeetingScheduler();

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mediators", mediatorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/offline", offlineBookingRoutes);
app.use("/api/service", serviceRoutes);

app.listen(ENV.SERV_PORT, () => {
  console.log(`Server is Running Successfully on PORT ${ENV.SERV_PORT}`);
});
