import { AzureChatOpenAI } from '@langchain/openai';

// Initialized LLM
const MyGPT = new AzureChatOpenAI({
    azureOpenAIApiKey: process.env.NEXT_PUBLIC_MYGPT_API_KEY, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIEndpoint: process.env.NEXT_PUBLIC_MYGPT_ENDPOINT, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: process.env.NEXT_PUBLIC_MYGPT_MODEL_DEPLOYMENT, // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
    azureOpenAIApiVersion: process.env.NEXT_PUBLIC_MYGPT_API_VERSION, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
    temperature: 0,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
  });



export {MyGPT};