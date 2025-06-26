// @google/genai package ko npm ki help se install kiya
// and then is package se GoogleGenAI fxn  ko destructure kiya taki Google Gemini se connect ho sake
// and then GoogleGenAI ka instance(ai) create kiyaa and use apna ICARD dikhaya connect karne ke liye joki
//  hain api key
// and then now we can use this ai instance to call the LLM models of Gemini AI and generate content from it

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

// with the help of ai instance we can call the models and generate content
// in this we will ask a question to the LLM and it will answer it
// the model to use is "gemini-2.5-flash" and contents is the prompt or question we want to ask
// parameters are optional and we can use them to control the output of the model
// this is the first step to understand how LLMs work and how we can use them to generate content

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "London vs Britain Are they different countries?",
    parameters: {
      maxOutputTokens: 100,
      temperature: 0.5,
      topP: 0.9,
    },
  });
  console.log(response.text);
}

await main();
