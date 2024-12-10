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

const StartInterview = ({ params }) => {

  const [interviewData, setInterviewData] = useState();
  const interviewId = React.use(params).interviewId;
  const [mockResponse, setMockResponse] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    getInterviewDetails();
  }, []);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));
    if (result) {
      console.log(result[0]);
      setInterviewData(result[0]);

      const mres = JSON.parse(result[0].jsonMockResp);
      console.log(mres);
      setMockResponse(mres);
    } else {
      console.log("Unable to fetch record of the interview..");
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < mockResponse.length - 1) {
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
    // Add any necessary cleanup or redirection logic here
  };

  return (
    <div className="flex flex-wrap p-4 justify-center align-middle">
      {/* Left Section: Questions */}
      <div className="flex-1 w-full lg:w-1/2 p-4">
        <QuestionsSection
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex = {setActiveQuestionIndex}
          mockInterviewQuestion={mockResponse ? mockResponse : ""}
        />
      </div>

      {/* Right Section: Record Answer */}
      <div className="flex-1 w-full lg:w-1/2 p-4">
        <RecordAnswerSection
          interviewData={interviewData}
          activeQuestionIndex={activeQuestionIndex}
          mockInterviewQuestion={mockResponse ? mockResponse : ""}
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
          Previous Question
        </Button>

        {activeQuestionIndex === mockResponse?.length - 1 ? (
          <Link href={"/dashboard/interview/"+interviewData?.mockId+"/feedback"}>
            <Button
              className="font-semibold"
              variant="danger"
              onClick={handleEndInterview}
            >
              End Interview
            </Button>
          </Link>
        ) : (
          <Button
            className="font-semibold"
            variant="outline"
            onClick={handleNextQuestion}
            disabled={activeQuestionIndex === mockResponse?.length - 1} // Disable if it's the last question
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
