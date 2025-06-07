const ENV = require("../config/env");
const axios = require("axios");

const queryChatbot = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      `${ENV.AZURE_OPENAI_ENDPOINT}openai/deployments/${ENV.AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${ENV.AZURE_API_VERSION}`,
      {
        messages: [
          {
            role: "system",
            content:
              "You are a legal assistant that helps citizens understand the Mediation Act 2023. Only answer questions related to the act.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.5,
        max_tokens: 800,
      },
      {
        headers: {
          "api-key": ENV.AZURE_OPENAI_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("Azure Error:", err.response?.data || err.message);
    res
      .status(500)
      .json({ error: "Failed to get response from Azure OpenAI." });
  }
};

module.exports = { queryChatbot };
