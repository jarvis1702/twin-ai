from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base

class EmbeddingMetadata(Base):
    __tablename__ = "embeddings_metadata"
    id = Column(Integer, primary_key=True, index=True)
    memory_id = Column(Integer, ForeignKey("memories.id"), nullable=False)
    vector_id = Column(String, nullable=False)
    person_id = Column(Integer, ForeignKey("persons.id"), nullable=False)
