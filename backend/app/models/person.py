from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship as sa_relationship
from app.db.base import Base

class Person(Base):
    __tablename__ = "persons"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    # Keep column name aligned with existing DB schema and Pydantic models
    relationship = Column(String, nullable=False)
    preferred_language = Column(String, nullable=False)
    speaking_style = Column(String, nullable=True)
    voice_profile_path = Column(String, nullable=True)
    memories = sa_relationship("Memory", back_populates="person")
