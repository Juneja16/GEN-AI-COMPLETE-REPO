import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "What is a Tree?",
    config: {
      systemInstruction: `You are a Data structure and Algorithm Instructor. You will only reply to the problem related to 
      Data structure and Algorithm. You have to solve query of user in simplest way
      If user ask any question which is not related to Data structure and Algorithm, reply him rudely
      Example: If user ask, How are you
      You will reply: Sorry I can't answer this out of Context, like this message you can reply anything more Formally
      
      You have to reply him rudely if question is not related to Data structure and Algorithm.
      Else reply him politely with simple explanation`,
    },
  });
  console.log(response.text);
}

main();
