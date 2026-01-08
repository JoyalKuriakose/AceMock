import { useEffect, useState, useRef } from "react";
import { Button } from "../../../../../components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "../../../../../../utils/GeminiAIModel";
import { db } from "../../../../../../utils/db";
import { userAnswer } from "../../../../../../utils/schema";
import { useUser } from "@clerk/clerk-react";
import moment from "moment";

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, stopStream }) {
  const [userAnswerState, setUserAnswerState] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const { error, interimResult, isRecording, results, startSpeechToText, stopSpeechToText, setResults } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Start webcam
  useEffect(() => {
    const startWebcam = async () => {
      try {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStreamRef.current;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
        toast.error("Unable to access the webcam.");
      }
    };

    startWebcam();

    return () => {
      stopStream(); // Stop webcam when unmounting
    };
  }, [stopStream]);

  // Update the live answer as user speaks
  useEffect(() => {
    const finalizedText = results.map(r => r.transcript).join(" ");
    const combinedText = finalizedText + " " + (interimResult || "");
    setUserAnswerState(combinedText.trim());
  }, [results, interimResult]);

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const updateUserAnswer = async () => {
    if (!userAnswerState.trim()) {
      toast.error("Please record your answer before submitting.");
      return;
    }
    try {
      setLoading(true);

      const feedbackPrompt = `
        Question: ${mockInterviewQuestion[activeQuestionIndex]?.question},
        User Answer: ${userAnswerState}.
        Based on the question and user's answer, please provide a rating and feedback (3-5 lines) in JSON format with fields 'rating' and 'feedback'.
      `;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = result.response.text()
        .replace("```json", "")
        .replace("```", "")
        .trim();

      console.log("AI Response:", mockJsonResp);

      let JsonFeedbackResp;
      try {
        JsonFeedbackResp = JSON.parse(mockJsonResp);
      } catch (e) {
        console.error("Failed to parse feedback:", e);
        toast.error("Invalid feedback received from AI.");
        return;
      }

      const insertResult = await db.insert(userAnswer).values({
        mockIdRef: interviewData?.mockId || "",
        question: mockInterviewQuestion[activeQuestionIndex]?.question || "",
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer || "",
        userAns: userAnswerState,
        feedback: JsonFeedbackResp?.feedback || "No feedback",
        rating: JsonFeedbackResp?.rating || "0",
        userEmail: user?.primaryEmailAddress?.emailAddress || "",
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"), // Correct SQL datetime
      });

      console.log("Database Insert Result:", insertResult);

      toast.success("User Answer Recorded Successfully!");

      // Clear recorded answer
      setUserAnswerState('');
      setResults([]);

    } catch (error) {
      console.error("Error inserting user answer:", error);
      toast.error("Error while saving your answer! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      {/* Webcam feed */}
      <video
        ref={videoRef}
        className="mb-4 rounded-lg shadow-md border-2 border-gray-300"
        width="320"
        height="240"
        autoPlay
        muted
      />

      {/* Record and Submit buttons */}
      <div className="flex space-x-4">
        <Button
          variant="outline"
          className="my-2 w-full max-w-xs flex items-center justify-center gap-2"
          onClick={StartStopRecording}
        >
          {isRecording ? (
            <>
              <StopCircle className="text-red-600" />
              <span className="text-red-600">Stop Recording</span>
            </>
          ) : (
            <>
              <Mic className="text-green-600" />
              <span>Record Answer</span>
            </>
          )}
        </Button>

        <Button
          onClick={updateUserAnswer}
          disabled={loading}
          className="my-2 w-full max-w-xs"
        >
          {loading ? "Saving..." : "Submit Answer"}
        </Button>
      </div>

      {/* Displaying the recorded answer */}
      <div className="w-full max-w-2xl p-4 mt-4 border rounded-lg bg-gray-100">
        <h3 className="text-lg font-semibold mb-2">Your Recorded Answer:</h3>
        <p className="text-gray-700 whitespace-pre-wrap">
          {userAnswerState || "No answer recorded yet..."}
        </p>
      </div>
    </div>
  );
}

export default RecordAnswerSection;
