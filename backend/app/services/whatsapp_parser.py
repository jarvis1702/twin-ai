import re
from typing import List, Dict, Any
from datetime import datetime

def parse_whatsapp_txt(file_path: str) -> List[Dict[str, Any]]:
    """
    Parse WhatsApp exported .txt file and extract messages.
    Returns a list of dicts: {timestamp, speaker, message}
    """
    pattern = re.compile(r"^(\d{1,2}/\d{1,2}/\d{2,4}), (\d{1,2}:\d{2}) - (.*?): (.*)$")
    messages = []
    with open(file_path, encoding="utf-8") as f:
        for line in f:
            match = pattern.match(line)
            if match:
                date_str, time_str, speaker, message = match.groups()
                try:
                    timestamp = datetime.strptime(f"{date_str} {time_str}", "%d/%m/%y %H:%M")
                except ValueError:
                    try:
                        timestamp = datetime.strptime(f"{date_str} {time_str}", "%d/%m/%Y %H:%M")
                    except Exception:
                        timestamp = None
                messages.append({
                    "timestamp": timestamp,
                    "speaker": speaker,
                    "message": message.strip()
                })
    return messages
