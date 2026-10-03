from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    target_role = Column(String, nullable=False)
    job_description = Column(Text, nullable=True)
    overall_score = Column(Integer, default=0)
    ats_score = Column(Integer, default=0)
    skill_match = Column(Integer, default=0)
    analysis_json = Column(Text, nullable=False)  # full JSON from Gemini
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    resume = relationship("Resume", back_populates="analyses")
