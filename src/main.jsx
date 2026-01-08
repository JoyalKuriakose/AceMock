import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignInPage from "./auth/sign-in/index.jsx";
import Home from "./home/index.jsx";
import Dashboard from "./dashboard/index.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import Interview from "./dashboard/interview/[interviewId]/page.jsx";
import Start from "./dashboard/interview/[interviewId]/start/page.jsx";
import Starts from "./dashboard/assessment/[assessmentId]/starts/page.jsx";
import Feedback from "./dashboard/interview/[interviewId]/feedback/page.jsx";
import Feedbacks from "./dashboard/assessment/[assessmentId]/feedbacks/page.jsx";
import HowItWorks from './components/HowItWorks';
import ATSScoreChecker from "./components/ResumeSkillMatcher.jsx";
import MatchResults from "./components/MatchResultsPage.jsx";
import About from "./components/About.jsx";
import Privacy from "./components/Privacy.jsx";
import TermsOfService from "./components/TermsOfService.jsx";
import Assessment from "./dashboard/assessment/[assessmentId]/page.jsx";
import AdminHome from "../Admin/home.jsx";
import AddRecruiter from "../Admin/AddRecruiter.jsx";
import RecruiterList from "../Admin/RecruiterList.jsx";
import AssessmentList from "../Admin/AssessmentList.jsx";
import MockinterviewList from "../Admin/MockinterviewList.jsx";
import InterviewFeedbacklist from "./dashboard/InterviewFeedbackList.jsx";
import Signin from "../ExamPort/Signin.jsx";
import Homepage from "../Recruiter/Homepage.jsx";
import Examuserhome from "../ExamUser/Examuserhome.jsx";
import Addquestions from "../Recruiter/Addquestions.jsx";
import AllQuestions from "../Recruiter/AllQuestions.jsx";
import AddCandidate from "../Recruiter/AddCandidate.jsx";
import Candidates from "../Recruiter/Candidates.jsx";
import Answers from "../Recruiter/Answers.jsx";
import ExamQuestions from "../ExamUser/ExamQuestions.jsx";


 

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "/Admin/home",
        element: <AdminHome />,
      },
      {
        path: "/dashboard/interview/:interviewId",
        element: <Interview />,
      },
      {
        path: "/dashboard/interview/:interviewId/start",
        element: <Start />,
      },
      {
        path: "/dashboard/interview/:interviewId/feedback", 
        element: <Feedback />,
      },
      {
        path: "/dashboard/assessment/:assessmentId",
        element: <Assessment />,
      },
      {
        path: "/dashboard/assessment/:assessmentId/starts",
        element: <Starts />,
      },
      {
        path: "/dashboard/assessment/:assessmentId/feedbacks",
        element: <Feedbacks />,
      },
      {
        path: "/how-it-works", 
        element: <HowItWorks />,
      },
      {
        path: "/mockinterviewfeedback", 
        element: <InterviewFeedbacklist />, 
      },
      {
        path: "/addrecruiter", 
        element: <AddRecruiter />, 
      },
      {
        path: "/recruiterlist", 
        element: <RecruiterList />, 
      },
      {
        path: "/listassessment", 
        element: <AssessmentList />, 
      },
      {
        path: "/listmock", 
        element: <MockinterviewList />, 
      },
      {
        path: "/resume",
        element:<ATSScoreChecker />,
      },
      {
        path:"/match-results",
        element:< MatchResults />,
      },
         {
        path:"/about",
        element:< About />,
      },
           {
        path:"/privacy",
        element:< Privacy />,
      },
      {
        path:"/terms",
        element:< TermsOfService />,
      },
    
    ],
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth/sign-in", 
    element: <SignInPage />,
  },
  {
    path: "/ExamPort/Signin", 
    element: <Signin />,
  },
  {
    path:"/ExamUser/Examuserhome",
    element:<Examuserhome />,
  },
  {
    path:"/Recruiter/HomePage",
    element:<Homepage />,
  },
  {
    path:"/ExamUser/Examuserhome",
    element:<Examuserhome />,
  },
  {
    path:"/Addquestions",
    element:<Addquestions />,
  },
  {
    path:"/Allquestions",
    element:<AllQuestions />,
  },
  {
    path:"/Addcandidates",
    element:<AddCandidate />,
  },
  {
    path:"/candidates",
    element:<Candidates />,
  },
  {
    path:"/answers",
    element:<Answers />,
  },
  {
    path:"/ExamUser/ExamQuestions",
    element:<ExamQuestions />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
