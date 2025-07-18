from fastapi import FastAPI
from pydantic import BaseModel

import json
import os

app = FastAPI()

class EnhanceRequest(BaseModel):
    section: str
    content: str

class SaveResumeRequest(BaseModel):
    resume: dict

RESUME_FILE = "saved_resume.json"

@app.post("/ai-enhance")
def enhance_section(request: EnhanceRequest):
    print("Received:", request.dict())
    improved = f"[Improved] {request.content}"
    return {"enhanced": improved}

@app.post("/save-resume")
def save_resume(request: SaveResumeRequest):
    with open(RESUME_FILE, "w") as f:
        json.dump(request.resume, f, indent=2)
    return {"message": "Resume saved successfully"}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specific: ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
