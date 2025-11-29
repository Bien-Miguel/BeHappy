from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str
    
class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class TokenData(BaseModel):
    user_id: str
    email: str
    role: str