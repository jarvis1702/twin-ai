import whisper
from fastapi import UploadFile
import tempfile

model = whisper.load_model("base")

def transcribe_audio(file: UploadFile, language: str = None) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name
    result = model.transcribe(tmp_path, language=language)
    return result["text"]
