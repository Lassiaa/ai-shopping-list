import { API_KEY } from "./secret";
import axios from "axios";
const apiKey = API_KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";

const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

const roles = {
  dish: "As an AI tool, your primary function is to generate a list of ingredients for a specified dish based on the user's prompt. Understand and interpret the user's request to identify the desired dish. Please provide only the list of ingredients as an array in your response. Example answer: 'Sure! Here are the ingredients for [specified dish]: [list of ingredients].' Avoid including any additional information such as instructions or the entire recipe; only the ingredients are needed.",
};

const requestData = {
  model: "gpt-3.5-turbo-1106",
  messages: [
    {
      role: "user",
      content: " ",
    },
    {
      role: "system",
      content: "",
    },
  ],
  max_tokens: 2200,
};

const writeToLog = (
  model,
  tokenTotal,
  role,
  prompt,
  tokenPrompt,
  response,
  tokenResponse
) => {
  const logEntry = {
    model,
    role,
    tokenTotal,
    fullPrompt: {
      prompt,
      tokenPrompt,
    },
    fullResponse: {
      response,
      tokenResponse,
    },
  };

  let log = [];

  const logFileData = localStorage.getItem("shopping-log.json");

  if (logFileData) {
    log = JSON.parse(logFileData);
  }

  log.push(logEntry);

  localStorage.setItem("shopping-log.json", JSON.stringify(log, null, 2));
};

const exportToJSONFile = () => {
  const logData = localStorage.getItem("shopping-log.json");
  if (logData) {
    const logJSON = JSON.parse(logData);
    const logJSONString = JSON.stringify(logJSON, null, 2);

    const blob = new Blob([logJSONString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "shopping-log.json";
    document.body.appendChild(a);

    a.click();

    URL.revokeObjectURL(url);
  } else {
    console.error("No log data found in localStorage.");
  }
};

let responseFinal = "";

const makeApiRequest = async (prompt, role) => {
  try {
    requestData.messages[1].content = String(role);
    requestData.messages[0].content = String(prompt);
    const response = await axios.post(endpoint, requestData, { headers });
    const responseModel = response.data.model;
    const tokenTotal = response.data.usage.total_tokens;
    const tokenPrompt = response.data.usage.prompt_tokens;
    const tokenResponse = response.data.usage.completion_tokens;
    const responseRole = response.data.choices[0].message.role;
    const responseText = response.data.choices[0].message.content;
    const promptText = requestData.messages[0].content;

    writeToLog(
      responseModel,
      tokenTotal,
      responseRole,
      promptText,
      tokenPrompt,
      responseText,
      tokenResponse
    );

    // console.log("API Role:", role);
    // console.log("API Response:", response);
    return responseText;
  } catch (error) {
    console.error("API error:", error);
    console.error("API error response:", error.response);
  }
};

export { makeApiRequest, exportToJSONFile, responseFinal, roles };
