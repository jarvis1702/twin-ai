from pydantic import BaseModel
from typing import Optional

class STTRequest(BaseModel):
    language: Optional[str] = None

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = None
    language: Optional[str] = None
