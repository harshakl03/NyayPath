const schedule = require("node-schedule");
const Hearing = require("../Models/Hearing");

class MeetingScheduler {
  constructor() {
    this.scheduledJobs = new Map();
  }

  async scheduleActivation(case_id, scheduled_date) {
    // Cancel any existing job for this case
    this.cancelJob(case_id);

    // Schedule activation 5 minutes before meeting
    const scheduledTime = new Date(scheduled_date);
    const currentTime = new Date();
    const fiveMinutesBefore = new Date(scheduledTime.getTime() - 5 * 60000);

    // If we're already within 5 minutes of the meeting
    if (currentTime >= fiveMinutesBefore) {
      try {
        // Activate meeting immediately
        await Hearing.findOneAndUpdate(
          { case_id },
          {
            $set: {
              "online_details.is_meeting_active": true,
            },
          }
        );
        // console.log(`Meeting immediately activated for case: ${case_id}`);
        return;
      } catch (err) {
        // console.error(`Failed to activate meeting for case: ${case_id}`, err);
        return;
      }
    }

    // Schedule future activation
    const job = schedule.scheduleJob(fiveMinutesBefore, async () => {
      try {
        await Hearing.findOneAndUpdate(
          { case_id },
          {
            $set: {
              "online_details.is_meeting_active": true,
            },
          }
        );
        // console.log(`Meeting activated for case: ${case_id}`);
      } catch (err) {
        console.error(`Failed to activate meeting for case: ${case_id}`, err);
      }
    });

    this.scheduledJobs.set(case_id, job);
    // console.log(
    //   `Scheduled activation for case ${case_id} at ${fiveMinutesBefore}`
    // );
  }

  cancelJob(case_id) {
    const existingJob = this.scheduledJobs.get(case_id);
    if (existingJob) {
      existingJob.cancel();
      this.scheduledJobs.delete(case_id);
    }
  }
}

module.exports = new MeetingScheduler();
