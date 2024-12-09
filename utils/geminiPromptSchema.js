import { SchemaType } from "@google/generative-ai";

// Interview Questions Schema
export const interviewQuestionsPromptSchema = {
    description: "List of interview questions",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        questionText: {
          type: SchemaType.STRING,
          description: "The text of the interview question",
          nullable: false,
        },
        answerText: {
          type: SchemaType.STRING,
          description: "A high quality answer to the question",
          nullable: false,
        },
        category: {
          type: SchemaType.STRING,
          description: "The category of the question (e.g., technical, behavioral, puzzle)",
          nullable: false,
        },
        difficulty: {
          type: SchemaType.STRING,
          description: "The difficulty level of the question (e.g., easy, medium, hard)",
          nullable: false,
        },
      },
      required: ["questionText", "category", "difficulty"],
    },
  };