from fastapi import APIRouter, Depends, HTTPException
from app.db.session import SessionLocal
from sqlalchemy.orm import Session
from app.services.rag import retrieve_memories

from app.prompts import templates
from app.models.person import Person
from app.models.memory import Memory
from app.models.chat import Chat
from app.schemas.chat import ChatOut, ChatCreate
from app.services.llm import generate_llm_response
from typing import Any, List

router = APIRouter(prefix="/chat", tags=["Chat"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/general")
def general_chat(query: str):
    prompt = templates.general_chat + f"\nUser: {query}\nAI:"
    response = generate_llm_response(prompt)
    return {"response": response}


@router.post("/person/{person_id}")
def person_chat(person_id: int, query: str, db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    memories = retrieve_memories(person_id, query, db)
    prompt = templates.person_chat.format(
        person_name=person.name,
        relationship=person.relationship,
        preferred_language=person.preferred_language,
        speaking_style=person.speaking_style or "neutral"
    )
    prompt += f"\nRelevant memories: {[m.content for m in memories]}\nUser: {query}\n{person.name}:"
    response = generate_llm_response(prompt)
    return {"response": response}


@router.post("/history", response_model=ChatOut)
def save_chat(chat: ChatCreate, db: Session = Depends(get_db)):
    db_chat = Chat(**chat.dict())
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat


@router.get("/history", response_model=List[ChatOut])
def get_chat_history(db: Session = Depends(get_db)):
    return db.query(Chat).all()


@router.delete("/history/{chat_id}")
def delete_chat(chat_id: int, db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    db.delete(chat)
    db.commit()
    return {"detail": "Chat deleted"}
