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

const RecordAnswerSection = ({ mockInterviewQuestion, activeQuestionIndex, interviewData }) => {
  const [isWebRecording, setIsWebRecording] = useState(false);
  const [userAnswer, setUserAnswer] = useState(""); // Store the complete answer
  const [hasRecorded, setHasRecorded] = useState(false); // Track if the answer has been recorded for this question

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
  const [loading, setLoading] = useState(false);

  // Update userAnswer dynamically while the user speaks
  useEffect(() => {
    const newTranscript = results.map((result) => result.transcript).join(" ") + (interimResult || "");
    setUserAnswer(newTranscript);
  }, [results, interimResult]);

  // Submit user answer or reset when the question changes
  useEffect(() => {
    if (userAnswer.length > 10 && !hasRecorded) {
      updateUserAnswer(); // Submit the current answer
      resetRecordingState();
    } else {
      resetRecordingState(); // Clear everything for the next question
    }
  }, [activeQuestionIndex]); // Triggered on question change


  // Display error if Web Speech API is unavailable
  useEffect(() => {
    if (error) {
      toast("Web Speech API is not available in this browser 🤷‍");
    }
  }, [error]);

  // Start or stop recording in one function
  const toggleRecording = () => {
    if (isWebRecording) {
      stopSpeechToText();
      setIsWebRecording(false);
    } else {
      startSpeechToText();
      setIsWebRecording(true);
    }
  };

  const updateUserAnswer = async () => {
    console.log("Submitting answer:", userAnswer);

    setLoading(true);

    const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.questionText}, User Answer: ${userAnswer || "NO ANSWER"}. Depending on the question, give me a rating out of 10 and a feedback in 5-7 lines on how to improve the answer.`;

    try {
      const result = await feedbackModel.generateContent(feedbackPrompt);
      const feedback = JSON.parse(await result.response.text());
      if (feedback) {
        console.log("Feedback received:", feedback);

        // Insert feedback into the database
        const insertIntoDB = await db.insert(UserAnswerInterview).values({
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.questionText,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answerText,
          userAns: userAnswer == ""?"NO ANSWER GIVEN":userAnswer,
          feedback: feedback?.feedback,
          rating: feedback?.rating,
          userEmail: user?.user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        });

        if (insertIntoDB) {
          toast("User answer recorded successfully...");
        }
      }
    } catch (err) {
      console.error("Error generating feedback:", err);
      toast("An error occurred while saving your answer.");
    }

    setLoading(false);
    setHasRecorded(true); // Mark this question as recorded
  };

  const resetRecordingState = () => {
    setUserAnswer(""); // Clear userAnswer for the next question
    setResults([]); // Clear previous results
    setIsWebRecording(false); // Ensure the recording state is reset
    setHasRecorded(false); // Reset the recording flag for the next question
  };


  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold mb-3">Camera</h2>

      <div className="w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg overflow-hidden mb-4">
        <Webcam className="w-full h-full object-cover" audio={false} />
      </div>

      <Button
        className="font-semibold"
        variant="outline"
        onClick={toggleRecording}
        disabled={loading} // Disable button while loading
      >
        {isWebRecording ? "Stop Recording" : "Record Answer"}
      </Button>

      <div className="mt-4 w-full">
        <h3 className="text-lg font-medium mb-2">User Answer:</h3>
        <p className="text-gray-800">{userAnswer}</p>
      </div>

      {isRecording && <p className="text-sm text-gray-500">Listening...</p>}
    </div>
  );
};

export default RecordAnswerSection;
