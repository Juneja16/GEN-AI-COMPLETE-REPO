import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

// in this code we will ask a question to the LLM that is related to personal identity
// and it proves that without being trained on personal data, it cant answer the question accurately
// hence either it is trained properly on the required data or we have to provide it with the context
// to answer the question accurately
async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Who am I?",
    parameters: {
      maxOutputTokens: 100,
      temperature: 0.5,
      topP: 0.9,
    },
  });
  console.log(response.text);
}

await main();
