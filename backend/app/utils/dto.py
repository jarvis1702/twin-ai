# Simple DTO helpers for consistent JSON responses
from typing import Any, Dict

def success_response(data: Any) -> Dict:
    return {"success": True, "data": data}

def error_response(message: str) -> Dict:
    return {"success": False, "error": message}
