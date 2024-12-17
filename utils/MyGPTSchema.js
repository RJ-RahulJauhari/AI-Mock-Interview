import { z } from "zod";

// Interview Questions Schema
export const interviewQuestionsPromptSchema_MyGPT = z.object({
    questions: z.array(
      z.object({
        questionText: z
          .string()
          .describe("The text of the interview question")
          .nullable(false),
        answerText: z
          .string()
          .describe("A high quality answer to the question")
          .nullable(false),
        category: z
          .string()
          .describe("The category of the question (e.g., technical, behavioral, puzzle)")
          .nullable(false),
        difficulty: z
          .string()
          .describe("The difficulty level of the question (e.g., easy, medium, hard)")
          .nullable(false),
      })
    ),
  });

// Feedback Output Schema
export const feedbackOutputSchema_MyGPT = z.object({
  rating: z
    .number()
    .describe("The AI's rating for the user's answer, from 1 to 10")
    .nullable(false),
  feedback: z
    .string()
    .describe(
      "Detailed feedback on the user's answer, including strengths and areas for improvement"
    )
    .nullable(false),
});