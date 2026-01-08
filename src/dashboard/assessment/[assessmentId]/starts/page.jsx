"use client";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../../../../utils/db";
import { Assessment } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import AssessmentQuestions from "./comp/AssessmentQuestions";
import { Button } from "../../../../components/ui/button";

function Starts() {
  const { assessmentId } = useParams();
  const [assessmentData, setAssessmentData] = useState(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [activeAssQuestionIndex, setActiveAssQuestionIndex] = useState(0);

  const mediaStreamRef = useRef(null); // For future webcam/audio use

  const GetAssessmentDetails = async () => {
    try {
      const result = await db
        .select()
        .from(Assessment)
        .where(eq(Assessment.assessmentId, assessmentId));

      if (result.length > 0) {
        const rawJson = result[0]?.jsonAssessmentResp || "[]";
        const parsedQuestions = JSON.parse(rawJson);

        console.log("✅ Parsed Assessment Questions:", parsedQuestions);

        setAssessmentQuestions(parsedQuestions);
        setAssessmentData(result[0]);
      } else {
        console.warn("❌ No assessment found for this ID.");
      }
    } catch (error) {
      console.error("🚨 Error loading assessment:", error);
    }
  };

  useEffect(() => {
    if (assessmentId) {
      GetAssessmentDetails();
    }
  }, [assessmentId]);

  return (
    <div className="relative min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-1">
        {/* Questions View */}
        <AssessmentQuestions
          assessmentQuestion={assessmentQuestions}
          activeAssQuestionIndex={activeAssQuestionIndex}
          setActiveAssQuestionIndex={setActiveAssQuestionIndex}
          assessmentData={assessmentData}
        />
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="fixed bottom-0 right-0 p-7 flex justify-end gap-6 bg-white w-full">
        {activeAssQuestionIndex > 0 && (
          <Button onClick={() => setActiveAssQuestionIndex(prev => prev - 1)}>
            Previous Question
          </Button>
        )}

        {activeAssQuestionIndex < assessmentQuestions.length - 1 && (
          <Button onClick={() => setActiveAssQuestionIndex(prev => prev + 1)}>
            Next Question
          </Button>
        )}

        {activeAssQuestionIndex === assessmentQuestions.length - 1 && (
          <Link to={`/dashboard/assessment/${assessmentData?.assessmentId}/feedbacks`}>
            <Button>End Assessment</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Starts;
