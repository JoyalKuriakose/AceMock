import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../src/components/ui/button';
import CameraStream from './CameraStream';
import { db } from '../utils/db';
import { Questions, Candidateanswer } from '../utils/schema';
import { Volume2, Moon, Sun } from 'lucide-react';

function ExamQuestions() {
  const [examQuestions, setExamQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [warningVisible, setWarningVisible] = useState(false);
  const [examOverVisible, setExamOverVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = sessionStorage.getItem('username');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const result = await db.select().from(Questions);
        setExamQuestions(result);

        if (result.length > 0) {
          const durationMinutes = parseInt(result[0].Duration);
          setTimeLeft(durationMinutes * 60);
        }
      } catch (error) {
        console.error('Error fetching exam questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && examQuestions.length > 0) {
      handleExamOver();
    }
  }, [timeLeft, examQuestions.length]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.error('Fullscreen error:', error);
      }
    };
    enterFullscreen();
  }, []);

  useEffect(() => {
    const forbiddenKeys = ['Control', 'Alt', 'Meta'];

    const handleKeyDown = (e) => {
      if (forbiddenKeys.includes(e.key)) {
        e.preventDefault();
        setWarningVisible(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setWarningVisible(true);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setWarningVisible(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleWarningOk = async () => {
    setWarningVisible(false);
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error('Error requesting fullscreen again:', error);
    }
  };

  const handleExamOver = () => {
    setExamOverVisible(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      alert('Please select an option before submitting.');
      return;
    }

    const currentQuestion = examQuestions[activeQuestionIndex];

    try {
      await db.insert(Candidateanswer).values({
        userName: userName,
        question: currentQuestion.question,
        candidateanswer: selectedOption,
        crctanswer: currentQuestion.crctanswer,
      });

      console.log('Answer saved successfully!');
    } catch (error) {
      console.error('Error saving candidate answer:', error);
    }

    if (activeQuestionIndex < examQuestions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setSelectedOption('');
    } else {
      handleExamOver();
    }
  };

  const currentQuestion = examQuestions[activeQuestionIndex];

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const textToSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`min-h-screen flex flex-col p-6 relative transition-all duration-500 ${
        darkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >


      {/* Timer */}
      {timeLeft > 0 && (
        <div className="text-lg font-bold text-red-600 mb-4 flex justify-center">
          Time Left: {formatTime(timeLeft)}
        </div>
      )}

      {/* Warning Modal */}
      {warningVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-red-600">⚠️ Warning!!</h2>
            <p className="mb-6">
              You pressed a forbidden key, switched tab, or exited fullscreen. Please stay focused!
            </p>
            <Button onClick={handleWarningOk}>OK</Button>
          </div>
        </div>
      )}

      {/* Exam Over Modal */}
      {examOverVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-green-600">🎉 Examination Over!</h2>
            <p className="mb-6">
              Your exam has been successfully submitted.
            </p>
          </div>
        </div>
      )}

      {/* Question Card */}
      {!warningVisible && !examOverVisible && currentQuestion ? (
        <div className={`rounded-xl shadow-md p-6 mb-10 transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="relative">
            <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
            
          </div>

          {/* Options */}
          <div className="flex flex-col gap-4">
            {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4]
              .filter(Boolean)
              .map((option, idx) => (
                <div
                  key={idx}
                  className={`border p-3 rounded-md cursor-pointer transition ${
                    selectedOption === option ? 'bg-blue-100 dark:bg-blue-700 border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  <input
                    type="radio"
                    name={`question-${activeQuestionIndex}`}
                    id={`option-${idx}`}
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                    className="mr-2"
                  />
                  <label htmlFor={`option-${idx}`} className="cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
          </div>

          {/* Submit button */}
          <Button onClick={handleSubmit} className="mt-6">
            Submit
          </Button>
        </div>
      ) : (
        !warningVisible && !examOverVisible && <p>Loading questions...</p>
      )}

      {/* Camera Component */}
      <CameraStream showCamera={true} />
    </div>
  );
}

export default ExamQuestions;
