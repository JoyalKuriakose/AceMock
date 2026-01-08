import React, { useEffect, useState } from 'react';
import { db } from '../utils/db';
import { Candidate } from '../utils/schema';
import { eq } from 'drizzle-orm'; // ✅ Import eq from drizzle-orm
import { Button } from '../src/components/ui/button';
import { Trash2 } from 'lucide-react';
import RecruiterHeader from './RecruiterHeader';
import Footer from '../src/components/custom/Footer';

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      const result = await db.select().from(Candidate);
      setCandidates(result);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;

    try {
      await db.delete(Candidate).where(eq(Candidate.id, id)); // ✅ Correct delete
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
      alert('Candidate deleted successfully!');
    } catch (error) {
      console.error('Failed to delete candidate:', error);
      alert('Failed to delete candidate.');
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <>
      <RecruiterHeader />
      <div className="p-6 min-h-screen bg-gray-50 ">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Candidates List</h2>

        {loading ? (
          <p className="text-center">Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <p className="text-center text-gray-500">No candidates found.</p>
        ) : (
          <div className="flex justify-center">
            <div className="overflow-x-auto w-full max-w-4xl flex justify-center">
              <table className="min-w-full bg-white shadow rounded-xl border">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">{candidate.candidateName}</td>
                      <td className="py-3 px-4">{candidate.userName}</td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          variant="destructive"
                          className="flex items-center gap-1 px-3 py-1 text-sm"
                          onClick={() => handleDelete(candidate.id)}
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
      <Footer />
    </>
  );
}

export default Candidates;
