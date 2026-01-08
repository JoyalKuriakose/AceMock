
"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../../utils/db";
import { Assessment } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { FaLightbulb, FaCamera } from "react-icons/fa"; // Importing the bulb and camera icons

function Assessments() {
  const { assessmentId } = useParams();
  const [assessmentData, setAssessmentData] = useState();
  

  // Function to fetch assessment details by assessmentId
  const GetAssessmentDetails = async () => {
    const result = await db
      .select()
      .from(Assessment)
      .where(eq(Assessment.assessmentId, assessmentId));

      setAssessmentData(result[0]);
  };

  useEffect(() => {
    if (assessmentId) {
      GetAssessmentDetails();
    }
  }, [assessmentId]);


  return (
    <div className="my-10 p-5 max-w-4xl mx-auto bg-white rounded-lg shadow-lg hover:border-primary transition-colors duration-200">
      <h2 className="font-bold text-3xl text-center mb-5">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Reduced gap between cards */}
        {/* Left Side Cards */}
        <div className="flex flex-col gap-4"> {/* Reduced gap between left cards */}
          {/* Assessment Details Card */}
          <div className="flex flex-col gap-5 p-5 border rounded-lg shadow-sm bg-gray-100 hover:border-primary transition-colors duration-200">
            <h2 className="text-lg">
              <strong>Assessment Area:</strong>{" "}
              {assessmentData ? assessmentData.assArea : "Loading..."}
            </h2>
            <h2 className="text-lg">
              <strong>Assessment Level:</strong>{" "}
              {assessmentData ? assessmentData.assLevel : "Loading..."}
            </h2>
          </div>

          {/* Information Card */}
          <div className="flex flex-col gap-5 p-5 border rounded-lg shadow-sm bg-light-yellow-100 hover:border-primary transition-colors duration-200">
            <div className="flex items-center">
              <FaLightbulb className="text-3xl text-yellow-500 mr-2" />
              <h3 className="text-xl font-semibold">Information</h3>
            </div>
            <p className="text-gray-700">
              It has a set of questions with options which you can answer, and at the last, you will get the report on the basis of your answers. 
              <br />
              <br />
            
            </p>
          </div>
        </div>
      </div>

      {/* Start Interview Button */}
      <div className="flex justify-end mt-8">
        <Link to={`/dashboard/assessment/${assessmentId}/starts`}>
          <Button className="px-6 py-3">Start Assessment</Button>
        </Link>
      </div>
    </div>
  );
}

export default Assessments;





