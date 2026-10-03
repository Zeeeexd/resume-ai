from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.analysis import Analysis
from app.models.resume import Resume
from app.schemas.schemas import UserOut
from app.utils.auth import get_current_user
from sqlalchemy import func

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/profile")
def profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total = (
        db.query(func.count(Analysis.id))
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .scalar()
    ) or 0

    avg_overall = (
        db.query(func.avg(Analysis.overall_score))
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .scalar()
    ) or 0

    avg_ats = (
        db.query(func.avg(Analysis.ats_score))
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .scalar()
    ) or 0

    return {
        "user": UserOut.model_validate(current_user),
        "stats": {
            "total_analyses": total,
            "avg_overall_score": round(avg_overall),
            "avg_ats_score": round(avg_ats),
        },
    }
