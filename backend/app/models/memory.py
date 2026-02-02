from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.db.base import Base
from sqlalchemy.orm import relationship
import datetime

class Memory(Base):
    __tablename__ = "memories"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    emotion_tag = Column(String, nullable=True)
    file_path = Column(String, nullable=True)
    person_id = Column(Integer, ForeignKey("persons.id"), nullable=False)
    content = Column(String, nullable=True)
    person = relationship("Person", back_populates="memories")
