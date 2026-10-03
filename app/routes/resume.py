from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.schemas import ResumeOut
from app.utils.auth import get_current_user
from app.services.parser_service import parse_resume
from app.config import settings

router = APIRouter(prefix="/api/resume", tags=["resume"])

ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
}


@router.post("/upload", response_model=ResumeOut, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate file type
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ("pdf", "docx", "doc"):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PDF and DOCX files are supported.",
        )

    content = await file.read()

    # Validate file size
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds the {settings.MAX_FILE_SIZE_MB} MB limit.",
        )

    # Parse the resume
    text, _ = parse_resume(file.filename, content)

    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        text_content=text,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume
