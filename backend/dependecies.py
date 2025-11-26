# BE HAPPY/backend/dependencies.py
from typing import Generator
from .database import SessionLocal

def get_db() -> Generator:
    """
    Dependency that yields a new database session for each request.
    The 'finally' block ensures the session is closed cleanly, even if an error occurs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()