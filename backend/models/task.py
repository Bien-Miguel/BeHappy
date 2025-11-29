# models/task.py

from pydantic import BaseModel, Field # <--- Field added here
from typing import Optional
from datetime import datetime

class CreateTaskRequest(BaseModel):
    """Schema for creating a new task."""
    employee_id: str
    report_id: Optional[str] = None
    title: str
    description: str
    due_date: datetime
    priority: str = Field("Medium", description="e.g., 'Low', 'Medium', 'High'")

class UpdateTaskRequest(BaseModel):
    """Schema for updating an existing task."""
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = None
    is_completed: Optional[bool] = None