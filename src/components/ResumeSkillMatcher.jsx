import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "../../utils/GeminiAIModel";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist"; // Import PDF.js only once
import pdfWorker from "pdfjs-dist/build/pdf.worker?url"; // Ensure worker path is correct

import mammoth from "mammoth"; // Import Mammoth for DOCX parsing

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function ATSScoreChecker() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeContent, setResumeContent] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const navigate = useNavigate();

  const LoaderCircle = () => (
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

  const extractTextFromPDF = async (file) => {
    setFileLoading(true);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
      let extractedText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        extractedText += pageText + "\n";
      }
      setResumeContent(extractedText);
      setFileLoading(false);
    };
    reader.onerror = () => {
      console.error("Error reading PDF file.");
      alert("Error reading the PDF file.");
      setFileLoading(false);
    };
  };

  const extractTextFromDOCX = async (file) => {
    setFileLoading(true);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const result = await mammoth.extractRawText({ arrayBuffer: reader.result });
      setResumeContent(result.value);
      setFileLoading(false);
    };
    reader.onerror = () => {
      console.error("Error reading DOCX file.");
      alert("Error reading the DOCX file.");
      setFileLoading(false);
    };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileType = file.name.split(".").pop().toLowerCase();
    if (fileType === "pdf") {
      extractTextFromPDF(file);
    } else if (fileType === "docx") {
      extractTextFromDOCX(file);
    } else {
      alert("Invalid file format. Please upload a PDF or DOCX file.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Resume Content:", resumeContent);
    console.log("Job Description:", jobDesc);

    const inputPrompt = `
      Resume Content: ${resumeContent},
      Job Description: ${jobDesc}.
      Compare skills and responsibilities and provide a match percentage and suggestions.
    `;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();
      console.log("Response Text:", responseText);

      setOpenDialog(false);
      navigate("/match-results", { state: { matchResults: responseText } });
    } catch (error) {
      console.error("Error during the request:", error);
      alert("An error occurred while checking the match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="w-96 h-44 p-10 rounded-lg bg-secondary transition-all cursor-pointer relative flex items-center justify-center"
        onClick={() => setOpenDialog(true)}
        style={{
          backgroundImage: 'url("https://t3.ftcdn.net/jpg/05/56/62/68/240_F_556626807_UUU8AF9t0myQwwfriHuw76KyWsEGWd55.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="border-2 border-transparent rounded-lg hover:border-4 hover:border-primary hover:shadow-lg transition-all absolute inset-0"></div>
        <h2
          className="text-lg font-bold text-center text-white relative z-10"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
        >
          Check Resume Match
        </h2>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Resume and Job Description Match Checker
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="my-4">
                  <label className="mb-2 block">Upload Resume (PDF/DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf, .docx"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                  />
                </div>

                {fileLoading ? (
                  <div className="flex justify-center my-4">
                    <LoaderCircle />
                  </div>
                ) : (
                  resumeContent && (
                    <div className="my-4">
                      <label className="mb-2 block">Extracted Resume Text</label>
                      <Textarea value={resumeContent} readOnly />
                    </div>
                  )
                )}

                <div className="my-4">
                  <label className="mb-2 block">Job Description</label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    required
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>

                <div className="flex gap-5 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading || fileLoading}>
                    {loading ? <LoaderCircle /> : "Check Match"}
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

export default ATSScoreChecker;
