# BE HAPPY/backend/server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

# --- CORS Configuration ---
origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
# --------------------------

@app.get("/api/message")
def get_message():
    return {"message": "Hello from FastAPI (Clean Install)!", "status": "Ready"}