import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.schemas.schemas import (
    AnalyzeRequest, AnalysisOut, RewriteRequest, RewriteResponse,
    SkillGapRequest, SkillGapResponse,
)
from app.utils.auth import get_current_user
from app.services import gemini_service
from app.services.report_service import generate_report

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.post("/analyze", response_model=AnalysisOut, status_code=status.HTTP_201_CREATED)
def analyze(
    payload: AnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = db.query(Resume).filter(
        Resume.id == payload.resume_id,
        Resume.user_id == current_user.id,
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    result = gemini_service.analyze_resume(
        resume_text=resume.text_content,
        target_role=payload.target_role,
        job_description=payload.job_description,
    )

    analysis = Analysis(
        resume_id=resume.id,
        target_role=payload.target_role,
        job_description=payload.job_description,
        overall_score=result.get("overall_score", 0),
        ats_score=result.get("ats_score", 0),
        skill_match=result.get("skill_match", 0),
        analysis_json=json.dumps(result),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    out = AnalysisOut.model_validate(analysis)
    out.resume_filename = resume.filename
    return out


@router.get("/history", response_model=list[AnalysisOut])
def history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    analyses = (
        db.query(Analysis)
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
        .all()
    )
    results = []
    for a in analyses:
        out = AnalysisOut.model_validate(a)
        out.resume_filename = a.resume.filename
        results.append(out)
    return results


@router.get("/{analysis_id}", response_model=AnalysisOut)
def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    analysis = (
        db.query(Analysis)
        .join(Resume)
        .filter(Analysis.id == analysis_id, Resume.user_id == current_user.id)
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    out = AnalysisOut.model_validate(analysis)
    out.resume_filename = analysis.resume.filename
    return out


@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    analysis = (
        db.query(Analysis)
        .join(Resume)
        .filter(Analysis.id == analysis_id, Resume.user_id == current_user.id)
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    db.delete(analysis)
    db.commit()


@router.post("/rewrite", response_model=RewriteResponse)
def rewrite(
    payload: RewriteRequest,
    current_user: User = Depends(get_current_user),
):
    if not payload.bullet_point.strip():
        raise HTTPException(status_code=400, detail="Bullet point cannot be empty.")
    result = gemini_service.rewrite_bullet(
        bullet=payload.bullet_point,
        context=payload.context,
    )
    return RewriteResponse(
        original=result.get("original", payload.bullet_point),
        improved=result.get("improved", payload.bullet_point),
    )


@router.post("/skills-gap", response_model=SkillGapResponse)
def skills_gap(
    payload: SkillGapRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_skills = []
    if payload.resume_id:
        analysis = (
            db.query(Analysis)
            .join(Resume)
            .filter(Resume.user_id == current_user.id, Analysis.resume_id == payload.resume_id)
            .order_by(Analysis.created_at.desc())
            .first()
        )
        if analysis:
            data = json.loads(analysis.analysis_json)
            current_skills = data.get("skills_present", [])

    result = gemini_service.analyze_skill_gap(
        target_role=payload.target_role,
        job_description=payload.job_description,
        current_skills=current_skills,
    )
    return SkillGapResponse(
        target_role=payload.target_role,
        current_skills=result.get("current_skills", current_skills),
        missing_skills=result.get("missing_skills", []),
        recommended_skills=result.get("recommended_skills", []),
        skill_gap_percentage=result.get("skill_gap_percentage", 0),
        tips=result.get("tips", []),
    )


@router.post("/{analysis_id}/report")
def download_report(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    analysis = (
        db.query(Analysis)
        .join(Resume)
        .filter(Analysis.id == analysis_id, Resume.user_id == current_user.id)
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    pdf_bytes = generate_report(
        resume_filename=analysis.resume.filename,
        target_role=analysis.target_role,
        analysis_json=analysis.analysis_json,
        created_at=analysis.created_at,
    )
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="resume_analysis_{analysis_id}.pdf"'
        },
    )
