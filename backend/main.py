from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config.database import get_supabase, get_supabase_admin
from supabase import Client
import uvicorn

app = FastAPI(title="Corporate Integrity Monitoring API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# =====================================================
# Authentication Dependency
# =====================================================

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase: Client = Depends(get_supabase)
):
    """
    Validates JWT token and returns current user
    """
    token = credentials.credentials
    
    try:
        # Verify token with Supabase
        user = supabase.auth.get_user(token)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        # Get user profile
        profile = supabase.table("profiles").select("*").eq("id", user.user.id).execute()
        
        if not profile.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        return profile.data[0]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}"
        )

async def require_admin(current_user: dict = Depends(get_current_user)):
    """
    Ensures current user is an admin
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

# =====================================================
# Authentication Routes
# =====================================================

from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

@app.post("/auth/login", response_model=LoginResponse)
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
        
        # Get user profile
        profile = supabase.table("profiles").select("*").eq("id", response.user.id).execute()
        
        # Log login activity
        supabase_admin = get_supabase_admin()
        supabase_admin.table("activity_logs").insert({
            "employee_id": response.user.id,
            "activity_type": "login"
        }).execute()
        
        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "user": profile.data[0] if profile.data else None
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}"
        )

@app.post("/auth/logout")
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
            "activity_type": "logout"
        }).execute()
        
        # Sign out from Supabase
        supabase.auth.sign_out()
        
        return {"message": "Logged out successfully"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )

# =====================================================
# Employee Management Routes (Admin Only)
# =====================================================

class CreateEmployeeRequest(BaseModel):
    full_name: str
    email: EmailStr
    employee_id: str
    department_id: str
    role: str = "employee"
    auto_generate_password: bool = True

@app.post("/admin/employees")
async def create_employee(
    request: CreateEmployeeRequest,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase)
):
    """
    Admin creates new employee account
    """
    try:
        # Generate temporary password
        import secrets
        temp_password = secrets.token_urlsafe(12) if request.auto_generate_password else "TempPass123!"
        
        # Create auth user
        auth_response = supabase.auth.admin.create_user({
            "email": request.email,
            "password": temp_password,
            "email_confirm": True,
            "user_metadata": {
                "full_name": request.full_name,
                "employee_id": request.employee_id,
                "role": request.role
            }
        })
        
        # Profile is auto-created via trigger, but we can update department
        profile_update = supabase.table("profiles").update({
            "department_id": request.department_id
        }).eq("id", auth_response.user.id).execute()
        
        # Log system activity
        supabase_admin = get_supabase_admin()
        supabase_admin.table("system_logs").insert({
            "user_id": current_user["id"],
            "action": "employee_created",
            "entity_type": "profile",
            "entity_id": auth_response.user.id,
            "details": {"employee_id": request.employee_id}
        }).execute()
        
        # TODO: Send email with temporary password
        
        return {
            "message": "Employee created successfully",
            "employee_id": request.employee_id,
            "temp_password": temp_password if request.auto_generate_password else None
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create employee: {str(e)}"
        )

@app.get("/admin/employees")
async def get_all_employees(
    department_id: str = None,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase)
):
    """
    Get all employees (with optional department filter)
    """
    try:
        query = supabase.table("profiles").select("*, departments(name, icon)")
        
        if department_id:
            query = query.eq("department_id", department_id)
        
        result = query.execute()
        return {"employees": result.data}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch employees: {str(e)}"
        )

# =====================================================
# Report Routes
# =====================================================

class CreateReportRequest(BaseModel):
    report_type: str
    severity: str
    title: str
    description: str
    is_anonymous: bool = False
    incident_date: str = None
    witness_information: str = None
    department_id: str = None

@app.post("/reports")
async def create_report(
    request: CreateReportRequest,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Employee submits a report
    """
    try:
        report_data = {
            "employee_id": None if request.is_anonymous else current_user["id"],
            "department_id": request.department_id or current_user.get("department_id"),
            "report_type": request.report_type,
            "severity": request.severity,
            "title": request.title,
            "description": request.description,
            "is_anonymous": request.is_anonymous,
            "incident_date": request.incident_date,
            "witness_information": request.witness_information
        }
        
        # Insert report
        result = supabase.table("reports").insert(report_data).execute()
        report_id = result.data[0]["report_id"]
        
        # Check for auto-flagging (keyword detection)
        await check_and_flag_report(result.data[0], supabase)
        
        return {
            "message": "Report submitted successfully",
            "report_id": report_id
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to submit report: {str(e)}"
        )

