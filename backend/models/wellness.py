from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class WellnessScoreRequest(BaseModel):
    employee_id: str
    score: int  # 1-10
    factors: Optional[Dict] = None
    notes: Optional[str] = None

class WellnessScoreResponse(BaseModel):
    id: str
    employee_id: str
    score: int
    factors: Optional[Dict]
    notes: Optional[str]
    calculated_at: datetime
    
class DepartmentWellnessResponse(BaseModel):
    department_id: str
    department_name: str
    wellness_score: int  # 0-100
    total_employees: int
    trend: str  # improving, stable, declining