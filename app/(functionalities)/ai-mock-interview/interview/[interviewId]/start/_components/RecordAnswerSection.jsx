"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { toast } from "sonner";
import { feedbackModel } from "@/utils/GeminiAIModel";
import db from "@/utils/db";
import { UserAnswerInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { CrossIcon, DeleteIcon } from "lucide-react";
import { RxCross1 } from "react-icons/rx";

const RecordAnswerSection = ({ activeQuestionIndex, interviewData, interviewId, questionStatusUtility }) => {

  const [userAnswer, setUserAnswer] = useState(""); // Store the complete answer
  const [isAnswerSubmitted,setIsAnswerSubmitted] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const user = useUser();
  const { QuestionStatusMap, setQuestionStatusMap } = questionStatusUtility;


  const getTranscript = () => {
    const transcript = results?.map((result) => result.transcript).join(" ") + (interimResult ? interimResult : " ");
    return transcript;
  }

  const clearTranscript = () => {
    setResults([]);
    setUserAnswer("");
  }

  const handleRecording = () => {
    if(isRecording){
      stopSpeechToText();
    }else{
      startSpeechToText();
    }
  }

  const setQuestionAsDone = () => {
    QuestionStatusMap.set(activeQuestionIndex,true)
    console.log(`Set Question ${activeQuestionIndex+1} as 'Done'`,QuestionStatusMap);
  }

  const getFeedbackFromGemini = async () => {
    try {
      // Construct the prompt
      const prompt = `Question: ${interviewData[activeQuestionIndex]?.questionText || "No question available"}, User Answer: ${userAnswer || "NO ANSWER"}. Depending on the question, give me a rating out of 10 and detailed feedback on how to improve the answer.`;
      console.log("Getting the response from Gemini for question", activeQuestionIndex + 1);
  
      // Generate content from the feedback model
      const response = (await feedbackModel.generateContent(prompt)).response;
      console.log(response);
      
      // Ensure the response is text and parse JSON
      const feedback = JSON.parse(await response.text());
  
      if (feedback) {
        console.log("Feedback received:", feedback);
        return feedback;
      } else {
        console.log("No feedback received...");
        return null;
      }
    } catch (error) {
      console.log("Error getting feedback from Gemini");
      return null; // Return null if there’s an error
    }
  };
  

  const submitAnswerToDB = async (feedback) => {
    try {
      console.log("Inserting Feedback to DB...");
  
      // Insert query
      const insertionQuery = await db.insert(UserAnswerInterview).values({
        mockIdRef: interviewId,
        question: interviewData[activeQuestionIndex]?.questionText || "No question provided",
        correctAns: interviewData[activeQuestionIndex]?.answerText || "No correct answer provided",
        userAns: userAnswer === "" ? "NO ANSWER GIVEN" : userAnswer,
        feedback: feedback?.feedback || "No feedback available",
        rating: feedback?.rating || "No rating provided",
        userEmail: user?.user?.primaryEmailAddress?.emailAddress || "No email available",
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"), // Adjusted to a more universal format
      });
  
      if (insertionQuery) {
        console.log("DB insertion was successful");
        toast.success("User answer was recorded successfully.");
      } else {
        console.log("DB insertion failed");
        toast.error("Failed to record user answer.");
      }
    } catch (error) {
      console.error("Error inserting feedback to DB:", error);
      toast.error("An error occurred while saving the answer.");
    }
  };


  const submitAnswer = async () => {
    if(isAnswerSubmitted){
      toast("You have already submitted your answer...");
    }else{
      try {
        toast("Processing your answer...", { duration: 1500 });
    
        // Get feedback from Gemini AI
        const feedback = await getFeedbackFromGemini();
    
        if (feedback) {
          console.log("Feedback received:", feedback);
    
          // Submit answer to the database
          await submitAnswerToDB(feedback);
    
          toast.success("Your answer and feedback were successfully recorded!");
          setIsAnswerSubmitted(true);
          setQuestionAsDone();
          clearTranscript();
        } else {
          console.log("No feedback received from Gemini");
          toast.error("Could not retrieve feedback. Please try again.");
        }
      } catch (error) {
        console.error("Error during submission:", error);
        toast.error("An error occurred while processing your answer.");
      }
    }
  };

  useEffect(() => {
    const realtimeTranscript = getTranscript();
    setUserAnswer(realtimeTranscript);
    console.log("User answer: ",realtimeTranscript);
  },[results,interimResult]);

  useEffect(() => {
    if(!QuestionStatusMap.get(activeQuestionIndex)){
      setIsAnswerSubmitted(false);
    }else{
      setIsAnswerSubmitted(true);
    }
  },[activeQuestionIndex])




  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold mb-3">Camera</h2>

      <div className="w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg overflow-hidden mb-4">
        <Webcam className="w-full h-full object-cover" audio={false} />
      </div>

      <Button
        className={`font-semibold w-full ${isRecording? "bg-red-500" : ""}`}
        onClick={handleRecording}
        >
        {isRecording ? "Stop Recording" : "Record Answer"}
      </Button>

      {isRecording && <p className="text-sm p-4 text-gray-500">Listening...</p>}

      <div className="mt-4 w-full">
      <div className="flex justify-between align-middle mb-4">
        <h3 className="text-lg font-semibold mb-2">User Answer</h3>
        <Button onClick={() => {clearTranscript()}} className="font-semibold" variant="outline"> {<RxCross1 />}</Button>
      </div>
          <p className="text-gray-800">{userAnswer}</p>
      </div>
      <Button
        className = "font-semibold w-full"
        variant="outline"
        onClick={submitAnswer}
        disabled={isAnswerSubmitted}
        >
        Submit Answer
      </Button>
    </div>
  );
};

export default RecordAnswerSection;
