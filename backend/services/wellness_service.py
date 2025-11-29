from supabase import Client
from datetime import datetime, timedelta
from typing import Dict
from config.settings import settings

class WellnessService:
    @staticmethod
    async def calculate_employee_wellness(employee_id: str, supabase: Client) -> Dict:
        """
        Calculate wellness score for an employee based on:
        1. Work hours (overtime detection)
        2. Activity patterns
        3. Report submissions (stress indicator)
        4. Task completion rate
        """
        factors = {}
        score = 10  # Start with perfect score
        
        # 1. Work-Life Balance (Check for overtime)
        work_balance = await WellnessService._check_work_balance(employee_id, supabase)
        factors["work_life_balance"] = work_balance["score"]
        score -= work_balance["penalty"]
        
        # 2. Activity Level
        activity_level = await WellnessService._check_activity_level(employee_id, supabase)
        factors["activity_level"] = activity_level["score"]
        score -= activity_level["penalty"]
        
        # 3. Stress Indicators (reports filed)
        stress_level = await WellnessService._check_stress_indicators(employee_id, supabase)
        factors["stress_level"] = stress_level["score"]
        score -= stress_level["penalty"]
        
        # 4. Task Performance
        task_performance = await WellnessService._check_task_performance(employee_id, supabase)
        factors["task_performance"] = task_performance["score"]
        score -= task_performance["penalty"]
        
        # Ensure score is between 1-10
        score = max(1, min(10, score))
        
        # Save wellness score
        wellness_data = {
            "employee_id": employee_id,
            "score": score,
            "factors": factors,
            "notes": WellnessService._generate_wellness_message(score)
        }
        
        supabase.table("wellness_scores").insert(wellness_data).execute()
        
        return wellness_data
    
    @staticmethod
    async def _check_work_balance(employee_id: str, supabase: Client) -> Dict:
        """Check work hours in last 7 days"""
        try:
            week_ago = datetime.now() - timedelta(days=7)
            
            activities = supabase.table("activity_logs").select("*").eq(
                "employee_id", employee_id
            ).gte(
                "timestamp", week_ago.isoformat()
            ).execute()
            
            active_sessions = [a for a in activities.data if a["activity_type"] == "active"]
            hours_per_day = len(active_sessions) * (settings.HEARTBEAT_INTERVAL_MINUTES / 60)
            
            if hours_per_day > 10:
                return {"score": 30, "penalty": 3}
            elif hours_per_day > 8:
                return {"score": 60, "penalty": 1}
            else:
                return {"score": 100, "penalty": 0}
                
        except Exception as e:
            print(f"Work balance check error: {e}")
            return {"score": 50, "penalty": 0}
    
    @staticmethod
    async def _check_activity_level(employee_id: str, supabase: Client) -> Dict:
        """Check activity patterns"""
        try:
            week_ago = datetime.now() - timedelta(days=7)
            
            activities = supabase.table("activity_logs").select("*").eq(
                "employee_id", employee_id
            ).gte(
                "timestamp", week_ago.isoformat()
            ).execute()
            
            total_logs = len(activities.data)
            expected_per_week = 12 * 5
            
            if total_logs < expected_per_week * 0.5:
                return {"score": 40, "penalty": 2}
            elif total_logs < expected_per_week * 0.8:
                return {"score": 70, "penalty": 1}
            else:
                return {"score": 100, "penalty": 0}
                
        except Exception as e:
            print(f"Activity level check error: {e}")
            return {"score": 50, "penalty": 0}
    
    @staticmethod
    async def _check_stress_indicators(employee_id: str, supabase: Client) -> Dict:
        """Check for stress through report submissions"""
        try:
            month_ago = datetime.now() - timedelta(days=30)
            
            reports = supabase.table("reports").select("*").eq(
                "employee_id", employee_id
            ).gte(
                "created_at", month_ago.isoformat()
            ).execute()
            
            report_count = len(reports.data)
            
            if report_count > 5:
                return {"score": 30, "penalty": 3}
            elif report_count > 2:
                return {"score": 60, "penalty": 1}
            else:
                return {"score": 100, "penalty": 0}
                
        except Exception as e:
            print(f"Stress check error: {e}")
            return {"score": 50, "penalty": 0}
    
    @staticmethod
    async def _check_task_performance(employee_id: str, supabase: Client) -> Dict:
        """Check task completion rate"""
        try:
            tasks = supabase.table("tasks").select("*").eq(
                "employee_id", employee_id
            ).execute()
            
            if len(tasks.data) == 0:
                return {"score": 100, "penalty": 0}
            
            completed = len([t for t in tasks.data if t["is_completed"]])
            completion_rate = completed / len(tasks.data)
            
            if completion_rate < 0.3:
                return {"score": 40, "penalty": 2}
            elif completion_rate < 0.6:
                return {"score": 70, "penalty": 1}
            else:
                return {"score": 100, "penalty": 0}
                
        except Exception as e:
            print(f"Task performance check error: {e}")
            return {"score": 50, "penalty": 0}
    
    @staticmethod
    def _generate_wellness_message(score: int) -> str:
        """Generate friendly wellness message"""
        if score >= 8:
            return "You're doing great! Keep maintaining this healthy balance."
        elif score >= 6:
            return "You're doing well! Consider taking more breaks."
        elif score >= 4:
            return "Let's check in - everything okay? Consider reaching out if you need support."
        else:
            return "We're concerned about your wellbeing. Please speak with your manager or HR."
    
    @staticmethod
    async def calculate_department_wellness(department_id: str, supabase: Client) -> Dict:
        """Calculate wellness score for entire department"""
        try:
            employees = supabase.table("profiles").select("id").eq(
                "department_id", department_id
            ).eq(
                "is_active", True
            ).execute()
            
            if not employees.data:
                return {"wellness_score": 50, "total_employees": 0, "trend": "stable"}
            
            total_score = 0
            for emp in employees.data:
                wellness = supabase.table("wellness_scores").select("score").eq(
                    "employee_id", emp["id"]
                ).order("calculated_at", desc=True).limit(1).execute()
                
                if wellness.data:
                    total_score += wellness.data[0]["score"]
                else:
                    total_score += 5
            
            avg_score = (total_score / len(employees.data)) * 10
            
            trend = "stable"
            if avg_score >= settings.WELLNESS_EXCELLENT_MIN:
                trend = "improving"
            elif avg_score < settings.WELLNESS_FAIR_MIN:
                trend = "declining"
            
            supabase.table("departments").update({
                "wellness_score": int(avg_score),
                "total_employees": len(employees.data)
            }).eq("id", department_id).execute()
            
            return {
                "wellness_score": int(avg_score),
                "total_employees": len(employees.data),
                "trend": trend
            }
            
        except Exception as e:
            print(f"Department wellness calculation error: {e}")
            return {"wellness_score": 50, "total_employees": 0, "trend": "stable"}