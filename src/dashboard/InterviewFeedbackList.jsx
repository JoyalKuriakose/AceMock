"use client";
import React, { useEffect, useState } from 'react';
import { MockInterview } from '../../utils/schema';
import { db } from "../../utils/db";
import { useUser } from '@clerk/clerk-react';
import { desc, eq } from 'drizzle-orm';
import InterviewItemCard from './interviewItemCard';

function InterviewFeedbacklist() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    user && getInterviewList();
  }, [user]);

  const getInterviewList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      console.log("User email not found");
      return;
    }

    const email = user.primaryEmailAddress.emailAddress;

    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, email))
        .orderBy(desc(MockInterview.id));

      setInterviewList(result);
    } catch (error) {
      console.error("Error fetching interview list:", error);
    }
  };

  return (
    <div className="py-6 min-h-screen">
      <h2 className="text-xl font-semibold text-center text-blue-600 mb-4">
        Previous Mock Interview
      </h2>

      {interviewList.length === 0 ? (
        <p className="text-center text-gray-500">No Feedbacks Available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
          {interviewList.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewFeedbacklist;
