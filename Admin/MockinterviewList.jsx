import React, { useEffect, useState } from 'react';
import { db } from '../utils/db';
import { MockInterview } from '../utils/schema';

function MockinterviewList() {
  const [mockInterviews, setMockInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMockInterviews = async () => {
    try {
      const result = await db.select().from(MockInterview);
      setMockInterviews(result);
    } catch (error) {
      console.error('Failed to fetch mock interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockInterviews();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">Mock Interview List</h2>

      {loading ? (
        <p className="text-center">Loading mock interviews...</p>
      ) : mockInterviews.length === 0 ? (
        <p className="text-center text-gray-500">No mock interviews found.</p>
      ) : (
        <div className="flex justify-center">
          <div>
            <table className="min-w-full bg-white shadow rounded-xl border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="py-3 px-4">Job Position</th>
                  <th className="py-3 px-4">Job Description</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Created By</th>
                  <th className="py-3 px-4">Created At</th>
                </tr>
              </thead>
              <tbody>
                {mockInterviews.map((mock) => (
                  <tr key={mock.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{mock.jobPosition}</td>
                    <td className="py-3 px-4">{mock.jobDesc}</td>
                    <td className="py-3 px-4">{mock.jobExperience}</td>
                    <td className="py-3 px-4">{mock.createdBy}</td>
                    <td className="py-3 px-4">{mock.createdAt}</td>
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

export default MockinterviewList;
