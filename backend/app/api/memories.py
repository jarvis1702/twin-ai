from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.schemas.memory import MemoryCreate, MemoryOut
from app.models.memory import Memory
from app.db.session import SessionLocal
from typing import List, Optional
from datetime import datetime
import shutil
import os

router = APIRouter(prefix="/memory", tags=["Memories"])

UPLOAD_DIR = "uploads"  # You may want to move this to config
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload", response_model=MemoryOut)
def upload_memory(
    type: str,
    person_id: int,
    emotion_tag: Optional[str] = None,
    file: Optional[UploadFile] = File(None),
    content: Optional[str] = None,
    db: Session = Depends(get_db),
):
    file_path = None
    if file:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    memory = Memory(
        type=type,
        person_id=person_id,
        emotion_tag=emotion_tag,
        file_path=file_path,
        content=content,
        timestamp=datetime.utcnow()
    )
    db.add(memory)
    db.commit()
    db.refresh(memory)
    return memory

@router.get("/person/{person_id}", response_model=List[MemoryOut])
def get_memories_for_person(person_id: int, db: Session = Depends(get_db)):
    return db.query(Memory).filter(Memory.person_id == person_id).all()

@router.delete("/{memory_id}")
def delete_memory(memory_id: int, db: Session = Depends(get_db)):
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    if memory.file_path and os.path.exists(memory.file_path):
        os.remove(memory.file_path)
    db.delete(memory)
    db.commit()
    return {"detail": "Memory deleted"}
