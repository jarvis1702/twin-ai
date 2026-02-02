# Personal Memory Vault & Digital Twin System

## Backend (FastAPI)

### Features
- Person management (CRUD)
- Modular, clean architecture
- SQLite + SQLAlchemy ORM
- CORS enabled for frontend
- Ready for memory, chat, RAG, and voice modules

### Folder Structure
```
backend/
  app/
    api/           # API routers
    core/          # Core logic (business rules)
    db/            # Database setup
    models/        # SQLAlchemy models
    schemas/       # Pydantic schemas
    services/      # Service layer
    utils/         # Utilities/helpers
    prompts/       # Prompt templates
    voice/         # Voice features
    vectorstore/   # Vector memory (RAG)
    main.py        # FastAPI app entrypoint
```

### Quickstart

1. **Install dependencies**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install fastapi uvicorn sqlalchemy pydantic python-dotenv
   # For CORS:
   pip install fastapi[all]
   ```

2. **Run the server**
   ```bash
   uvicorn app.main:app --reload
   ```

3. **API Example: Create Person**
   ```json
   POST /persons
   {
     "name": "Arun",
     "relationship": "Father",
     "preferred_language": "tanglish",
     "speaking_style": "gentle",
     "voice_profile_path": null
   }
   ```

4. **API Example: List Persons**
   ```json
   GET /persons
   [
     {
       "id": 1,
       "name": "Arun",
       "relationship": "Father",
       "preferred_language": "tanglish",
       "speaking_style": "gentle",
       "voice_profile_path": null
     }
   ]
   ```

---

- Extend by adding new routers/services in `app/`
- All code is modular and ready for further features
