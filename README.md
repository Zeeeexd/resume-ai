# ResumeAI — AI Resume Analyzer & Career Assistant

A full-stack AI-powered resume analysis web application built with **React + FastAPI + Google Gemini**.

---

## Features

- Upload PDF or DOCX resumes
- AI-powered analysis (overall score, ATS score, skill match)
- Radar chart and section-by-section scores
- Strengths & weaknesses identification
- Skill gap analysis
- Resume bullet point rewriter
- Downloadable PDF analysis report
- Full analysis history with delete
- JWT authentication
- **Demo mode** — works fully without a Gemini API key

---

## Architecture

```
resume-ai/
├── backend/          FastAPI + SQLite + SQLAlchemy + Gemini
│   └── app/
│       ├── routes/   auth, resume, analysis, user
│       ├── services/ parser, gemini, report, demo_data
│       ├── models/   User, Resume, Analysis
│       ├── schemas/  Pydantic schemas
│       └── utils/    JWT auth helpers
└── frontend/         React + Vite + Tailwind CSS
    └── src/
        ├── pages/    Landing, Login, Register, Dashboard,
        │             Analyze, AnalysisResult, History, Rewrite, Skills
        ├── components/ Navbar, ScoreCard, SkillChip, LoadingState, etc.
        ├── services/ axios API client
        └── hooks/    useAuth context
```

---

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 18, Vite, Tailwind CSS, Recharts, Lucide React |
| Backend   | Python, FastAPI, Pydantic, SQLAlchemy |
| Database  | SQLite |
| AI        | Google Gemini 1.5 Flash |
| Auth      | JWT + bcrypt |
| Reports   | ReportLab |
| Parsing   | PyMuPDF (PDF), python-docx (DOCX) |

---

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Frontend Setup

```bash
cd frontend
npm install
```

---

## Environment Variables

Create `backend/.env`:

```
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_random_secret_key_here
DATABASE_URL=sqlite:///./resume_ai.db
DEMO_MODE=false
```

Leave `GEMINI_API_KEY` empty to enable **Demo Mode** automatically.

---

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **Get API key**
3. Copy the key into your `.env` file

---

## Running the Application

### Start Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Demo Mode

If `GEMINI_API_KEY` is not set, the app automatically enters **Demo Mode**.

- A "Demo Mode" banner appears in the UI
- All uploads and analyses still work
- Pre-built realistic analysis data is returned
- Perfect for demonstrations without an API key

**Demo login credentials** (create via register):
- Email: demo@resumeai.com
- Password: demo1234

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT |
| GET  | `/api/auth/me` | Get current user |
| POST | `/api/resume/upload` | Upload PDF/DOCX |
| POST | `/api/analysis/analyze` | Run AI analysis |
| GET  | `/api/analysis/history` | Get all analyses |
| GET  | `/api/analysis/{id}` | Get single analysis |
| DELETE | `/api/analysis/{id}` | Delete analysis |
| POST | `/api/analysis/rewrite` | Rewrite bullet point |
| POST | `/api/analysis/skills-gap` | Skill gap analysis |
| POST | `/api/analysis/{id}/report` | Download PDF report |
| GET  | `/api/user/profile` | User stats |

---

## Demo Flow (College Presentation)

1. Register → Login
2. Go to Dashboard — shows stats
3. Click **Analyze Resume** → upload `sample_data/sample_resume.txt` (rename to `.pdf` or use a real PDF)
4. Select **AI/ML Engineer**, paste a sample job description
5. Click **Analyze with AI**
6. View: overall score → ATS score → radar chart → matching skills → missing skills → weaknesses → improvement plan
7. Go to **Rewriter** → paste a weak bullet → show AI improvement
8. Go to **Skills** → select AI/ML Engineer → show skill gap
9. Go to **History** → show all past analyses
10. Back to analysis → **Download PDF Report**

---

## Future Improvements

- Resume comparison (before/after)
- LinkedIn profile import
- Cover letter generator
- Interview question preparation
- Multiple resume versions management
- Email notifications
- Team/recruiter view
