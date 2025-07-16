from fastapi import FastAPI
from pydantic import BaseModel

import json
import os

app = FastAPI()

# Models
class EnhanceRequest(BaseModel):
    section: str
    content: str

class SaveResumeRequest(BaseModel):
    resume: dict

