# Ace Mock – AI-Powered Career Preparation & Proctored Exam Platform

Ace Mock is a comprehensive career-building web application integrated with an AI-powered exam portal. It is designed to help individuals prepare effectively for job opportunities while enabling recruiters to conduct secure, AI-proctored online assessments. The platform streamlines the entire career preparation and recruitment lifecycle through role-specific mock interviews, assessments, resume analysis, and monitored examinations.
The system is structured into four primary modules: **Admin, User, Recruiter, and Exam Candidate**, each offering dedicated functionalities to ensure scalability, security, and usability.

## Features

### User Module – Career Development Suite

* **Mock Interview**

  * Users enter job role, job description, and years of experience.
  * AI dynamically generates role-specific interview questions.
  * Responses are recorded via video or audio.
  * Detailed feedback report includes:

    * Interview question
    * User’s response
    * Ideal answer
    * Comparative feedback with improvement suggestions

* **Mock Assessment**

  * Users select domain and difficulty level.
  * AI generates assessments based on selected criteria.
  * Post-assessment feedback provides:

    * Performance evaluation
    * Correct vs submitted answers
    * Personalized improvement suggestions

* **Resume Matcher**

  * Users upload their resume and target job description.
  * AI analyzes and compares both documents.
  * Generates:

    * Resume–job match percentage
    * Highlighted matching skills
    * Suggested improvements to enhance relevance


### Recruiter Module – Exam & Candidate Management

* Create online exams with multiple-choice questions
* Define options and correct answers
* Register exam candidates with login credentials
* Monitor exams through AI-based proctoring


### Exam Portal – AI-Proctored Assessments

* Accessible only to **Recruiters** and **Exam Candidates**
* AI Proctoring Features:

  * Multiple face detection
  * Tab switching restriction
  * Screen activity monitoring
* Ensures secure and controlled examination environment


### Admin Module – System Control

* View all created mock interviews and assessments
* Track creator details, job roles, and creation dates
* Create and manage recruiter accounts
* Remove recruiters once responsibilities are completed


## Tech Stack

### Frontend

* **React.js** – Component-based UI development
* **Vite** – Fast build tool and optimized bundling
* **Tailwind CSS & ShadCN UI** – Responsive and modern UI styling

### Backend & AI Services

* **Google Gemini API** –

  * Interview question generation
  * Assessment creation
  * Feedback and resume analysis
* **Node.js / Backend APIs** – Application logic and integrations
* **PostgreSQL** – Secure data storage
* **Drizzle ORM** – Database interaction and schema management

### Proctoring & Monitoring

* **AI-based Face Detection**
* **Browser Activity Monitoring**
* **Tab Switch Prevention**

### Deployment & Tools

* **Netlify** – Frontend deployment and CI/CD
* **Git & GitHub** – Version control and collaboration
* **VS Code** – Development environment

  
## Folder Structure


src
├── App.jsx                  # Root component
├── main.jsx                 # Application entry point
├── modules
│   ├── user                 # User module (mock interview, assessment, resume matcher)
│   ├── recruiter            # Recruiter exam management
│   ├── admin                # Admin controls and dashboards
│   └── exam                 # Exam candidate portal
├── components               # Reusable UI components
├── utils                    # Helper functions and constants
├── lib                      # Database and ORM configurations
├── auth                     # Authentication and authorization
├── styles                   # Tailwind and global styles
└── pages                    # Application pages and routing



## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/ace-mock.git
cd ace-mock
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```


## Netlify Configuration

Ensure a `_redirects` file exists in the root directory for client-side routing:

```plaintext
/* /index.html 200
```


## Problem Addressed

Job aspirants and recruiters face several challenges:

* Lack of realistic interview practice
* No structured, AI-driven feedback
* Difficulty aligning resumes with job descriptions
* Insecure online examinations
* Manual recruitment assessment processes


## How Ace Mock Solves These Challenges

* **AI-Generated Interviews & Assessments** tailored to job roles and difficulty
* **Automated Feedback Reports** for continuous improvement
* **Resume-Job Matching Analysis** with actionable insights
* **Secure AI-Proctored Exams** ensuring assessment integrity
* **Centralized Admin & Recruiter Control** for efficient recruitment workflows


## Future Enhancements

* Behavioral interview analysis
* Advanced resume keyword optimization
* Multi-language support
* Detailed analytics dashboards for recruiters
* Expanded question banks and coding assessments


## Author

**Joyal Kuriakose**

Project: **Ace Mock – AI-Powered Career & Assessment Platform**


