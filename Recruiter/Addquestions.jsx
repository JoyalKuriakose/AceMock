import React, { useState } from 'react';
import { db } from '../utils/db';
import { Questions } from '../utils/schema';
import { Button } from '../src/components/ui/button';
import RecruiterHeader from './RecruiterHeader';
import Footer from '../src/components/custom/Footer';

function AddQuestions() {
  const [examDetails, setExamDetails] = useState({
    ExaminationName: '',
    Duration: '',
  });

  const [questions, setQuestions] = useState([
    { question: '', option1: '', option2: '', option3: '', option4: '', crctanswer: '' },
  ]);

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleExamChange = (e) => {
    setExamDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', option1: '', option2: '', option3: '', option4: '', crctanswer: '' },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToInsert = questions.map((q) => ({
        ExaminationName: examDetails.ExaminationName,
        Duration: examDetails.Duration,
        ...q,
      }));

      await db.insert(Questions).values(dataToInsert);

      setMessage({ type: 'success', text: 'Questions added successfully!' });

      setExamDetails({ ExaminationName: '', Duration: '' });
      setQuestions([{ question: '', option1: '', option2: '', option3: '', option4: '', crctanswer: '' }]);
    } catch (error) {
      console.error('Error adding questions:', error);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <>
      <RecruiterHeader />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
        <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg border">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Add Exam Questions</h2>

          {message.text && (
            <div
              className={`mb-4 text-center font-medium ${
                message.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Examination Name</label>
                <input
                  type="text"
                  name="ExaminationName"
                  value={examDetails.ExaminationName}
                  onChange={handleExamChange}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Duration</label>
                <input
                  type="text"
                  name="Duration"
                  value={examDetails.Duration}
                  onChange={handleExamChange}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
              </div>
            </div>

            {questions.map((q, index) => (
              <div key={index} className="p-4 border rounded-xl bg-gray-50 space-y-3 mt-6">
                <h3 className="font-semibold text-blue-500">Question {index + 1}</h3>
                <input
                  type="text"
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Option 1"
                    value={q.option1}
                    onChange={(e) => handleQuestionChange(index, 'option1', e.target.value)}
                    className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Option 2"
                    value={q.option2}
                    onChange={(e) => handleQuestionChange(index, 'option2', e.target.value)}
                    className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Option 3"
                    value={q.option3}
                    onChange={(e) => handleQuestionChange(index, 'option3', e.target.value)}
                    className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Option 4"
                    value={q.option4}
                    onChange={(e) => handleQuestionChange(index, 'option4', e.target.value)}
                    className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={q.crctanswer}
                  onChange={(e) => handleQuestionChange(index, 'crctanswer', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                  required
                />
              </div>
            ))}
            <div className="flex flex-col items-center space-y-4 mt-6">
              <Button
                type="button"
                style={{ backgroundColor: 'blue-600' }}
                onClick={addNewQuestion}
                className=" hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl"
              >
                + Add New Question
              </Button>
              <div></div>
              <Button
                type="submit"
                style={{ backgroundColor: 'blue-600' }}
                className="hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-xl"
              >
                Add Questions
              </Button>
            </div>

          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AddQuestions;
