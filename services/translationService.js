const axios = require("axios");
const ENV = require("../config/env");

const BHASHINI_NMT_URL =
  "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";

class TranslationService {
  async translateText(text, sourceLanguage, targetLanguage) {
    try {
      const response = await axios.post(
        BHASHINI_NMT_URL,
        {
          pipelineTasks: [
            {
              taskType: "translation",
              config: {
                language: {
                  sourceLanguage: sourceLanguage,
                  targetLanguage: targetLanguage,
                },
                serviceId: ENV.BHASHINI_SERVICE_ID,
              },
            },
          ],
          inputData: {
            input: [
              {
                source: text,
              },
            ],
          },
        },
        {
          headers: {
            Authorization: ENV.BHASHINI_AUTHORIZATION,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  }
}

module.exports = new TranslationService();
