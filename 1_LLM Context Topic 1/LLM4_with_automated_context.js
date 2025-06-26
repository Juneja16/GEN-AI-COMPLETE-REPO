// Instead of manually setting the context(Memory/History) to the model
// we will use the readlineSync package to take the response  of the model from the terminal
// and use it as the next input to the model.
// that will help us to automate the context setting process.
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import readlineSync from "readline-sync";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

// an array to store the conversation history
// this will help us to keep track of the conversation and use it as context for the model
const history = [];

// this function will take the response from the LLM Model for the query asked by user
// and also fill up the array history with the conversation history BOTH with the query and the response
// this will help us to keep the context of the conversation and use it for the next query
const chatting = async (userInput) => {
  history.push({
    role: "user",
    parts: [{ text: userInput }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: history,
    parameters: {
      maxOutputTokens: 100,
      temperature: 0.5,
      topP: 0.9,
    },
  });
  history.push({
    role: "model",
    parts: [{ text: response.text }],
  });
  console.log(response.text);
};

// main function to take user input and call the chatting function
// it will keep asking for user input and call the chatting function with the input
const main = async () => {
  const userInput = readlineSync.question("Your Query: ");
  await chatting(userInput);
  main();
};

main();
