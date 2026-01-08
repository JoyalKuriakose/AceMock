import { useState } from "react";
import { Volume2 } from "lucide-react";
import moment from "moment";
import { db } from "../../../../../../utils/db";
import { userAssessmentAnswer } from "../../../../../../utils/schema";
import { useUser } from "@clerk/clerk-react";
import { chatSession } from "../../../../../../utils/GeminiAIModel";

function AssessmentQuestions({
  assessmentQuestion = [],
  activeAssQuestionIndex,
  setActiveAssQuestionIndex,
  assessmentData,
}) {
  const [selectedOption, setSelectedOption] = useState("");
  const { user } = useUser();
  const question = assessmentQuestion[activeAssQuestionIndex];
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Your browser does not support speech synthesis");
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      alert("Please select an option before submitting.");
      return;
    }
  
    if (!assessmentData?.assessmentId) {
      alert("Missing assessment ID. Cannot submit answer.");
      return;
    }
  
    const currentQuestion = question;
  
    try {

      const feedbackPrompt = `
        Question: ${currentQuestion?.question},
        Correct Answer: ${currentQuestion?.answer},
        User Answer: ${selectedOption}.
        Based on this, give a JSON response with keys 'rating' (1-10) and 'feedback' (3-5 lines).
      `;
  
      const result = await chatSession.sendMessage(feedbackPrompt);
      const rawResponse = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      const feedbackJson = JSON.parse(rawResponse);
  
      
      await db.insert(userAssessmentAnswer).values({
        assessmentIdRef: assessmentData.assessmentId,
        Assquestion: currentQuestion?.question,
        AsscorrectAns: currentQuestion?.answer,
        AssuserAns: selectedOption,
        feedback: feedbackJson?.feedback,
        rating: feedbackJson?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });
  
      setSelectedOption("");
  
      if (activeAssQuestionIndex < assessmentQuestion.length - 1) {
        setActiveAssQuestionIndex((prev) => prev + 1);
      } else {
        // alert("You have completed the assessment.");
      }
    } catch (error) {
      console.error("Error submitting answer with feedback:", error);
      // alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="min-h-200 bg-gray-50 flex items-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6">
        <div className="w-full md:w-1/4 border rounded-xl shadow-lg bg-white p-6 h-fit">
          <h3 className="text-md font-semibold mb-4">Questions</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-2 gap-3">
            {assessmentQuestion.length > 0 ? (
              assessmentQuestion.map((_, index) => (
                <h2
                  key={index}
                  className={`p-4 rounded-full text-xs text-center cursor-pointer ${
                    activeAssQuestionIndex === index ? "bg-primary text-white" : "bg-secondary"
                  }`}
                >
                  {index + 1}
                </h2>
              ))
            ) : (
              <p>No questions available.</p>
            )}
          </div>
        </div>
        <div className="w-full md:w-4000 h-[600px] border rounded-xl shadow-lg bg-white p-6 relative flex flex-col gap-6 overflow-y-auto">
          <div className="relative">
            <h2 className="text-md md:text-xl font-semibold whitespace-pre-line">
              {question?.question || "No question available"}
            </h2>
            <Volume2
              className="absolute top-0 right-0 cursor-pointer text-gray-500 hover:text-primary"
              onClick={() => textToSpeech(question?.question || "")}
            />
          </div>
          <div>
            <h3 className="text-md font-semibold mb-4">Choose your answer:</h3>
            {question?.options?.length > 0 ? (
              question.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 mb-4 border p-3 rounded-md transition cursor-pointer ${
                    selectedOption === option ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  <input
                    type="radio"
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                    name={`question-${activeAssQuestionIndex}`}
                    id={`option-${index}`}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                  />
                  <label htmlFor={`option-${index}`} className="text-gray-800 cursor-pointer">
                    {option}
                  </label>
                </div>
              ))
            ) : (
              <p>No options available.</p>
            )}
          </div>
          <div className="mt-auto">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentQuestions;
