from supabase import create_client, Client
from config.settings import settings

def get_supabase() -> Client:
    """Get Supabase client with anon key (respects RLS)"""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_supabase_admin() -> Client:
    """Get Supabase admin client (bypasses RLS)"""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)