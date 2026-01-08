import React, { useEffect, useState } from 'react';
import RecruiterHeader from './RecruiterHeader';
import Footer from '../src/components/custom/Footer';
import { db } from '../utils/db';
import { Questions } from '../utils/schema';
import { eq } from 'drizzle-orm';
import { Button } from '../src/components/ui/button';
import { Trash2, Pencil } from 'lucide-react';

function AllQuestions() {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const result = await db.select().from(Questions);
      setQuestions(result);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await db.delete(Questions).where(eq(Questions.id, id));
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleEdit = (question) => {
    setEditingId(question.id);
    setEditedData({ ...question });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await db
        .update(Questions)
        .set({
          question: editedData.question,
          option1: editedData.option1,
          option2: editedData.option2,
          option3: editedData.option3,
          option4: editedData.option4,
          crctanswer: editedData.crctanswer,
        })
        .where(eq(Questions.id, editingId));

      setQuestions((prev) =>
        prev.map((q) => (q.id === editingId ? { ...q, ...editedData } : q))
      );

      setEditingId(null);
      setEditedData({});
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const examName = questions[0]?.ExaminationName || 'Exam Name';
  const duration = questions[0]?.Duration || 'Duration';

  return (
    <>
      <RecruiterHeader />
      <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-primary mb-4">All Questions</h2>

        {!loading && questions.length > 0 && (
          <div className="mb-6 text-center">
            <p className="text-2xl font-semibold">
              Examination Name: <span className="font-normal">{examName}</span>
            </p>
            <p className="text-2xl font-semibold">
              Duration: <span className="font-normal">{duration}</span>
            </p>
          </div>
        )}

        {loading ? (
          <p className="text-center text-lg">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No questions found.</p>
        ) : (
          <div className="w-full flex justify-center overflow-x-auto">
            <table className="w-[95%] bg-white shadow-xl rounded-2xl border text-lg text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4">Question</th>
                  <th className="px-6 py-4">Options</th>
                  <th className="px-6 py-4">Correct Answer</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {editingId === q.id ? (
                        <input
                          name="question"
                          value={editedData.question}
                          onChange={handleChange}
                          className="border rounded p-2 w-full"
                        />
                      ) : (
                        q.question
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editingId === q.id ? (
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            name="option1"
                            value={editedData.option1}
                            onChange={handleChange}
                            className="border rounded p-2"
                          />
                          <input
                            name="option2"
                            value={editedData.option2}
                            onChange={handleChange}
                            className="border rounded p-2"
                          />
                          <input
                            name="option3"
                            value={editedData.option3}
                            onChange={handleChange}
                            className="border rounded p-2"
                          />
                          <input
                            name="option4"
                            value={editedData.option4}
                            onChange={handleChange}
                            className="border rounded p-2"
                          />
                        </div>
                      ) : (
                        <ul className="list-disc pl-5 text-left">
                          <li>{q.option1}</li>
                          <li>{q.option2}</li>
                          <li>{q.option3}</li>
                          <li>{q.option4}</li>
                        </ul>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editingId === q.id ? (
                        <input
                          name="crctanswer"
                          value={editedData.crctanswer}
                          onChange={handleChange}
                          className="border rounded p-2 w-full"
                        />
                      ) : (
                        q.crctanswer
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-4 justify-center">
                        {editingId === q.id ? (
                          <Button
                            onClick={handleUpdate}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleEdit(q)}
                            className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded"
                          >
                            <Pencil size={18} />
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          className="px-4 py-2"
                          onClick={() => handleDelete(q.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default AllQuestions;
