import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY")
    
    # JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Email (Optional - configure if you want email notifications)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@safeshift.com")
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx"}
    UPLOAD_DIR: str = "uploads"
    
    # Wellness Score Thresholds
    WELLNESS_EXCELLENT_MIN: int = 80
    WELLNESS_GOOD_MIN: int = 50
    WELLNESS_FAIR_MIN: int = 30
    
    # Activity Tracking
    ACTIVITY_TIMEOUT_MINUTES: int = 10
    HEARTBEAT_INTERVAL_MINUTES: int = 5
    
    # Report Flagging
    PATTERN_DETECTION_DAYS: int = 7
    SIMILAR_REPORTS_THRESHOLD: int = 2
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

settings = Settings()