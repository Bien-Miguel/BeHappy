# BE HAPPY/backend/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 1. Load environment variables from the .env file
load_dotenv()

# Get the URL
SUPABASE_URL = os.getenv("SUPABASE_URL")
if not SUPABASE_URL:
    raise Exception("SUPABASE_URL environment variable not set. Check your .env file.")

# 2. Create the SQLAlchemy Engine
# This engine handles the connection pool to your Supabase instance.
engine = create_engine(SUPABASE_URL)

# 3. Configure the SessionLocal class
# Instances of this class will be the actual database sessions used in your code.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base class for ORM models
# All your database table definitions will inherit from this Base.
Base = declarative_base()

# BE HAPPY/backend/database.py (Add this section temporarily)
def check_connection():
    try:
        connection = engine.connect()
        print("Database connection successful!")
        connection.close()
    except Exception as e:
        print(f"Database connection failed: {e}")

if __name__ == "__main__":
    check_connection()