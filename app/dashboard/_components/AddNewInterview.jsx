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
import * as pdfjsLib from "pdfjs-dist"; // For extracting text from PDFs
import mammoth from "mammoth"; // For extracting text from Word documents

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [files, setFiles] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Job Position:", jobPosition);
    console.log("Job Description:", jobDesc);
    console.log("Years of Experience:", jobExperience);
    console.log("Uploaded Files:", files);

    console.log(extractedText);

    // Include extracted text in the prompt
    const InputPrompt = `Using the details below, please frame ${10} questions: 
      
      1. Job Position: ${jobPosition},
      2. Job Description: ${jobDesc},
      3. Years of Experience: ${jobExperience},
      4. Resume Data: ${extractedText}
    `;

    // Replace this with your AI model's API call
    const result = await model.generateContent(InputPrompt);
    console.log(result.response.text());
    setOpenDialog(false); // Close dialog after submission
  };

  const handleFileUpload = async (uploadedFiles) => {
    setFiles(uploadedFiles);
    let concatenatedText = "";

    for (const file of uploadedFiles) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (fileExtension === "pdf") {
        const pdfText = await extractTextFromPDF(file);
        concatenatedText += pdfText + "\n";
      } else if (fileExtension === "docx") {
        const wordText = await extractTextFromWord(file);
        concatenatedText += wordText + "\n";
      } else {
        console.log(`Unsupported file type: ${fileExtension}`);
      }
    }

    setExtractedText(concatenatedText);
    console.log("Extracted Text:", concatenatedText);
  };

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      return fullText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return "";
    }
  };

  const extractTextFromWord = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value || ""; // Extracted text
    } catch (error) {
      console.error("Error extracting text from Word file:", error);
      return "";
    }
  };

  return (
    <div suppressHydrationWarning={true}>
      <div
        onClick={() => {
          setOpenDialog(true);
        }}
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md hover:cursor-pointer transition-all"
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>
      <Dialog
        className="overflow-y-auto"
        open={openDialog}
        onOpenChange={setOpenDialog}
      >
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview?
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit}>
                <h2>
                  Add details about your job position/role, Job Description, and
                  years of experience?
                </h2>
                <div className="mt-7 my-2">
                  <label>Job Role/Position</label>
                  <Input
                    required
                    placeholder="Ex. Full Stack Developer"
                    onChange={(event) => setJobPosition(event.target.value)}
                    value={jobPosition}
                  ></Input>
                </div>
                <div className="my-3">
                  <label>Job Description/ Tech Stack (In Short)</label>
                  <Textarea
                    placeholder="Angular, React, Node JS, Machine Learning...."
                    onChange={(event) => setJobDesc(event.target.value)}
                    value={jobDesc}
                  ></Textarea>
                </div>
                <div className="my-3">
                  <label>Drop in your Resume!</label>
                  <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <FileUpload onChange={handleFileUpload} />
                  </div>
                </div>
                <div className="my-3">
                  <label>Years of Experience</label>
                  <Input
                    required
                    type="number"
                    placeholder="5"
                    onChange={(event) => setJobExperience(event.target.value)}
                    value={jobExperience}
                  ></Input>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      setOpenDialog(false);
                    }}
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
