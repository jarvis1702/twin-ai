from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from app.voice.whisper_stt import transcribe_audio
from app.voice.tts import synthesize_speech
from app.schemas.voice import STTRequest, TTSRequest

router = APIRouter(prefix="/voice", tags=["Voice"])

@router.post("/stt")
def speech_to_text(file: UploadFile = File(...), req: STTRequest = None):
    text = transcribe_audio(file, language=req.language if req else None)
    return {"text": text}

@router.post("/tts")
def text_to_speech(req: TTSRequest):
    audio_path = synthesize_speech(req.text, voice=req.voice, language=req.language)
    return FileResponse(audio_path, media_type="audio/wav")
