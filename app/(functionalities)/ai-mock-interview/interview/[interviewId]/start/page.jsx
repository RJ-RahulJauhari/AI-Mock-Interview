"use client"

import { useEffect, useState } from "react"
import React from "react";
import db from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button"; // Import the Button component
import Link from "next/link";
import { FcPrevious, FcNext } from "react-icons/fc";
import Confetti from "@/components/ui/confetti";
import { ConfettiButton } from "@/components/ui/confetti";


const StartInterview = ({ params }) => {

  const [interviewData, setInterviewData] = useState();
  const interviewId = React.use(params).interviewId;
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [QuestionStatusMap,setQuestionStatusMap] = useState(new Map());
  

  useEffect(() => {
    getInterviewDetails();
  }, []);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));
    if (result) {
      console.log("Interview Data: ",result[0]);
      const pres = JSON.parse(result[0].jsonMockResp);
      setInterviewData(pres);
      console.log("Parsed Interview Data: ",pres);
    } else {
      console.log("Unable to fetch record of the interview..");
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < interviewData.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  const handleEndInterview = () => {
    console.log("Interview Ended");
  };

  return (
    <div className="flex flex-wrap p-4 justify-center align-middle">
      {/* Left Section: Questions */}
      <div className="flex-1 w-full lg:w-1/2 p-4">
        <QuestionsSection
          questionStatusUtility = {{QuestionStatusMap,setQuestionStatusMap}}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex = {setActiveQuestionIndex}
          mockInterviewQuestion={interviewData ? interviewData : ""}
        />
      </div>

      {/* Right Section: Record Answer */}
      <div className="flex-1 w-full lg:w-1/2 p-4">
        <RecordAnswerSection
          questionStatusUtility = {{QuestionStatusMap,setQuestionStatusMap}}
          interviewData={interviewData}
          interviewId={interviewId}
          activeQuestionIndex={activeQuestionIndex}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="w-full flex justify-between mt-4">
        <Button
          className="font-semibold"
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={activeQuestionIndex === 0} // Disable if it's the first question
        >
        <FcPrevious />
          Previous Question
        </Button>

        {activeQuestionIndex === interviewData?.length - 1 ? (
          <Link href={"/ai-mock-interview/interview/"+interviewId+"/feedback"}>
            <ConfettiButton variant={"destructive"}>
            <Button
              className="font-semibold"
              variant="destructive"
              onClick={handleEndInterview}
            >
              End Interview
            </Button>
            </ConfettiButton>
          </Link>
        ) : (
          <Button
            className="font-semibold"
            variant="outline"
            onClick={handleNextQuestion}
            disabled={activeQuestionIndex === interviewData?.length - 1} // Disable if it's the last question
          >
            Next Question
            <FcNext />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
