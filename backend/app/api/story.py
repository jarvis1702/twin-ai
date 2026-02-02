from fastapi import APIRouter, Depends, HTTPException
from app.db.session import SessionLocal
from sqlalchemy.orm import Session

from app.prompts import templates
from app.models.person import Person
from app.services.rag import retrieve_memories
from app.services.llm import generate_llm_response
from typing import Literal

router = APIRouter(prefix="/story", tags=["Story"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/person/{person_id}")
def person_story(person_id: int, story_type: Literal["bedtime", "happy", "emotional"] = "bedtime", db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    memories = retrieve_memories(person_id, "story", db)
    if story_type == "bedtime":
        prompt = templates.bedtime_story
    elif story_type == "happy":
        prompt = templates.storytelling
    else:
        prompt = templates.emotional_comfort
    prompt += f"\nRelevant memories: {[m.content for m in memories]}\n"
    story = generate_llm_response(prompt)
    return {"story": story}


@router.post("/all")
def all_story(story_type: Literal["bedtime", "happy", "emotional"] = "bedtime"):
    # Placeholder: Aggregate all persons' memories
    prompt = templates.bedtime_story if story_type == "bedtime" else templates.storytelling
    story = generate_llm_response(prompt)
    return {"story": story}
