from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    GEMINI_API_KEY: Optional[str] = None
    SECRET_KEY: str = "change-this-in-production-super-secret-key"
    DATABASE_URL: str = "sqlite:///./resume_ai.db"
    DEMO_MODE: bool = False
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
