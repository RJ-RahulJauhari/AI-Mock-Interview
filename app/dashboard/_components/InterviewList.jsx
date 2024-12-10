"use client";

import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import db from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";

const InterviewList = () => {
  const { user } = useUser(); // Destructure `user` for cleaner code
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const GetInterviewList = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));
        
      if (result) {
        setInterviewList(result);
      }
    } catch (error) {
      console.error("Error fetching interview list:", error);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  return (
    <div className="w-full">
      {loading ? (
        <p className="text-center text-gray-500">Loading interviews...</p>
      ) : interviewList.length === 0 ? (
        <p className="text-center text-gray-500">No interviews found.</p>
      ) : (
        <div className="flex flex-row flex-wrap gap-2">
          {interviewList.map((interview) => (
            <InterviewItemCard key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;
