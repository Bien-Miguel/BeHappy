import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

# Get the backend directory path
backend_dir = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
env_path = backend_dir / '.env'
load_dotenv(dotenv_path=env_path)

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # Use anon key for client, service_role for admin
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # For bypassing RLS

# Validate environment variables
if not SUPABASE_URL:
    raise ValueError(f"SUPABASE_URL not found in environment variables. Looking in: {env_path}")
if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY not found in environment variables")
if not SUPABASE_SERVICE_KEY:
    raise ValueError("SUPABASE_SERVICE_KEY not found in environment variables")

print(f"✅ Loaded environment from: {env_path}")
print(f"✅ Supabase URL: {SUPABASE_URL}")

# Initialize Supabase clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def get_supabase() -> Client:
    """
    Returns Supabase client for regular operations (respects RLS)
    """
    return supabase

def get_supabase_admin() -> Client:
    """
    Returns Supabase admin client (bypasses RLS)
    Use for system operations like activity logging
    """
    return supabase_admin