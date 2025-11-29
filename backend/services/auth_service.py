from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from config.settings import settings
from typing import Optional
import secrets

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def decode_access_token(token: str) -> Optional[dict]:
        """Decode JWT access token"""
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            return payload
        except JWTError:
            return None
    
    @staticmethod
    def generate_temp_password(length: int = 12) -> str:
        """Generate a secure temporary password"""
        return secrets.token_urlsafe(length)
    
    @staticmethod
    def generate_reset_token() -> str:
        """Generate password reset token"""
        return secrets.token_urlsafe(32)