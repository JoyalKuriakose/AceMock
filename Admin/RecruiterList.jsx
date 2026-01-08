import React, { useEffect, useState } from 'react';
import { db } from '../utils/db';
import { Recruiter } from '../utils/schema';
import { Button } from '../src/components/ui/button';
import { Trash2 } from 'lucide-react';

function RecruiterList() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecruiters = async () => {
    try {
      const result = await db.select().from(Recruiter);
      setRecruiters(result);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch recruiters:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recruiter?')) return;

    try {
      await db.delete(Recruiter).where(Recruiter.id.eq(id));
      setRecruiters((prev) => prev.filter((rec) => rec.id !== id));
    } catch (error) {
      console.error('Failed to delete recruiter:', error);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">Recruiters List</h2>

      {loading ? (
        <p className="text-center">Loading recruiters...</p>
      ) : recruiters.length === 0 ? (
        <p className="text-center text-gray-500">No recruiters found.</p>
      ) : (
        <div className="flex justify-center">
          <div>
            <table className="min-w-full bg-white shadow rounded-xl border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="py-3 px-4">Recruiter Name</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recruiters.map((recruiter) => (
                  <tr key={recruiter.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{recruiter.recruiterNAme}</td>
                    <td className="py-3 px-4">{recruiter.companyName}</td>
                    <td className="py-3 px-4">{recruiter.userName}</td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="destructive"
                        className="flex items-center gap-1 px-3 py-1 text-sm"
                        onClick={() => handleDelete(recruiter.id)}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </td>
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

export default RecruiterList;
