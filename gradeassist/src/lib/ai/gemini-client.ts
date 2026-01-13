import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[];

let roundRobinIndex = 0;

export const getGeminiClient = () => {
  if (apiKeys.length === 0) {
    throw new Error("No GEMINI_API_KEY_* provided");
  }

  const key = apiKeys[roundRobinIndex % apiKeys.length];
  roundRobinIndex += 1;
  return new GoogleGenerativeAI(key);
};
