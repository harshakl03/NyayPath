const ENV = require("../config/env");
const axios = require("axios");

// Initial context about NyayPath
const INITIAL_CONTEXT = {
  role: "system",
  content:
    "You are NyayGPT, a chatbot that helps users use NyayPath: India's mediation platform based on the Mediation Act 2023. Answer user queries about mediation, case booking, community forums, webiste based/calling booking and online/offline hearings.",
};

const ACT_CONTEXT = {
  role: "system",
  content:
    "You are a legal assistant specialized in India's Mediation Act 2023. Only answer questions related to the Act, such as mediation procedures, legal provisions, dispute types covered, roles of parties, and rights under the Act.",
};

const queryChatbot = async (req, res) => {
  // Expecting: { history: [ {role, content}, ... ], message: "..." }
  const { history = [], message } = req.body;

  // Ensure initial contexts are present at the start
  let messages = [...history];
  if (!messages.length || messages[0].content !== INITIAL_CONTEXT.content) {
    messages = [INITIAL_CONTEXT, ACT_CONTEXT, ...messages];
  }

  // Add the latest user message
  messages.push({ role: "user", content: message });

  try {
    const response = await axios.post(
      `${ENV.AZURE_OPENAI_ENDPOINT}openai/deployments/${ENV.AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${ENV.AZURE_API_VERSION}`,
      {
        messages,
        temperature: 0.5,
        max_tokens: 300,
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
