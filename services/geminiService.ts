// This file is a placeholder for future AI integration using Gemini API.
// Potential uses:
// 1. Daily Devotional generation based on mood.
// 2. Bible Study Q&A chatbot.
// 3. Summarizing sermon transcripts.

import { GoogleGenAI } from "@google/genai";

// Ensure API Key is available before initialization in a real environment
const apiKey = process.env.API_KEY || '';

// Instance creation wrapped in a function to avoid init errors if env is missing during pure UI demo
export const getGeminiClient = () => {
    if (!apiKey) {
        console.warn("Gemini API Key missing");
        return null;
    }
    return new GoogleGenAI({ apiKey });
}

export const generateDailyVerse = async () => {
    const ai = getGeminiClient();
    if (!ai) return null;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate a short, uplifting bible verse and a 1-sentence reflection for today.',
        });
        return response.text;
    } catch (error) {
        console.error("Failed to generate verse", error);
        return null;
    }
}