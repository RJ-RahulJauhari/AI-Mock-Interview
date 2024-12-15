"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();

  return (
    <Card className="w-full min-w-sm mx-auto p-4 shadow-lg hover:scale-105 transition-all flex flex-col justify-between h-full">
      {/* Header Section */}
      <CardHeader>
        <CardTitle>
          <h1 className="text-xl font-bold">{interview?.jobPosition || "N/A"}</h1>
        </CardTitle>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="flex-1">
        <p className="text-gray-600 mb-2 line-clamp-4 overflow-hidden text-ellipsis">
          <strong>Job Description: </strong>
          {interview?.jobDesc || "No description available"}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Experience: </strong>
          {interview?.jobExperience ? `${interview.jobExperience} years` : "Not specified"}
        </p>
        <p className="text-gray-600">
          <strong>Date: </strong>
          {interview?.createdAt || "No date available"}
        </p>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="flex justify-between gap-2 flex-wrap">
        <Button
          className="w-full"
          onClick={() => router.push(`/ai-mock-interview/interview/${interview?.mockId}/feedback`)}
          variant="outline"
          aria-label="Provide Feedback"
          title="Provide Feedback"
        >
          Feedback
        </Button>
        <Button
          className="w-full"
          onClick={() => router.push(`/ai-mock-interview/interview/${interview?.mockId}`)}
          variant="outline"
          aria-label="Start Interview"
          title="Start Interview"
        >
          Start Interview
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterviewItemCard;
