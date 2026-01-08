import React, { useEffect, useState } from 'react';
import RecruiterHeader from './RecruiterHeader';
import Footer from '../src/components/custom/Footer';
import { db } from '../utils/db';
import { Candidateanswer } from '../utils/schema';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../src/components/ui/input'; // Assuming you have an Input component
import { Button } from '../src/components/ui/button'; // Assuming you have a Button component

function Answers() {
  const [answersData, setAnswersData] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [filterScore, setFilterScore] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const result = await db.select().from(Candidateanswer);
        setAnswersData(result);
      } catch (error) {
        console.error('Error fetching candidate answers:', error);
      }
    };

    fetchAnswers();
  }, []);

  // Group answers by username
  const groupedAnswers = answersData.reduce((acc, answer) => {
    if (!acc[answer.userName]) {
      acc[answer.userName] = [];
    }
    acc[answer.userName].push(answer);
    return acc;
  }, {});

  // Calculate score for each user
  const calculateScore = (userAnswers) => {
    let score = 0;
    userAnswers.forEach((ans) => {
      if (ans.candidateanswer?.trim().toLowerCase() === ans.crctanswer?.trim().toLowerCase()) {
        score += 1;
      }
    });
    return score;
  };

  const toggleUser = (userName) => {
    setExpandedUser(expandedUser === userName ? null : userName);
  };

  const handleFilter = () => {
    if (filterScore === '') {
      setFilteredUsers(Object.keys(groupedAnswers));
      return;
    }

    const filtered = Object.keys(groupedAnswers).filter((userName) => {
      const score = calculateScore(groupedAnswers[userName]);
      return score >= parseInt(filterScore);
    });

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    setFilteredUsers(Object.keys(groupedAnswers)); // Initially show all users
  }, [answersData]);

  return (
    <>
      <RecruiterHeader />

      <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-center">Candidate Answers</h1>

        {/* Filter Section */}
        <div className="max-w-2xl mx-auto mb-8 flex gap-4 items-center">
          <Input
            type="number"
            placeholder="Enter minimum score"
            value={filterScore}
            onChange={(e) => setFilterScore(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleFilter}>Filter</Button>
        </div>

        {/* Candidates List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">No candidates found for this score range.</p>
          ) : (
            filteredUsers.map((userName) => {
              const userAnswers = groupedAnswers[userName];
              const score = calculateScore(userAnswers);
              const totalQuestions = userAnswers.length;

              return (
                <div key={userName} className="bg-white p-4 rounded-lg shadow-md">
                  {/* Username Header */}
                  <div
                    onClick={() => toggleUser(userName)}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <h2 className="text-xl font-semibold">{userName}</h2>
                      <p className="text-sm text-gray-500">
                        Score: {score} / {totalQuestions}
                      </p>
                    </div>
                    {expandedUser === userName ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>

                  {/* Answers */}
                  {expandedUser === userName && (
                    <div className="mt-4 space-y-4">
                      {userAnswers.map((answer) => (
                        <div key={answer.id} className="p-4 border rounded-md bg-gray-50">
                          <p><span className="font-semibold">Question:</span> {answer.question}</p>
                          <p><span className="font-semibold">Candidate's Answer:</span> {answer.candidateanswer}</p>
                          <p><span className="font-semibold">Correct Answer:</span> {answer.crctanswer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Answers;
