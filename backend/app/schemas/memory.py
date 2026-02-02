from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MemoryBase(BaseModel):
    type: str
    timestamp: Optional[datetime] = None
    emotion_tag: Optional[str] = None
    file_path: Optional[str] = None
    person_id: int
    content: Optional[str] = None

class MemoryCreate(MemoryBase):
    pass

class MemoryOut(MemoryBase):
    id: int
    class Config:
        orm_mode = True
