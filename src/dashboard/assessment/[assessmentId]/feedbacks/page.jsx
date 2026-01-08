import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../../../../utils/db";
import { userAssessmentAnswer } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../../../../components/ui/button";

function Feedbacks() {
  const { assessmentId } = useParams();
  const [feedbackLists, setFeedbackLists] = useState([]);
  const [overallRatings, setOverallRatings] = useState(0);

  useEffect(() => {
    if (assessmentId) {
      const GetFeedbacks = async () => {
        const result = await db
          .select()
          .from(userAssessmentAnswer)
          .where(eq(userAssessmentAnswer.assessmentIdRef, assessmentId))
          .orderBy(userAssessmentAnswer.id);

        setFeedbackLists(result);

        // Calculate the overall rating
        const totalRating = result.reduce((acc, item) => acc + parseInt(item.rating, 10), 0);
        const avgRating = result.length > 0 ? (totalRating / result.length).toFixed(1) : 0;
        setOverallRatings(avgRating);
      };

      GetFeedbacks();
    }
  }, [assessmentId]);

  return (
    <div className="p-10 space-y-6">
      <h2 className="text-3xl font-bold text-green-600">Congratulations!</h2>
      <h2 className="text-2xl font-semibold">Here is your assessment feedback</h2>
      <h2 className="text-lg text-primary my-3">
        Your overall assessment rating: <strong>{overallRatings}/10</strong>
      </h2>
      <h2 className="text-sm text-gray-600">
        Find below assessment questions with correct answers, your answers, and feedback for improvement.
      </h2>

      {feedbackLists.length > 0 ? (
        feedbackLists.map((item, index) => (
          <Collapsible key={index} className="border rounded-lg shadow-sm">
            <CollapsibleTrigger className="p-4 bg-secondary rounded-t-lg text-left flex justify-between items-center w-full hover:bg-secondary-hover">
              <span className="font-medium text-md">{item.Assquestion}</span>
              <ChevronsUpDown className="h-5 w-5" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 space-y-3">
              <div className="flex flex-col gap-2">
                <h2 className="text-sm text-gray-700 bg-gray-100 p-3 border rounded-md">
                  <strong>Rating:</strong> {item.rating}/10
                </h2>
                <h2 className="text-sm bg-red-50 text-red-800 p-3 border rounded-md">
                  <strong>Your Answer:</strong> {item.AssuserAns}
                </h2>
                <h2 className="text-sm bg-green-50 text-green-800 p-3 border rounded-md">
                  <strong>Correct Answer:</strong> {item.AsscorrectAns}
                </h2>
                <h2 className="text-sm bg-blue-50 text-blue-800 p-3 border rounded-md">
                  <strong>Feedback:</strong> {item.feedback}
                </h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      ) : (
        <p className="text-gray-500">No feedback available.</p>
      )}
      
      <Link to="/dashboard" className="block mt-6">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}

export default Feedbacks;




