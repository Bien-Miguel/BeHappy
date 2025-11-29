# BE HAPPY/backend/dependencies.py

from typing import Generator
# This import path remains correct
from .database import SessionLocal 

def get_db() -> Generator:
    """
    Dependency that yields a new database session for each request.
    This logic works for any SQLAlchemy setup (PostgreSQL, SQLite, etc.).
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()