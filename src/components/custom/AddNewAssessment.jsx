import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { useState } from "react";
  import { Button } from "../ui/button";
  import { Input } from "../ui/input";
  import { chatSession } from "../../../utils/GeminiAIModel";
  import { db } from "../../../utils/db";
  import { Assessment } from "../../../utils/schema";
  import { v4 as uuidv4 } from "uuid";
  import { useUser } from "@clerk/clerk-react";
  import moment from "moment";
  import { useNavigate } from "react-router-dom";
  
  function AddNewAssessment() {
    const [openDialog, setOpenDialog] = useState(false);
    const [assArea, setassArea] = useState("");
    const [assLevel, setAssLevel] = useState("");
    const [loading, setLoading] = useState(false);
    const [jsonAssessmentResp, setJsonAssessmentResponse] = useState([]);
    const navigate = useNavigate();
    const { user } = useUser();
  
    const LoaderCircle = () => {
      return (
        <div
          style={{
            border: "4px solid #f3f3f3",
            borderRadius: "50%",
            borderTop: "4px solid #3498db",
            width: "24px",
            height: "24px",
            animation: "spin 2s linear infinite",
          }}
        ></div>
      ); 
    };
  
    const onSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      console.log("Assessment Area:", assArea, "Assessment Level:", assLevel);
    
      const InputPrompt = `Assessment Area: ${assArea}, Assessment Level: ${assLevel}. Please generate ${
        import.meta.env.VITE_ASSESSMENT_QUESTION_COUNT
      } Assessment questions with 4 options and correct answer in JSON format.`;
    
      try {
        const result = await chatSession.sendMessage(InputPrompt);
        const rawResponse = result.response
          .text()
          .replace("```json", "")
          .replace("```", "");
    
        const parsedResponse = JSON.parse(rawResponse);
        const questionArray = Array.isArray(parsedResponse) ? parsedResponse : parsedResponse.questions ?? [];
    
        console.log("🧠 Final Questions Array:", questionArray);
    
        const AssessmentJsonResponse = JSON.stringify(questionArray); // ✅ Store only the array
    
        setJsonAssessmentResponse(AssessmentJsonResponse);
    
        if (questionArray.length > 0) {
          const resp = await db
            .insert(Assessment)
            .values({
              assessmentId: uuidv4(),
              jsonAssessmentResp: AssessmentJsonResponse,
              assArea : assArea,
              assLevel: assLevel,
              createdBy: user?.primaryEmailAddress?.emailAddress,
              createdAt: moment().format("DD-MM-yyyy"),
            })
            .returning({ assessmentId: Assessment.assessmentId });
    
          console.log("Inserted ID:", resp);
          if (resp) {
            setOpenDialog(false);
            navigate("/dashboard/assessment/" + resp[0]?.assessmentId);
          }
        } else {
          console.log("❌ No questions found in response.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    
      setLoading(false);
    };
    
    return (
      <div>
        <div
          className="w-96 h-44 p-10 rounded-lg bg-secondary transition-all cursor-pointer relative flex items-center justify-center"
          onClick={() => setOpenDialog(true)}
          style={{
            backgroundImage:
              'url("https://www.oecd.org/adobe/dynamicmedia/deliver/dm-aid--74e3fe30-4984-4808-8ae2-e3c28951a887/student-assessment-1958383675.jpg?quality=80&preferwebp=true")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="border-2 border-transparent rounded-lg hover:border-4 hover:border-primary hover:shadow-lg transition-all absolute inset-0"></div>
          <h2
            className="text-lg font-bold text-center text-white relative z-10"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
          >
            Add New Assessment
          </h2>
        </div>
  
        <Dialog open={openDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Tell Us More About Your Assessment
              </DialogTitle>
              <DialogDescription>
                <form onSubmit={onSubmit}>
                  <div>
                    <h2>Add Details About Your Assessment Area & Assessment Level</h2>
                    <div className="mt-7">
                      <label className="mb-2 block">Assessment Area</label>
                      <Input
                        placeholder="Ex. Aptitude & Technical"
                        required
                        onChange={(event) => setassArea(event.target.value)}
                      />
                    </div>
                    <div className="mt-5">
                      <label className="mb-2 block">Assessment Level</label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={assLevel === "Simple" ? "default" : "outline"}
                          onClick={() => setAssLevel("Simple")}
                        >
                          Simple
                        </Button>
                        <Button
                          type="button"
                          variant={assLevel === "Medium" ? "default" : "outline"}
                          onClick={() => setAssLevel("Medium")}
                        >
                          Medium
                        </Button>
                        <Button
                          type="button"
                          variant={assLevel === "Hard" ? "default" : "outline"}
                          onClick={() => setAssLevel("Hard")}
                        >
                          Hard
                        </Button>
                      </div>
                    </div>
                  </div>
  
                  <div className="flex gap-5 justify-end mt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpenDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading || !assLevel}>
                      {loading ? (
                        <>
                          <LoaderCircle className="animate-spin" /> Starting...
                        </>
                      ) : (
                        "Start Assessment"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  export default AddNewAssessment;
  