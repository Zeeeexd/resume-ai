from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routes import auth, resume, analysis, user

app = FastAPI(
    title="ResumeAI API",
    description="AI-powered resume analysis backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(analysis.router)
app.include_router(user.router)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/")
def root():
    demo = settings.DEMO_MODE or not settings.GEMINI_API_KEY
    return {
        "status": "ok",
        "app": "ResumeAI",
        "demo_mode": demo,
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
