from pydantic import BaseModel
from datetime import datetime

class ChatBase(BaseModel):
    user_message: str
    bot_response: str

class ChatCreate(ChatBase):
    pass

class ChatOut(ChatBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True