from supabase import Client
from datetime import datetime, timedelta
from config.settings import settings
from typing import List, Dict

class FlaggingService:
    @staticmethod
    async def check_and_flag_report(report: dict, supabase: Client) -> dict:
        """
        Check if report should be auto-flagged based on:
        1. Keyword detection
        2. Pattern detection (multiple similar reports)
        3. Missing documentation
        """
        flags = []
        highest_severity = report["severity"]
        
        # 1. Keyword Detection
        keyword_flag = await FlaggingService._check_keywords(report, supabase)
        if keyword_flag:
            flags.append(keyword_flag)
            if FlaggingService._is_higher_severity(keyword_flag["severity"], highest_severity):
                highest_severity = keyword_flag["severity"]
        
        # 2. Pattern Detection
        pattern_flag = await FlaggingService._check_patterns(report, supabase)
        if pattern_flag:
            flags.append(pattern_flag)
        
        # 3. Missing Documentation
        doc_flag = FlaggingService._check_documentation(report)
        if doc_flag:
            flags.append(doc_flag)
        
        # Update report if flagged
        if flags:
            flag_reasons = " | ".join([f["reason"] for f in flags])
            
            supabase.table("reports").update({
                "is_flagged": True,
                "flag_reason": flag_reasons,
                "severity": highest_severity
            }).eq("id", report["id"]).execute()
            
            return {"flagged": True, "flags": flags, "severity": highest_severity}
        
        return {"flagged": False}
    
    @staticmethod
    async def _check_keywords(report: dict, supabase: Client) -> dict:
        """Check for keyword matches"""
        try:
            rules = supabase.table("flagging_rules").select("*").eq("is_active", True).execute()
            
            description_lower = report["description"].lower()
            title_lower = report["title"].lower()
            
            for rule in rules.data:
                keyword = rule["keyword"].lower()
                if keyword in description_lower or keyword in title_lower:
                    return {
                        "type": "keyword",
                        "reason": f"Keyword detected: {rule['keyword']}",
                        "severity": rule["severity_level"]
                    }
        except Exception as e:
            print(f"Keyword check error: {e}")
        
        return None
    
    @staticmethod
    async def _check_patterns(report: dict, supabase: Client) -> dict:
        """Check for patterns - multiple similar reports"""
        try:
            # Check for multiple reports from same department in last N days
            cutoff_date = datetime.now() - timedelta(days=settings.PATTERN_DETECTION_DAYS)
            
            similar_reports = supabase.table("reports").select("*").eq(
                "department_id", report["department_id"]
            ).eq(
                "report_type", report["report_type"]
            ).gte(
                "created_at", cutoff_date.isoformat()
            ).execute()
            
            if len(similar_reports.data) >= settings.SIMILAR_REPORTS_THRESHOLD:
                return {
                    "type": "pattern",
                    "reason": f"Multiple similar reports detected ({len(similar_reports.data)} in {settings.PATTERN_DETECTION_DAYS} days)",
                    "severity": "high"
                }
        except Exception as e:
            print(f"Pattern check error: {e}")
        
        return None
    
    @staticmethod
    def _check_documentation(report: dict) -> dict:
        """Check for missing documentation on high severity reports"""
        if report["severity"] in ["high", "critical"]:
            # Check if description is too short
            if len(report["description"]) < 100:
                return {
                    "type": "documentation",
                    "reason": "High severity report with insufficient description",
                    "severity": report["severity"]
                }
            
            # Check if no attachments for critical reports
            attachments = report.get("attachments")
            if report["severity"] == "critical" and (not attachments or len(attachments) == 0):
                return {
                    "type": "documentation",
                    "reason": "Critical report missing supporting documentation",
                    "severity": "critical"
                }
        
        return None
    
    @staticmethod
    def _is_higher_severity(new_severity: str, current_severity: str) -> bool:
        """Compare severity levels"""
        severity_order = {"low": 0, "medium": 1, "high": 2, "critical": 3}
        return severity_order.get(new_severity, 0) > severity_order.get(current_severity, 0)