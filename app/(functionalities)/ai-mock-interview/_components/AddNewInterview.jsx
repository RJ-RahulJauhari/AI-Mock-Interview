"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { model } from "@/utils/GeminiAIModel";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/spinner"; // Import or create a spinner component
import { interviewQuestionGenerativeModel } from "@/utils/GeminiAIModel";
import db from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import { MyGPT } from "@/utils/MyGPTModel";
import { interviewQuestionsPromptSchema_MyGPT } from "@/utils/MyGPTSchema";


// Utility function for creating the AI prompt
const createPrompt = (jobPosition, jobDesc, jobExperience, filesData) => `
  Using the details below, please frame 10 questions on the technologies, projects, and requirements of the job. 
  Make it like an interview question, also include puzzles, aptitude and coding questions and concepts related 
  to the technologies mentioned in the candidate's resume also give a sample high quality answer to the question 
  generated in markdown format also for coding questions takecare for the indents and the formating of the code so that
  it can be placed in markdown format:
  
  1. Job Position: ${jobPosition}
  2. Job Description: ${jobDesc}
  3. Years of Experience: ${jobExperience}
  4. Resume Data: ${filesData}
`;

// Utility function for fetching extracted PDF data
const fetchExtractedPDFData = async (files) => {
  if (!files || files.length === 0) return "";

  const formData = new FormData();
  files.forEach((file) => formData.append("pdfFile", file));

  const response = await fetch("/api/extract-pdf", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.error) {
    console.error(data.error);
    return "";
  }
  return JSON.stringify(data.strings);
};

const sendPromptToAIGem = async (jobPosition, jobDesc, jobExperience, filesData) => {
  const inputPrompt = createPrompt(jobPosition, jobDesc, jobExperience, filesData);
  const result = await interviewQuestionGenerativeModel.generateContent(inputPrompt);
  const jsonResponse = await result.response.text();
  return jsonResponse;
};

const sendPromptToAI = async (jobPosition, jobDesc, jobExperience, filesData) => {
  try {
    const inputPrompt = createPrompt(jobPosition, jobDesc, jobExperience, filesData);
    const MyGPTQuestionsGenerator = MyGPT.withStructuredOutput(interviewQuestionsPromptSchema_MyGPT);
    
    // Await the response directly
    const questions = await MyGPTQuestionsGenerator.invoke(inputPrompt);
    
    if (questions && questions.questions) {
      const res = JSON.stringify(questions.questions)
      console.log("MyGPT Questions: ", res);
      return res; // Return the array of questions
    } else {
      console.log("Unable to Generate Questions --- MyGPT");
      return null;
    }
  } catch (error) {
    console.error("Error while generating questions: ", error);
    return null;
  }
};

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [files, setFiles] = useState([]);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState();
  const user = useUser();
  const router = useRouter();


  const handleFileUpload = (uploadedFiles) => {
    setFiles(uploadedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner
    let sendToDatabaseAndReturnInterviewID = null; // Declare outside the try block
  
    try {
      const filesData = await fetchExtractedPDFData(files);
      const responseText = await sendPromptToAI(jobPosition, jobDesc, jobExperience, filesData);
      console.log("AI Response:", responseText);
      setJsonResponse(responseText);
  
      if (responseText) {
        sendToDatabaseAndReturnInterviewID = await db.insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: responseText,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            jobPosition: jobPosition,
            createdBy: user?.user.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-yyyy"),
          })
          .returning({ mockId: MockInterview.mockId });
  
        console.log("Inserted ID: ", sendToDatabaseAndReturnInterviewID);
      } else {
        console.error("Error updating PostgresSQL...");
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoading(false); // Hide spinner
      setOpenDialog(false);
  
      // Safely access sendToDatabaseAndReturnInterviewID
      if (sendToDatabaseAndReturnInterviewID && sendToDatabaseAndReturnInterviewID[0]?.mockId) {
        await router.push(`/ai-mock-interview/interview/${sendToDatabaseAndReturnInterviewID[0]?.mockId}`);
      } else {
        console.error("Failed to navigate: No valid mock ID returned.");
      }
    }
  };
  

  return (
    <div suppressHydrationWarning={true}>
      <div
        onClick={() => setOpenDialog(true)}
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md hover:cursor-pointer transition-all"
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {loading ? "Please wait while we create your interview..." : "Tell us more about your job interview"}
            </DialogTitle>
            <DialogDescription>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Spinner />
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="font-semibold my-4">
                    Add details about your job position/role, Job Description, and years of experience:
                  </h2>

                  <div className="mt-7 my-2">
                    <label className="block mb-2">Job Role/Position</label>
                    <Input
                      required
                      placeholder="Ex. Full Stack Developer"
                      onChange={(event) => setJobPosition(event.target.value)}
                      value={jobPosition}
                    />
                  </div>

                  <div className="my-3">
                    <label className="block mb-2">Job Description/Tech Stack (In Short)</label>
                    <Textarea
                      placeholder="Angular, React, Node JS, Machine Learning..."
                      onChange={(event) => setJobDesc(event.target.value)}
                      value={jobDesc}
                    />
                  </div>

                  <div className="my-3">
                    <label className="block mb-2">Drop in your Resume(s)!</label>
                    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                      <FileUpload onChange={handleFileUpload} multiple />
                    </div>
                  </div>

                  <div className="my-3">
                    <label className="block mb-2">Years of Experience</label>
                    <Input
                      required
                      type="number"
                      placeholder="5"
                      onChange={(event) => setJobExperience(event.target.value)}
                      value={jobExperience}
                    />
                  </div>

                  <div className="flex gap-5 justify-end mt-6">
                    <Button type="button" onClick={() => setOpenDialog(false)} variant="ghost">
                      Cancel
                    </Button>
                    <Button type="submit">Start Interview</Button>
                  </div>
                </form>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
