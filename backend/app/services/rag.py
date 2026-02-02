from app.vectorstore.faiss_store import FaissVectorStore
from app.services.embedding import get_embedding
from app.models.memory import Memory
from app.db.session import SessionLocal
from sqlalchemy.orm import Session
from typing import List

vector_store = FaissVectorStore()

def add_memory_to_vector(person_id: int, memory_id: int, text: str, db: Session):
    embedding = get_embedding(text)
    vector_store.add_embedding(person_id, embedding, {"memory_id": memory_id})


def retrieve_memories(person_id: int, query: str, db: Session, top_k: int = 5) -> List[Memory]:
    embedding = get_embedding(query)
    idxs = vector_store.query(person_id, embedding, top_k)
    # Map vector idxs to memory IDs (for demo, just get latest memories)
    memories = db.query(Memory).filter(Memory.person_id == person_id).order_by(Memory.timestamp.desc()).limit(top_k).all()
    return memories
