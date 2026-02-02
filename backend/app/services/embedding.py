from sentence_transformers import SentenceTransformer
from typing import List

import os

# Define local cache path to avoid E: drive issues
CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../model_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

# Load the model (downloads automatically if not found)
model = SentenceTransformer('sentence-transformers/multi-qa-MiniLM-L6-cos-v1', cache_folder=CACHE_DIR)

def get_embedding(text: str) -> List[float]:
    return model.encode([text])[0].tolist()
