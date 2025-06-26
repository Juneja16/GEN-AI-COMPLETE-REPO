import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import readlineSync from "readline-sync";

dotenv.config();

//connection to the Gemini AI model and describing ourselves to the model through API key
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

// we will use the chat feature of the model to have a conversation with it with no prior history
const chat = ai.chats.create({
  model: "gemini-2.5-flash",
  history: [],
});

const main = async () => {
  while (true) {
    const userInput = readlineSync
      .question("Your Query (type 'exit' to quit): ")
      .trim();

    if (userInput.toLowerCase() === "exit") {
      console.log("Exiting...");
      break;
    }

    if (!userInput) {
      console.log("Please enter a valid query.");
      continue;
    }

    try {
      // Takes the Response from the LLM Model for the query asked by user
      // and also fills up the chat history with the conversation history
      // as user and mode roles
      const response = await chat.sendMessage({
        message: userInput,
      });
      console.log(chat.history);

      console.log("Response:", response.text);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};

main();
