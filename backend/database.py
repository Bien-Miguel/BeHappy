# BE HAPPY/backend/database.py

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv, find_dotenv 

# 1. Load environment variables
# We explicitly use find_dotenv() to locate the .env file reliably.
load_dotenv(find_dotenv())

# Get the connection URL from the .env file
POSTGRES_URL = os.getenv("POSTGRES_URL")

# --- Validation and Error Check ---
if not POSTGRES_URL:
    raise Exception("POSTGRES_URL environment variable not set. Check your .env file.")
# -----------------------------------


# 2. Create the SQLAlchemy Engine
# The engine is the main source of database connection
# It uses the 'postgresql+psycopg2' driver specified in the URL.
engine = create_engine(POSTGRES_URL)

# 3. Configure the SessionLocal
# This class will be used to create new database sessions (connections)
# for each incoming API request. autocommit/autoflush are set to False 
# so we can manage transactions manually within our code.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base class for ORM models
# All your database table definitions (DBUser, DBReport, etc.) will inherit from this Base.
Base = declarative_base()


# --- Temporary Connection Test (Optional: Use for testing) ---

def check_connection():
    """Attempts to connect to the database engine for verification."""
    try:
        connection = engine.connect()
        print("\n✅ Database connection successful!")
        print("Driver and credentials confirmed.")
        connection.close()
    except Exception as e:
        print("\n❌ Database connection failed!")
        print(f"Error: {e}")
        # Common error hints
        if 'fe_sendauth' in str(e):
            print("Hint: Authentication failed. Check your username and password in .env.")
        elif 'could not connect to server' in str(e):
            print("Hint: Connection refused. Check if your PostgreSQL server (10.18.11.148) is running and accessible.")

if __name__ == "__main__":
    check_connection()