async def check_and_flag_report(report: dict, supabase: Client):
    """
    Check if report should be auto-flagged based on keywords
    """
    try:
        # Get active flagging rules
        rules = supabase.table("flagging_rules").select("*").eq("is_active", True).execute()
        
        description_lower = report["description"].lower()
        title_lower = report["title"].lower()
        
        for rule in rules.data:
            keyword = rule["keyword"].lower()
            if keyword in description_lower or keyword in title_lower:
                # Flag the report
                supabase.table("reports").update({
                    "is_flagged": True,
                    "flag_reason": f"Keyword detected: {rule['keyword']}",
                    "severity": rule["severity_level"]  # Update severity if higher
                }).eq("id", report["id"]).execute()
                break
    
    except Exception as e:
        print(f"Flagging check failed: {str(e)}")

@app.get("/reports")
async def get_reports(
    department_id: str = None,
    status: str = None,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Get reports (employees see own reports, admins see all)
    """
    try:
        if current_user["role"] == "admin":
            # Admin sees all reports
            query = supabase.table("reports").select("*, departments(name)")
            
            if department_id:
                query = query.eq("department_id", department_id)
            if status:
                query = query.eq("status", status)
            
            result = query.order("created_at", desc=True).execute()
        else:
            # Employee sees only their reports
            result = supabase.table("reports").select("*").eq(
                "employee_id", current_user["id"]
            ).order("created_at", desc=True).execute()
        
        return {"reports": result.data}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reports: {str(e)}"
        )

# =====================================================
# Activity Tracking Routes
# =====================================================

@app.post("/activity/heartbeat")
async def activity_heartbeat(
    current_user: dict = Depends(get_current_user)
):
    """
    Called every 5 minutes from frontend to track activity
    """
    try:
        if not current_user.get("activity_tracking_enabled"):
            return {"message": "Activity tracking disabled"}
        
        supabase_admin = get_supabase_admin()
        supabase_admin.table("activity_logs").insert({
            "employee_id": current_user["id"],
            "activity_type": "active",
            "status": "active"
        }).execute()
        
        return {"message": "Activity logged"}
    
    except Exception as e:
        return {"message": f"Failed to log activity: {str(e)}"}

# =====================================================
# Dashboard Routes
# =====================================================

@app.get("/dashboard/metrics")
async def get_dashboard_metrics(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Get dashboard metrics for current user
    """
    try:
        if current_user["role"] == "admin":
            # Admin dashboard metrics
            metrics = supabase.table("admin_dashboard_metrics").select("*").execute()
            departments = supabase.table("department_health").select("*").execute()
            
            return {
                "metrics": metrics.data[0] if metrics.data else {},
                "departments": departments.data
            }
        else:
            # Employee dashboard metrics
            # Get tasks
            tasks = supabase.table("tasks").select("*").eq(
                "employee_id", current_user["id"]
            ).execute()
            
            # Get wellness score
            wellness = supabase.table("wellness_scores").select("*").eq(
                "employee_id", current_user["id"]
            ).order("calculated_at", desc=True).limit(1).execute()
            
            # Get today's activity
            from datetime import datetime, timedelta
            today = datetime.now().date()
            activity = supabase.table("activity_logs").select("*").eq(
                "employee_id", current_user["id"]
            ).gte("timestamp", today.isoformat()).execute()
            
            return {
                "tasks": tasks.data,
                "wellness_score": wellness.data[0] if wellness.data else None,
                "activity_today": len(activity.data)
            }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch metrics: {str(e)}"
        )

# =====================================================
# Health Check
# =====================================================

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Corporate Integrity Monitoring API"}

# =====================================================
# Run Server
# =====================================================

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)