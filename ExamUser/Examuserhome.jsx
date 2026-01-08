import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/db';
import { Questions } from '../utils/schema';
import { Button } from '../src/components/ui/button';
import CameraStream from './CameraStream';

function ExamUserHome() {
  const [examDetails, setExamDetails] = useState({
    examinationName: '',
    duration: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const navigate = useNavigate();

  const fetchExamDetails = async () => {
    try {
      const result = await db.select().from(Questions).limit(1);
      if (result.length > 0) {
        setExamDetails({
          examinationName: result[0].ExaminationName,
          duration: result[0].Duration,
        });
      }
    } catch (error) {
      console.error('Failed to fetch exam details:', error);
    }
  };

  const handleStartExam = () => {
    setShowModal(true);
  };

  const handleAllowCamera = () => {
    if (!understood) return;

    // Save camera permission in session ✅
    sessionStorage.setItem('cameraAllowed', 'true');

    setShowCamera(true);
    setShowModal(false);
    setUnderstood(false);

    setTimeout(() => {
      navigate('/ExamUser/ExamQuestions');
    }, 1000);
  };

  useEffect(() => {
    fetchExamDetails();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6 relative">
      {/* Heading */}
      <div className="flex justify-center items-center mb-16">
        <h1 className="text-5xl font-extrabold text-primary tracking-wider">Ace Mock</h1>
      </div>

      {/* Exam Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {examDetails.examinationName || 'Loading...'}
            </h2>
            <p className="text-lg text-gray-600">
              Duration: {examDetails.duration || 'Loading...'} minutes
            </p>
          </div>
          <div className="text-center">
            <Button
              onClick={handleStartExam}
              className="bg-primary text-white py-2 px-6 rounded-xl shadow-md hover:bg-primary/90"
            >
              Start Exam
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center">
            <h3 className="text-2xl font-bold mb-6 text-primary">Exam Instructions</h3>

            <ul className="text-gray-700 text-left mb-6 list-disc list-inside space-y-3">
              <li>This exam is AI proctored.</li>
              <li>Do not press forbidden keys like <strong>Alt</strong>, <strong>Ctrl</strong>, <strong>Meta</strong>.</li>
              <li>Do not minimize, switch tabs, or leave fullscreen mode during the exam.</li>
              <li>Surrounding voice and activities are monitored.</li>
              <li>Face must always be visible in the camera.</li>
              <li>Multiple warnings may lead to exam disqualification.</li>
            </ul>

            <div className="flex items-center justify-start mb-8">
              <input
                type="checkbox"
                id="understand"
                checked={understood}
                onChange={() => setUnderstood(!understood)}
                className="mr-3 w-5 h-5 rounded border-gray-400 focus:ring-primary"
              />
              <label htmlFor="understand" className="text-gray-800 text-sm">
                I have read and understood the instructions.
              </label>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleAllowCamera}
                disabled={!understood}
                className={`px-8 py-2 rounded-full text-white text-lg ${understood ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Allow
              </Button>
              <Button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-8 py-2 rounded-full text-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Preview (hidden during modal) */}
      {showCamera && (
        <div className="hidden">
          <CameraStream showCamera={true} />
        </div>
      )}
    </div>
  );
}

export default ExamUserHome;
