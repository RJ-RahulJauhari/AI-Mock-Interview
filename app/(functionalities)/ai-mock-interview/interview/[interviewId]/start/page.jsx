"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner"; // Import toast from sonner
import { useRouter } from "next/navigation";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState();
  const interviewId = React.use(params).interviewId;
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [QuestionStatusMap, setQuestionStatusMap] = useState(new Map());
  const [tabSwitchCount, setTabSwitchCount] = useState(0); // Track number of tab switches
  const [tabSwitchHandled, setTabSwitchHandled] = useState(false); // Prevent multiple toasts
  const [isTabSwitching, setIsTabSwitching] = useState(false); // Flag to track tab switching state
  const router = useRouter();

  useEffect(() => {
    getInterviewDetails();

    // Debounced function to handle tab switch
    const handleTabSwitch = () => {
      if (isTabSwitching) return; // Ignore if already processing a tab switch

      setIsTabSwitching(true); // Set flag to prevent multiple switches at once
      setTabSwitchCount((prevCount) => {
        const newCount = prevCount + 1;

        if (newCount > 3 && !tabSwitchHandled) {
          setTabSwitchHandled(true); // Ensure only one toast
          toast("You have switched tabs too many times. The interview is now ended.", {
            style: {
              background: "#ff5e57",
              color: "#fff",
              padding: "10px",
              borderRadius: "5px",
            },
          });
          handleEndInterview(); // End the interview after 3 tab switches
        } else if (newCount <= 3) {
          toast("Switching tabs is not allowed.", {
            style: {
              background: "#ff5e57",
              color: "#fff",
              padding: "10px",
              borderRadius: "5px",
            },
          });
        }

        return newCount;
      });

      // Reset flag after a short delay to avoid overlapping tab switches
      setTimeout(() => {
        setIsTabSwitching(false);
      }, 1000); // Timeout after 1 second to allow for next switch
    };

    const handleBeforeUnload = (e) => {
      // If the user is about to leave, trigger the tab switch
      if (tabSwitchCount > 3 && !tabSwitchHandled) {
        handleTabSwitch(); // Only invoke tab switch if it's under 3 switches
      }
    };

    // Add event listener for tab switching
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleTabSwitch);

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleTabSwitch);
    };
  }, [tabSwitchCount, tabSwitchHandled, isTabSwitching]);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));
    if (result) {
      console.log("Interview Data: ", result[0]);
      const pres = JSON.parse(result[0].jsonMockResp);
      setInterviewData(pres);
      console.log("Parsed Interview Data: ", pres);
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
    router.push("/ai-mock-interview/interview/" + interviewId + "/feedback");
    // Add any additional logic you want to handle when the interview ends
  };

  return (
    <div className="flex flex-wrap p-4 justify-center align-middle">
      {/* Left Section: Questions */}
      <div className="flex-1 w-full lg:w-1/2 p-4">
        <QuestionsSection
          questionStatusUtility={{ QuestionStatusMap, setQuestionStatusMap }}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
          mockInterviewQuestion={interviewData ? interviewData : ""}
        />
      </div>

      {/* Right Section: Record Answer */}
      <div className="flex-1 w-full lg:w-1/2 p-4">
        <RecordAnswerSection
          questionStatusUtility={{ QuestionStatusMap, setQuestionStatusMap }}
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
          <Link href={"/ai-mock-interview/interview/" + interviewId + "/feedback"}>
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
