const { model } = require("mongoose");
const Hearing = require("../Models/Hearing");
const meetingScheduler = require("../services/meetingScheduler");
const TranslationService = require("../services/translationService");
const cache = require("memory-cache");

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const translateContent = async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    // Check cache first
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    const cachedResult = cache.get(cacheKey);

    if (cachedResult) {
      return res.json(cachedResult);
    }

    const translation = await TranslationService.translateText(
      text,
      sourceLanguage,
      targetLanguage
    );

    // Cache the result
    cache.put(cacheKey, translation, CACHE_DURATION);

    res.json(translation);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Translation failed", details: error.message });
  }
};

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
    // console.log("Meeting scheduler initialized");
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
  translateContent,
};
