from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from config.database import get_supabase, get_supabase_admin
from models.auth import LoginRequest, LoginResponse, PasswordChangeRequest
from services.auth_service import AuthService
from middleware.auth import get_current_user
from datetime import timedelta
from config.settings import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, supabase: Client = Depends(get_supabase)):
    """
    Employee/Admin login endpoint
    """
    try:
        # Authenticate with Supabase
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Get user profile
        profile = supabase.table("profiles").select("*").eq("id", response.user.id).execute()
        
        if not profile.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        user_profile = profile.data[0]
        
        # Check if account is active
        if not user_profile.get("is_active"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive. Please contact administrator."
            )
        
        # Create custom JWT token with user info
        token_data = {
            "user_id": str(response.user.id),
            "email": user_profile["email"],
            "role": user_profile["role"]
        }
        
        access_token = AuthService.create_access_token(
            data=token_data,
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        # Log login activity
        supabase_admin = get_supabase_admin()
        supabase_admin.table("activity_logs").insert({
            "employee_id": str(response.user.id),
            "activity_type": "login",
            "status": "active"
        }).execute()
        
        # Log system activity
        supabase_admin.table("system_logs").insert({
            "user_id": str(response.user.id),
            "action": "login",
            "entity_type": "auth",
            "details": {"email": request.email}
        }).execute()
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_profile
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/logout")
async def logout(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Logout endpoint
    """
    try:
        # Log logout activity
        supabase_admin = get_supabase_admin()
        supabase_admin.table("activity_logs").insert({
            "employee_id": current_user["id"],
            "activity_type": "logout",
            "status": "inactive"
        }).execute()
        
        # Log system activity
        supabase_admin.table("system_logs").insert({
            "user_id": current_user["id"],
            "action": "logout",
            "entity_type": "auth"
        }).execute()
        
        # Note: Supabase auth.sign_out() requires the session token
        # For JWT-based auth, we rely on client-side token deletion
        
        return {"message": "Logged out successfully"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )

@router.post("/change-password")
async def change_password(
    request: PasswordChangeRequest,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Change password for authenticated user
    """
    try:
        # Verify current password
        auth_response = supabase.auth.sign_in_with_password({
            "email": current_user["email"],
            "password": request.current_password
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Current password is incorrect"
            )
        
        # Update password
        supabase.auth.update_user({
            "password": request.new_password
        })
        
        # Update requires_password_change flag
        supabase.table("profiles").update({
            "requires_password_change": False
        }).eq("id", current_user["id"]).execute()
        
        # Log activity
        supabase_admin = get_supabase_admin()
        supabase_admin.table("system_logs").insert({
            "user_id": current_user["id"],
            "action": "password_changed",
            "entity_type": "auth"
        }).execute()
        
        return {"message": "Password changed successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password change failed: {str(e)}"
        )

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current authenticated user information
    """
    return {"user": current_user}