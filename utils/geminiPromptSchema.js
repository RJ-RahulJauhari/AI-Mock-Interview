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


  export const feedbackOutputSchema = {
    description: "Schema for AI-generated feedback and rating for a user's interview answer",
    type: SchemaType.OBJECT,
    properties: {
      rating: {
        type: SchemaType.NUMBER,
        description: "The AI's rating for the user's answer, from 1 to 10",
        nullable: false,
      },
      feedback: {
        type: SchemaType.STRING,
        description: "Detailed feedback on the user's answer, including strengths and areas for improvement",
        nullable: false,
      },
    },
    required: ["rating", "feedback"],
  };
  