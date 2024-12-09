"use client";

import { useState, useEffect } from "react";
import React from "react";
import db from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const InterviewPage = ({ params }) => {
  const interviewId = React.use(params).interviewId;
  const router = useRouter();
  const [interviewData, setInterviewData] = useState();
  const [webCamEnable, setWebCamEnable] = useState(false);

  useEffect(() => {
    console.log(interviewId);
    getInterviewDetails();
  }, []);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));
    if (result) {
      console.log(result);
      setInterviewData(result[0]);
    } else {
      console.log("Unable to fetch record of the interview..");
    }
  };

  return (
    <div className="my-10 flex flex-col items-center">
      <h1 className="text-3xl my-5 text-center font-bold hover:scale-105 transition-all">
        Let's get started with the Interview
      </h1>
      <div className="flex flex-col md:flex-row w-full max-w-6xl">
        {/* Webcam Area */}
        <div className="w-full md:w-1/2 flex flex-col items-center p-5 border-r">
          {webCamEnable ? (
            <>
              <Webcam
                style={{
                  height: 300,
                  width: 400,
                }}
                mirrored={true}
                onUserMedia={() => setWebCamEnable(true)}
                onUserMediaError={() => setWebCamEnable(false)}
              />
              <Button onClick={() => setWebCamEnable(false)} className="mt-3">
                Disable Webcam
              </Button>
            </>
          ) : (
            <>
              <WebcamIcon className="h-72 w-full p-20 bg-secondary rounded-lg border"></WebcamIcon>
              <Button onClick={() => setWebCamEnable(true)} className="mt-3">
                Enable Webcam
              </Button>
            </>
          )}
        </div>

        {/* Details and Directions Area */}
        <div className="w-full md:w-1/2 p-5 flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-semibold mb-2">Directions:</h2>
            <p className="text-gray-600">
              Please make sure your webcam is enabled and working correctly.
              Answer the questions confidently and clearly. Take your time to
              think about the answers before responding.
            </p>
          </div>
          {interviewData && (
            <>
              <Alert className="transition-transform hover:scale-105 hover:shadow-lg">
                <AlertTitle className="font-bold">Job Role</AlertTitle>
                <AlertDescription>{interviewData.jobPosition}</AlertDescription>
              </Alert>
              <Alert className="transition-transform hover:scale-105 hover:shadow-lg">
                <AlertTitle className="font-bold">Job Description</AlertTitle>
                <AlertDescription>{interviewData.jobDesc}</AlertDescription>
              </Alert>
              <Alert className="transition-transform hover:scale-105 hover:shadow-lg">
                <AlertTitle className="font-bold">Job Experience</AlertTitle>
                <AlertDescription>{interviewData.jobExperience}</AlertDescription>
              </Alert>
            </>
          )}
          <Button
            onClick = {() => router.push('/dashboard/interview/'+params.interviewId+'/start')}
            className="w-full mt-5 bg-primary text-white font-semibold hover:bg-primary-dark transition"
          >
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
