"use client"

import { useEffect, useState } from "react"
import React from "react";
import db from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";

const StartInterview = ({params}) => {

    const [interviewData, setInterviewData] = useState();
    const interviewId = React.use(params).interviewId;
    const [mockResponse, setMockResponse] = useState();


    useEffect(() => {
        getInterviewDetails();
    },[])

    const getInterviewDetails = async () => {
        const result = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, interviewId));
        if (result) {
          console.log(result[0]);
          setInterviewData(result[0]);

          const mres = JSON.parse(result[0].jsonMockResp)
          console.log(mres);
          setMockResponse(mres);
        } else {
          console.log("Unable to fetch record of the interview..");
        }
      };

  return (
    <div className="flex flex-wrap p-4 justify-center align-middle">
  {/* Left Section: Questions */}
  <div className="flex-1 w-full lg:w-1/2 p-4">
    <QuestionsSection mockInterviewQuestion={mockResponse ? mockResponse : ""}></QuestionsSection>
  </div>

  {/* Right Section: Record Answer */}
  <div className="flex-1 w-full lg:w-1/2 p-4">
    <RecordAnswerSection></RecordAnswerSection>
  </div>
</div>

  )
}

export default StartInterview