from pydantic import BaseModel
from typing import Optional

class PersonBase(BaseModel):
    name: str
    relationship: str
    preferred_language: str
    speaking_style: Optional[str] = None
    voice_profile_path: Optional[str] = None

class PersonCreate(PersonBase):
    pass

class PersonUpdate(PersonBase):
    pass

class PersonOut(PersonBase):
    id: int

    class Config:
        orm_mode = True
