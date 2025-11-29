"""
Test script to verify .env file and Supabase connection
Run this before starting main.py
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Get current directory
current_dir = Path(__file__).resolve().parent
env_path = current_dir / '.env'

print("=" * 60)
print("🔍 ENVIRONMENT VARIABLES TEST")
print("=" * 60)

# Check if .env file exists
if env_path.exists():
    print(f"✅ .env file found at: {env_path}")
else:
    print(f"❌ .env file NOT FOUND at: {env_path}")
    print("\n📝 Create a .env file in your backend directory with:")
    print("""
SUPABASE_URL=https://gpcputqsxgsycucsjtmh.supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
    """)
    exit(1)

# Load environment variables
load_dotenv(dotenv_path=env_path)

# Check each variable
print("\n📋 Environment Variables:")
print("-" * 60)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if SUPABASE_URL:
    print(f"✅ SUPABASE_URL: {SUPABASE_URL}")
else:
    print("❌ SUPABASE_URL: NOT SET")

if SUPABASE_KEY:
    print(f"✅ SUPABASE_KEY: {SUPABASE_KEY[:20]}... (truncated)")
else:
    print("❌ SUPABASE_KEY: NOT SET")

if SUPABASE_SERVICE_KEY:
    print(f"✅ SUPABASE_SERVICE_KEY: {SUPABASE_SERVICE_KEY[:20]}... (truncated)")
else:
    print("❌ SUPABASE_SERVICE_KEY: NOT SET")

# Test Supabase connection
if SUPABASE_URL and SUPABASE_KEY:
    print("\n🔌 Testing Supabase Connection...")
    print("-" * 60)
    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase client created successfully!")
        
        # Try to query departments table
        result = supabase.table("departments").select("*").limit(1).execute()
        print(f"✅ Database connection successful!")
        print(f"✅ Found {len(result.data)} department(s)")
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        print("\n💡 Make sure you:")
        print("1. Ran the SQL schema in Supabase SQL Editor")
        print("2. Used the correct anon key (not service_role)")
        print("3. Your Supabase project is active")
else:
    print("\n⚠️  Cannot test connection - missing credentials")

print("\n" + "=" * 60)
print("✨ Test Complete!")
print("=" * 60)