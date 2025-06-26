import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// In this code, we will provide a conversation history to the LLM,
// which includes both user and model responses. The LLM will use this context to generate a
// response that is relevant to the conversation. This demonstrates how LLMs can maintain context
// and generate coherent responses based on previous interactions.

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Hello there! How can I help you today?" }],
      },
      {
        role: "user",
        parts: [{ text: "My name is Javasc and I love maths." }],
      },
      {
        role: "model",
        parts: [
          {
            text: "That's wonderful to meet you, Javasc! It's great to hear you love maths – it's a fascinating and powerful subject. What kind of maths do you enjoy most, or what's on your mind today regarding mathematics?",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "What's my name and what do I love doing?" }],
      },
      {
        role: "model",
        parts: [
          { text: "Your name is **Javasc** and you love doing **maths**!" },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Thats Correct!!" }],
      },
    ],
  });

  console.log("Response:", response.text);
}

await main();
// This code uses the Google GenAI library to interact with a language model.
// It initializes the AI with an API key, sends a conversation history to the model,
// and receives a response based on the context provided.
