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

/**
 * Sends the uploaded PDF files to the server for text extraction.
 * @param {File[]} files - The uploaded files array.
 * @returns {Promise<string>} - A JSON stringified object containing extracted strings from all PDFs.
 */
async function fetchExtractedPDFData(files) {
  if (!files || files.length === 0) return "";

  // Create a FormData object to send multiple PDF files to the server
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("pdfFile", file);
  });

  // POST the files to the /api/extract-pdf endpoint
  const response = await fetch("/api/extract-pdf", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  // If there's an error, log it and return empty string
  if (data.error) {
    console.error(data.error);
    return "";
  }

  // Return the extracted text as a JSON string
  // Assuming the server returns something like { strings: {file1: [...], file2: [...]} }
  return JSON.stringify(data.strings);
}

/**
 * Sends a prompt containing job and resume details to the AI model for question generation.
 * @param {string} jobPosition - The job position provided by the user.
 * @param {string} jobDesc - The job description/tech stack details.
 * @param {string} jobExperience - The years of experience provided by the user.
 * @param {string} filesData - The text extracted from the uploaded PDFs (JSON stringified).
 * @returns {Promise<string>} - The generated content as a text string.
 */
async function sendPromptToAI(jobPosition, jobDesc, jobExperience, filesData) {
  const InputPrompt = `
    Using the details below, please frame 10 questions on the technologies, projects and the requirement of the Job make it like interview question also include puzzles and concepts related to the technologies mentioned in the candidates resume:
    1. Job Position: ${jobPosition}
    2. Job Description: ${jobDesc}
    3. Years of Experience: ${jobExperience}
    4. Resume Data: ${filesData}
  `;

  const result = await model.generateContent(InputPrompt);
  const textResponse = await result.response.text();
  return textResponse;
}

/**
 * AddNewInterview Component
 * This component handles collecting information about a job interview,
 * uploading candidate resumes (now multiple), extracting text from each,
 * and then sending the collected data to an AI model for question generation.
 */
const AddNewInterview = () => {
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);

  // Uploaded files state
  const [files, setFiles] = useState([]);

  // Job details state
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");

  /**
   * Handle form submission.
   * Extracts text from all uploaded PDFs and sends data to the AI model.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Job Position:", jobPosition);
    console.log("Job Description:", jobDesc);
    console.log("Years of Experience:", jobExperience);
    console.log("Uploaded Files:", files);

    // Extract text from all uploaded PDF files
    const filesData = await fetchExtractedPDFData(files);
    console.log("Extracted PDF Data:", filesData);

    try {
      // Generate interview questions based on provided details and resume data
      const responseText = await sendPromptToAI(
        jobPosition,
        jobDesc,
        jobExperience,
        filesData
      );
      console.log("AI Response:", responseText);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      // Close the dialog after processing
      setOpenDialog(false);
    }
  };

  /**
   * Handle file upload event.
   * Sets the local state to the newly uploaded files (multiple).
   */
  const handleFileUpload = async (uploadedFiles) => {
    setFiles(uploadedFiles);
  };

  return (
    <div suppressHydrationWarning={true}>
      {/* Trigger for the dialog */}
      <div
        onClick={() => {
          setOpenDialog(true);
        }}
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md hover:cursor-pointer transition-all"
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      {/* Dialog for adding a new interview */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview?
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit}>
                <h2 className="font-semibold my-4">
                  Add details about your job position/role, Job Description, and years of experience:
                </h2>

                {/* Job Role/Position Input */}
                <div className="mt-7 my-2">
                  <label className="block mb-2">Job Role/Position</label>
                  <Input
                    required
                    placeholder="Ex. Full Stack Developer"
                    onChange={(event) => setJobPosition(event.target.value)}
                    value={jobPosition}
                  />
                </div>

                {/* Job Description Input */}
                <div className="my-3">
                  <label className="block mb-2">
                    Job Description/ Tech Stack (In Short)
                  </label>
                  <Textarea
                    placeholder="Angular, React, Node JS, Machine Learning..."
                    onChange={(event) => setJobDesc(event.target.value)}
                    value={jobDesc}
                  />
                </div>

                {/* Multiple File Upload Section */}
                <div className="my-3">
                  <label className="block mb-2">Drop in your Resume(s)!</label>
                  <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                    {/* Ensure FileUpload supports multiple files */}
                    <FileUpload onChange={handleFileUpload} multiple />
                  </div>
                </div>

                {/* Years of Experience Input */}
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

                {/* Action Buttons */}
                <div className="flex gap-5 justify-end mt-6">
                  <Button
                    type="button"
                    onClick={() => setOpenDialog(false)}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Start Interview</Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
