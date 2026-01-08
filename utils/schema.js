import { varchar } from "drizzle-orm/pg-core"; // Since you're using pg-core, not mysql-core
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition", { length: 255 }).notNull(), // Define length
  jobDesc: varchar("jobDesc", { length: 255 }).notNull(), // Define length
  jobExperience: varchar("jobExperience", { length: 255 }).notNull(), // Define length
  createdBy: varchar("createdBy", { length: 255 }).notNull(), // Define length
  createdAt: varchar("createdAt", { length: 255 }), // Define length
  mockId: varchar("mockId", { length: 255 }).notNull(), // Define length
});

export const userAnswer = pgTable("userAnswer", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockId", { length: 255 }).notNull(),
  question: varchar("question", { length: 255 }).notNull(),
  correctAns: text("correctAns"),
  userAns: text("userAns"),
  feedback: text("feedback"),
  rating: varchar("rating", { length: 255 }),
  userEmail: varchar("userEmail", { length: 255 }),
  createdAt: varchar("createdAt", { length: 255 }),
});

export const Assessment = pgTable("assessment", {
  id: serial("id").primaryKey(),
  jsonAssessmentResp: text("jsonAssessmentResp").notNull(),
  assArea: varchar("assArea", { length: 255 }).notNull(), 
  assLevel: varchar("assLevel", { length: 255 }).notNull(), 
  createdBy: varchar("createdBy", { length: 255 }).notNull(), 
  createdAt: varchar("createdAt", { length: 255 }), 
  assessmentId: varchar("assessmentId", { length: 255 }).notNull(), 
});

export const userAssessmentAnswer = pgTable("userAssessmentAnswer", {
  id: serial("id").primaryKey(),
  assessmentIdRef: varchar("assessmentId", { length: 255 }).notNull(),
  Assquestion: varchar("question", { length: 255 }).notNull(),
  AsscorrectAns: text("correctAns"),
  AssuserAns: text("userAns"),
  rating: varchar("rating", { length: 255 }),
  feedback:varchar("feedback", { length: 255 }),
  userEmail: varchar("userEmail", { length: 255 }),
  createdAt: varchar("createdAt", { length: 255 }),
});

export const Recruiter = pgTable("recruiter", {
  id: serial("id").primaryKey(),
  recruiterName: varchar("recruiterName", { length: 255 }).notNull(), 
  companyName: varchar("companyName", { length: 255 }).notNull(), 
  userName: varchar("userName", { length: 255 }).notNull(), 
  password: varchar("password", { length: 255 }), 
  email: varchar("email", { length: 255 }).notNull(), 
});

export const Candidate = pgTable("candidate", {
  id: serial("id").primaryKey(),
  candidateName: varchar("candidateName", { length: 255 }).notNull(), 
  userName: varchar("userName", { length: 255 }).notNull(), 
  password: varchar("password", { length: 255 }), 
});

export const Questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  ExaminationName: varchar("ExaminationName", { length: 255 }).notNull(), 
  Duration: varchar("duration", { length: 255 }).notNull(), 
  question: varchar("question", { length: 255 }),
  option1: varchar("option1", { length: 255 }),  
  option2: varchar("option2", { length: 255 }), 
  option3: varchar("option3", { length: 255 }), 
  option4: varchar("option4", { length: 255 }), 
  crctanswer: varchar("crctanswer", { length: 255 }), 
});

export const Candidateanswer = pgTable("candidateanswer", {
  id: serial("id").primaryKey(),
  userName: varchar("userName", { length: 255 }).notNull(),
  question: varchar("question", { length: 255 }),
  candidateanswer: varchar("candidateanswer", { length: 255 }),
  crctanswer: varchar("crctanswer", { length: 255 }),
});


// commnads to run on terminal are
// npm run db:push
// npm run db:studio
