# LLM integration using free/open-source models (e.g., Ollama, LM Studio, or local Llama.cpp)
# This example uses the 'ollama' Python package for local Llama2/3, Mistral, etc.
# You can swap this for any local inference server or API.

import requests
import os
from typing import Optional

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")  # Updated to match installed model

def generate_llm_response(prompt: str, model: Optional[str] = None) -> str:
    url = f"{OLLAMA_BASE_URL}/api/generate"
    payload = {
        "model": model or OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }
    try:
        resp = requests.post(url, json=payload, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        # Robust parsing for various Ollama/LLM response shapes
        if isinstance(data, dict):
            if "response" in data and isinstance(data["response"], str):
                return data["response"]
            if "results" in data and isinstance(data["results"], list):
                parts = []
                for item in data["results"]:
                    # item may contain 'content' as list/dict/str or 'text'
                    if isinstance(item, dict):
                        content = item.get("content")
                        if isinstance(content, str):
                            parts.append(content)
                        elif isinstance(content, list):
                            for c in content:
                                if isinstance(c, dict) and "text" in c:
                                    parts.append(c["text"])
                                elif isinstance(c, str):
                                    parts.append(c)
                        elif "text" in item and isinstance(item["text"], str):
                            parts.append(item["text"])
                if parts:
                    return "".join(parts)
            if "choices" in data and isinstance(data["choices"], list) and data["choices"]:
                first = data["choices"][0]
                if isinstance(first, dict) and "text" in first:
                    return first["text"]
        return "[LLM error: unexpected response format]"
    except Exception as e:
        return f"[LLM error: {e}]"
