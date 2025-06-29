import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";
import dotenv from "dotenv";
import fetch from "node-fetch"; // ✅ Import fetch manually
dotenv.config();

const history = [];

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

function sum({ num1, num2 }) {
  return num1 + num2;
}

function isPrime({ number }) {
  const n = number;
  if (n <= 1) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

async function getCryptoPrice({ coin }) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin.toLowerCase()}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data?.[0]?.current_price) {
      return `The current price of ${coin} is $${data[0].current_price}`;
    } else {
      return "Price not found or invalid coin name.";
    }
  } catch (error) {
    console.error("Error fetching price:", error);
    return "Failed to fetch price due to an error.";
  }
}

const sumDeclaration = {
  name: "sum",
  description: "Get the sum of two numbers",
  parameters: {
    type: "OBJECT",
    properties: {
      num1: {
        type: "NUMBER",
        description: "First number for addition, e.g., 10",
      },
      num2: {
        type: "NUMBER",
        description: "Second number for addition, e.g., 20",
      },
    },
    required: ["num1", "num2"],
  },
};

const primeDeclaration = {
  name: "isPrime",
  description: "Check if a number is prime",
  parameters: {
    type: "OBJECT",
    properties: {
      number: {
        type: "NUMBER",
        description: "The number to check, e.g., 17",
      },
    },
    required: ["number"],
  },
};

const cryptoPriceDeclaration = {
  name: "getCryptoPrice",
  description: "Get the current price of a cryptocurrency",
  parameters: {
    type: "OBJECT",
    properties: {
      coin: {
        type: "STRING",
        description: "The cryptocurrency to get the price for, e.g., 'bitcoin'",
      },
    },
    required: ["coin"],
  },
};

const availableTools = {
  sum: sum,
  isPrime: isPrime,
  getCryptoPrice: getCryptoPrice,
};

const AIAgent = async (userInput) => {
  history.push({ role: "user", parts: [{ text: userInput }] });

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
      config: {
        systemInstruction: `You are an AI Agent. You have access to 3 tools:
        1. Sum of two numbers
        2. Prime number check
        3. Get crypto price
        
        Use these tools as needed. For general queries, reply directly.`,
        tools: [
          {
            functionDeclarations: [
              sumDeclaration,
              primeDeclaration,
              cryptoPriceDeclaration,
            ],
          },
        ],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      console.log("Function Call:", response.functionCalls[0]);
      const { name, args } = response.functionCalls[0];

      const funCall = availableTools[name];
      const result = await funCall(args);

      console.log("Tool Result:", result); // ✅ Logs tool output

      const functionResponsePart = {
        name: name,
        response: {
          result: result,
        },
      };

      history.push({
        role: "model",
        parts: [
          {
            functionCall: response.functionCalls[0],
          },
        ],
      });

      history.push({
        role: "user",
        parts: [
          {
            functionResponse: functionResponsePart,
          },
        ],
      });
    } else {
      const text = await response.text(); // ✅ Properly get model's text
      history.push({
        role: "model",
        parts: [{ text }],
      });
      console.log(text);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

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

    await AIAgent(userInput);
  }
};

main();
