const { model } = require("mongoose");
const Hearing = require("../Models/Hearing");
const meetingScheduler = require("../services/meetingScheduler");

const initializeMeetingScheduler = async (req, res) => {
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
    return res.status(200).json({
      message: "Meeting scheduler initialized successfully",
    });
    console.log("Meeting scheduler initialized");
  } catch (err) {
    console.error("Failed to initialize meeting scheduler:", err);
    return res.status(500).json({
      error: "Failed to initialize meeting scheduler",
      details: err.message,
    });
  }
};

module.exports = {
  initializeMeetingScheduler,
};
