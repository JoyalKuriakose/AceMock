import React, { useEffect, useState } from 'react';
import { db } from '../utils/db';
import { Assessment } from '../utils/schema';
import { Button } from '../src/components/ui/button';
import Feedbacks from '../src/dashboard/assessment/[assessmentId]/feedbacks/page';

function AssessmentList() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssessments = async () => {
    try {
      const result = await db.select().from(Assessment);
      setAssessments(result);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">Assessment List</h2>

      {loading ? (
        <p className="text-center">Loading assessments...</p>
      ) : assessments.length === 0 ? (
        <p className="text-center text-gray-500">No assessments found.</p>
      ) : (
        <div className="flex justify-center">
          <div>
            <table className="min-w-full bg-white shadow rounded-xl border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="py-3 px-4">Assessment Area</th>
                  <th className="py-3 px-4">Assessment Level</th>
                  <th className="py-3 px-4">Created By</th>
                  <th className="py-3 px-4">Created At</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((assessment) => (
                  <tr key={assessment.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{assessment.assArea}</td>
                    <td className="py-3 px-4">{assessment.assLevel}</td>
                    <td className="py-3 px-4">{assessment.createdBy}</td>
                    <td className="py-3 px-4">{assessment.createdAt}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssessmentList;
