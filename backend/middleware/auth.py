from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client
from config.database import get_supabase
from services.auth_service import AuthService

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase: Client = Depends(get_supabase)
):
    """
    Validates JWT token and returns current user profile
    """
    token = credentials.credentials
    
    try:
        # Decode token
        payload = AuthService.decode_access_token(token)
        
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Get user profile
        profile = supabase.table("profiles").select("*").eq("id", user_id).execute()
        
        if not profile.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        user = profile.data[0]
        
        # Check if user is active
        if not user.get("is_active"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )
        
        return user
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}"
        )

async def require_admin(current_user: dict = Depends(get_current_user)):
    """
    Ensures current user has admin role
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
    supabase: Client = Depends(get_supabase)
):
    """
    Optional authentication - returns None if not authenticated
    Useful for endpoints that work with or without auth
    """
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials, supabase)
    except:
        return None