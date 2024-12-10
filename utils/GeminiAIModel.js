const {GoogleGenerativeAI} = require("@google/generative-ai");
import { generationConfigInterviewFeedbackJSON, generationConfigInterviewQuestionsJSON } from "./geminiGenerationConfig";
import { feedbackOutputSchema } from "./geminiPromptSchema";


// Gemini Initialization:
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);


// Model Version Constant
const model_version = process.env.NEXT_PUBLIC_GEMINI_VERSION;


// Models
// Default Text Generation Model
const model = genAI.getGenerativeModel({ model: model_version});
  
// Interview Questions Generation Model
const interviewQuestionGenerativeModel = genAI.getGenerativeModel({model:model_version,generationConfig:generationConfigInterviewQuestionsJSON})
const feedbackModel = genAI.getGenerativeModel({model:model_version, generationConfig:generationConfigInterviewFeedbackJSON})
  

export {model,interviewQuestionGenerativeModel,feedbackModel};