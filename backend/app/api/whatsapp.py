from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.services.whatsapp_parser import parse_whatsapp_txt
from app.models.memory import Memory
from app.db.session import SessionLocal
from sqlalchemy.orm import Session
from datetime import datetime
import os
import shutil

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])

UPLOAD_DIR = "uploads"  # Use same as memory
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/parse")
def parse_whatsapp(file: UploadFile = File(...), person_id: int = None, db: Session = Depends(get_db)):
    if not person_id:
        raise HTTPException(status_code=400, detail="person_id required")
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    messages = parse_whatsapp_txt(file_path)
    created = 0
    for msg in messages:
        memory = Memory(
            type="whatsapp_chat",
            timestamp=msg["timestamp"] or datetime.utcnow(),
            person_id=person_id,
            content=f"{msg['speaker']}: {msg['message']}"
        )
        db.add(memory)
        created += 1
    db.commit()
    return {"detail": f"{created} messages imported as memories"}
