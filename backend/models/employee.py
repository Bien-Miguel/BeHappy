from pydantic import BaseModel
from typing import Optional

class CreateEmployeeRequest(BaseModel):
    """Schema for creating a new employee by an admin."""
    email: str
    full_name: str
    employee_id: str
    department_id: str
    role: str
    auto_generate_password: bool = True

class UpdateEmployeeRequest(BaseModel):
    """Schema for updating an existing employee by an admin."""
    full_name: Optional[str] = None
    employee_id: Optional[str] = None
    department_id: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class NotificationPreferences(BaseModel):
    """Schema for managing employee notification preferences."""
    email_notifications: bool = True
    push_notifications: bool = True