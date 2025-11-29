from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from supabase import Client
from config.database import get_supabase, get_supabase_admin
from config.settings import settings
from middleware.auth import get_current_user, require_admin
from services.auth_service import AuthService
from services.flagging_service import FlaggingService
from services.wellness_service import WellnessService
from services.upload_service import UploadService
from models.auth import LoginRequest, LoginResponse, PasswordChangeRequest
from models.employee import CreateEmployeeRequest, UpdateEmployeeRequest, NotificationPreferences
from models.report import CreateReportRequest, UpdateReportStatusRequest, AssignReportRequest, FlaggingRuleRequest
from models.task import CreateTaskRequest, UpdateTaskRequest
from models.wellness import WellnessScoreRequest
from typing import Optional, List
from datetime import datetime, timedelta
import uvicorn
import os

app = FastAPI(title="SafeShift API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# =====================================================
# AUTHENTICATION ROUTES
# =====================================================

@app.post("/auth/login", response_model=LoginResponse, tags=["Authentication"])
async def login(request: LoginRequest, supabase: Client = Depends(get_supabase)):
    """Employee/Admin login"""
    try:
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        profile = supabase.table("profiles").select("*").eq("id", response.user.id).execute()
        user_profile = profile.data[0]
        
        if not user_profile.get("is_active"):
            raise HTTPException(status_code=403, detail="Account is inactive")
        
        token_data = {
            "user_id": str(response.user.id),
            "email": user_profile["email"],
            "role": user_profile["role"]
        }
        
        access_token = AuthService.create_access_token(data=token_data)
        
        supabase_admin = get_supabase_admin()
        supabase_admin.table("activity_logs").insert({
            "employee_id": str(response.user.id),
            "activity_type": "login"
        }).execute()
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_profile
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.post("/auth/logout", tags=["Authentication"])
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout"""
    supabase_admin = get_supabase_admin()
    supabase_admin.table("activity_logs").insert({
        "employee_id": current_user["id"],
        "activity_type": "logout"
    }).execute()
    return {"message": "Logged out successfully"}

@app.post("/auth/change-password", tags=["Authentication"])
async def change_password(
    request: PasswordChangeRequest,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Change password"""
    try:
        supabase.auth.sign_in_with_password({
            "email": current_user["email"],
            "password": request.current_password
        })
        
        supabase.auth.update_user({"password": request.new_password})
        supabase.table("profiles").update({
            "requires_password_change": False
        }).eq("id", current_user["id"]).execute()
        
        return {"message": "Password changed successfully"}
    except:
        raise HTTPException(status_code=401, detail="Current password is incorrect")

@app.get("/auth/me", tags=["Authentication"])
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user"""
    return {"user": current_user}

# =====================================================
# EMPLOYEE MANAGEMENT (ADMIN)
# =====================================================

@app.post("/admin/employees", tags=["Admin - Employees"])
async def create_employee(
    request: CreateEmployeeRequest,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase)
):
    """Create new employee account"""
    try:
        temp_password = AuthService.generate_temp_password() if request.auto_generate_password else "TempPass123!"
        
        # Create auth user using admin client
        supabase_admin = get_supabase_admin()
        auth_response = supabase.auth.admin.create_user({
            "email": request.email,
            "password": temp_password,
            "email_confirm": True,
            "user_metadata": {
                "full_name": request.full_name,
                "employee_id": request.employee_id
            }
        })
        
        # Update profile with department
        supabase.table("profiles").update({
            "department_id": request.department_id,
            "role": request.role
        }).eq("id", auth_response.user.id).execute()
        
        # Send welcome email
        await EmailService.send_welcome_email(request.email, request.full_name, temp_password)
        
        # Log activity
        supabase_admin.table("system_logs").insert({
            "user_id": current_user["id"],
            "action": "employee_created",
            "entity_type": "profile",
            "entity_id": str(auth_response.user.id)
        }).execute()
        
        return {
            "message": "Employee created successfully",
            "employee_id": request.employee_id,
            "temp_password": temp_password if request.auto_generate_password else None
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/admin/employees", tags=["Admin - Employees"])
async def get_employees(
    department_id: Optional[str] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get all employees with filters"""
    query = supabase.table("profiles").select("*, departments(name, icon)")
    
    if department_id:
        query = query.eq("department_id", department_id)
    if is_active is not None:
        query = query.eq("is_active", is_active)
    if search:
        query = query.or_(f"full_name.ilike.%{search}%,email.ilike.%{search}%,employee_id.ilike.%{search}%")
    
    result = query.order("created_at", desc=True).execute()
    return {"employees": result.data}

@app.get("/admin/employees/{employee_id}", tags=["Admin - Employees"])
async def get_employee(
    employee_id: str,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get employee details"""
    result = supabase.table("profiles").select("*, departments(*)").eq("id", employee_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return {"employee": result.data[0]}

@app.patch("/admin/employees/{employee_id}", tags=["Admin - Employees"])
async def update_employee(
    employee_id: str,
    request: UpdateEmployeeRequest,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase)
):
    """Update employee"""
    update_data = request.dict(exclude_unset=True)
    
    if update_data:
        supabase.table("profiles").update(update_data).eq("id", employee_id).execute()
    
    return {"message": "Employee updated successfully"}

# =====================================================
# REPORTS
# =====================================================

@app.post("/reports", tags=["Reports"])
async def create_report(
    request: CreateReportRequest,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Submit a report"""
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
            "witness_information": request.witness_information,
            "attachments": request.attachments
        }
        
        result = supabase.table("reports").insert(report_data).execute()
        report = result.data[0]
        
        # Auto-flag report
        await FlaggingService.check_and_flag_report(report, supabase)
        
        return {
            "message": "Report submitted successfully",
            "report_id": report["report_id"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/reports", tags=["Reports"])
async def get_reports(
    department_id: Optional[str] = None,
    status: Optional[str] = None,
    severity: Optional[str] = None,
    is_flagged: Optional[bool] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get reports"""
    if current_user["role"] == "admin":
        query = supabase.table("reports").select("*, departments(name), profiles(full_name)")
        
        if department_id:
            query = query.eq("department_id", department_id)
        if status:
            query = query.eq("status", status)
        if severity:
            query = query.eq("severity", severity)
        if is_flagged is not None:
            query = query.eq("is_flagged", is_flagged)
        if start_date:
            query = query.gte("created_at", start_date)
        if end_date:
            query = query.lte("created_at", end_date)
        
        result = query.order("created_at", desc=True).execute()
    else:
        # Employee sees only their reports
        result = supabase.table("reports").select("*").eq(
            "employee_id", current_user["id"]
        ).order("created_at", desc=True).execute()
    
    return {"reports": result.data}

@app.get("/reports/{report_id}", tags=["Reports"])
async def get_report(
    report_id: str,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get report details"""
    result = supabase.table("reports").select("*, departments(*), profiles(full_name, email)").eq(
        "id", report_id
    ).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report = result.data[0]
    
    # Check access
    if current_user["role"] != "admin" and report["employee_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get actions history
    actions = supabase.table("report_actions").select("*, profiles(full_name)").eq(
        "report_id", report_id
    ).order("created_at", desc=True).execute()
    
    report["actions"] = actions.data
    
    return {"report": report}

@app.patch("/reports/{report_id}/status", tags=["Reports"])
async def update_report_status(
    report_id: str,
    request: UpdateReportStatusRequest,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase)
):
    """Update report status (Admin)"""
    # Update report
    supabase.table("reports").update({
        "status": request.status
    }).eq("id", report_id).execute()
    
    # Log action
    supabase.table("report_actions").insert({
        "report_id": report_id,
        "admin_id": current_user["id"],
        "action_type": "status_change",
        "new_value": request.status,
        "notes": request.notes
    }).execute()
    
    return {"message": "Report status updated"}

@app.post("/reports/{report_id}/assign", tags=["Reports"])
async def assign_report(
    report_id: str,
    request: AssignReportRequest,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase)
):
    """Assign report to admin"""
    supabase.table("reports").update({
        "assigned_to": request.assigned_to
    }).eq("id", report_id).execute()
    
    supabase.table("report_actions").insert({
        "report_id": report_id,
        "admin_id": current_user["id"],
        "action_type": "assignment",
        "new_value": request.assigned_to
    }).execute()
    
    return {"message": "Report assigned successfully"}

@app.post("/reports/upload", tags=["Reports"])
async def upload_report_attachment(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload report attachment"""
    file_path = await UploadService.save_file(file, "reports")
    return {"file_path": file_path, "filename": file.filename}

# =====================================================
# TASKS
# =====================================================

@app.post("/tasks", tags=["Tasks"])
async def create_task(
    request: CreateTaskRequest,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Create task"""
    # Only admin or self can create tasks
    if current_user["role"] != "admin" and request.employee_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    result = supabase.table("tasks").insert(request.dict()).execute()
    return {"task": result.data[0]}

@app.get("/tasks", tags=["Tasks"])
async def get_tasks(
    employee_id: Optional[str] = None,
    is_completed: Optional[bool] = None,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get tasks"""
    if current_user["role"] == "admin":
        query = supabase.table("tasks").select("*, profiles(full_name)")
        if employee_id:
            query = query.eq("employee_id", employee_id)
    else:
        query = supabase.table("tasks").select("*").eq("employee_id", current_user["id"])
    
    if is_completed is not None:
        query = query.eq("is_completed", is_completed)
    
    result = query.order("created_at", desc=True).execute()
    return {"tasks": result.data}

@app.patch("/tasks/{task_id}", tags=["Tasks"])
async def update_task(
    task_id: str,
    request: UpdateTaskRequest,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Update task"""
    # Check ownership
    task = supabase.table("tasks").select("*").eq("id", task_id).execute()
    if not task.data:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if current_user["role"] != "admin" and task.data[0]["employee_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    update_data = request.dict(exclude_unset=True)
    supabase.table("tasks").update(update_data).eq("id", task_id).execute()
    
    return {"message": "Task updated"}

@app.delete("/tasks/{task_id}", tags=["Tasks"])
async def delete_task(
    task_id: str,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Delete task"""
    task = supabase.table("tasks").select("*").eq("id", task_id).execute()
    if not task.data:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if current_user["role"] != "admin" and task.data[0]["employee_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    supabase.table("tasks").delete().eq("id", task_id).execute()
    return {"message": "Task deleted"}

# =====================================================
# ACTIVITY TRACKING
# =====================================================

@app.post("/activity/heartbeat", tags=["Activity"])
async def activity_heartbeat(current_user: dict = Depends(get_current_user)):
    """Track user activity"""
    if not current_user.get("activity_tracking_enabled"):
        return {"message": "Tracking disabled"}
    
    supabase_admin = get_supabase_admin()
    supabase_admin.table("activity_logs").insert({
        "employee_id": current_user["id"],
        "activity_type": "active",
        "status": "active"
    }).execute()
    
    return {"message": "Activity logged"}

@app.get("/activity/{employee_id}", tags=["Activity"])
async def get_activity(
    employee_id: str,
    days: int = 7,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get employee activity logs"""
    cutoff = datetime.now() - timedelta(days=days)
    
    result = supabase.table("activity_logs").select("*").eq(
        "employee_id", employee_id
    ).gte("timestamp", cutoff.isoformat()).execute()
    
    return {"activity": result.data}

# =====================================================
# WELLNESS
# =====================================================

@app.post("/wellness/calculate/{employee_id}", tags=["Wellness"])
async def calculate_wellness(
    employee_id: str,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase)
):
    """Calculate wellness score"""
    result = await WellnessService.calculate_employee_wellness(employee_id, supabase)
    return result

@app.get("/wellness/{employee_id}", tags=["Wellness"])
async def get_wellness(
    employee_id: str,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get wellness score"""
    if current_user["role"] != "admin" and employee_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    result = supabase.table("wellness_scores").select("*").eq(
        "employee_id", employee_id
    ).order("calculated_at", desc=True).limit(10).execute()
    
    return {"wellness_scores": result.data}

# =====================================================
# DEPARTMENTS
# =====================================================

@app.get("/departments", tags=["Departments"])
async def get_departments(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get all departments"""
    result = supabase.table("departments").select("*").execute()
    return {"departments": result.data}

@app.get("/departments/{department_id}/wellness", tags=["Departments"])
async def get_department_wellness(
    department_id: str,
    current_user: dict = Depends(require_admin),
    supabase: Client = Depends(get_supabase)
):
    """Calculate department wellness"""
    result = await WellnessService.calculate_department_wellness(department_id, supabase)
    return result

# =====================================================
# DASHBOARD METRICS
# =====================================================

@app.get("/dashboard/metrics", tags=["Dashboard"])
async def get_dashboard_metrics(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get dashboard metrics"""
    if current_user["role"] == "admin":
        # Admin metrics
        total_employees = supabase.table("profiles").select("id", count="exact").eq("is_active", True).execute()
        total_reports = supabase.table("reports").select("id", count="exact").execute()
        flagged_reports = supabase.table("reports").select("id", count="exact").eq("is_flagged", True).execute()
        departments = supabase.table("departments").select("*").execute()
        
        return {
            "total_employees": total_employees.count,
            "total_reports": total_reports.count,
            "flagged_reports": flagged_reports.count,
            "departments": departments.data
        }
    else:
        # Employee metrics
        tasks = supabase.table("tasks").select("*").eq("employee_id", current_user["id"]).execute()
        reports = supabase.table("reports").select("*").eq("employee_id", current_user["id"]).execute()
        wellness = supabase.table("wellness_scores").select("*").eq(
            "employee_id", current_user["id"]
        ).order("calculated_at", desc=True).limit(1).execute()
        
        today = datetime.now().date()
        activity = supabase.table("activity_logs").select("*").eq(
            "employee_id", current_user["id"]
        ).gte("timestamp", today.isoformat()).execute()
        
        return {
            "tasks": tasks.data,
            "reports": reports.data,
            "wellness_score": wellness.data[0] if wellness.data else None,
            "activity_today": len(activity.data)
        }

# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy", "service": "SafeShift API"}

# =====================================================
# RUN SERVER
# =====================================================

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)