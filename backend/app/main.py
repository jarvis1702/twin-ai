from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import persons
from app.db.base import Base
from app.db.session import engine

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Memory Vault & Digital Twin System")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    # Explicitly allow Vite dev origins
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(persons.router)

# Import and include memory router
from app.api import memories, whatsapp, chat, story
app.include_router(memories.router)
app.include_router(whatsapp.router)
app.include_router(chat.router)
app.include_router(story.router)
app.include_router(story.router)
# app.include_router(voice.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the API"}

@app.get("/favicon.ico")
def favicon():
    return {"detail": "Favicon not available"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
