from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime


# ─── Auth ────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ─── Resume ──────────────────────────────────────────────────────────────────

class ResumeOut(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime

    model_config = {"from_attributes": True}


# ─── Analysis ────────────────────────────────────────────────────────────────

class SectionScores(BaseModel):
    contact: int = 0
    summary: int = 0
    education: int = 0
    experience: int = 0
    projects: int = 0
    skills: int = 0
    certifications: int = 0
    achievements: int = 0


class RewriteItem(BaseModel):
    original: str = ""
    improved: str = ""


class AnalysisResult(BaseModel):
    overall_score: int
    ats_score: int
    skill_match: int
    summary: str
    strengths: List[str] = []
    weaknesses: List[str] = []
    skills_present: List[str] = []
    skills_missing: List[str] = []
    recommended_skills: List[str] = []
    matching_keywords: List[str] = []
    missing_keywords: List[str] = []
    section_scores: SectionScores = SectionScores()
    experience_feedback: List[str] = []
    project_feedback: List[str] = []
    formatting_feedback: List[str] = []
    grammar_feedback: List[str] = []
    high_priority_actions: List[str] = []
    medium_priority_actions: List[str] = []
    low_priority_actions: List[str] = []
    rewrites: List[RewriteItem] = []


class AnalyzeRequest(BaseModel):
    resume_id: int
    target_role: str
    job_description: Optional[str] = None


class AnalysisOut(BaseModel):
    id: int
    resume_id: int
    target_role: str
    overall_score: int
    ats_score: int
    skill_match: int
    created_at: datetime
    analysis_json: str
    resume_filename: Optional[str] = None

    model_config = {"from_attributes": True}


class RewriteRequest(BaseModel):
    bullet_point: str
    context: Optional[str] = None  # optional job role / context


class RewriteResponse(BaseModel):
    original: str
    improved: str


class SkillGapRequest(BaseModel):
    target_role: str
    job_description: Optional[str] = None
    resume_id: Optional[int] = None


class SkillGapResponse(BaseModel):
    target_role: str
    current_skills: List[str]
    missing_skills: List[str]
    recommended_skills: List[str]
    skill_gap_percentage: int
    tips: List[str]
