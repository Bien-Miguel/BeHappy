from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CreateReportRequest(BaseModel):
    """Schema for submitting a new report."""
    department_id: Optional[str] = None  # Admin can specify, or use current_user's dept
    report_type: str = Field(..., description="e.g., 'Harassment', 'Safety Issue'")
    severity: str = Field(..., description="e.g., 'Low', 'Medium', 'High'")
    title: str
    description: str
    is_anonymous: bool = False
    incident_date: datetime
    witness_information: Optional[str] = None
    attachments: Optional[List[str]] = None # List of file paths from upload_report_attachment

class UpdateReportStatusRequest(BaseModel):
    """Schema for updating a report's status by an admin."""
    status: str = Field(..., description="e.g., 'Pending', 'In Progress', 'Resolved'")
    notes: Optional[str] = None

class AssignReportRequest(BaseModel):
    """Schema for assigning a report to an admin/case manager."""
    assigned_to: str # The user ID of the admin/manager

class FlaggingRuleRequest(BaseModel):
    """Schema for managing report flagging rules (if you create a rule CRUD)."""
    rule_name: str
    keywords: List[str]
    min_severity: str
    is_active: bool = True