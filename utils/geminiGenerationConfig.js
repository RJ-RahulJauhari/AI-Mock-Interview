import { interviewQuestionsPromptSchema, feedbackOutputSchema } from "./geminiPromptSchema";

export const defaultTextGenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export const generationConfigInterviewQuestionsJSON = {
    responseMimeType: "application/json",
    responseSchema: interviewQuestionsPromptSchema,
  }


export const generationConfigInterviewFeedbackJSON = {
    responseMimeType: "application/json",
    responseSchema: feedbackOutputSchema,
}