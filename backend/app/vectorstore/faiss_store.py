import faiss
import numpy as np
import os
from typing import List, Any
from .base import VectorStoreBase

class FaissVectorStore(VectorStoreBase):
    def __init__(self, index_dir="vector_indexes"):
        self.index_dir = index_dir
        os.makedirs(self.index_dir, exist_ok=True)
        self.indexes = {}

    def _get_index_path(self, person_id):
        return os.path.join(self.index_dir, f"person_{person_id}.index")

    def create_index(self, person_id: int, dim: int = 384):
        index = faiss.IndexFlatL2(dim)
        self.indexes[person_id] = index
        faiss.write_index(index, self._get_index_path(person_id))

    def add_embedding(self, person_id: int, embedding: List[float], metadata: dict) -> str:
        index_path = self._get_index_path(person_id)
        if not os.path.exists(index_path):
            self.create_index(person_id, len(embedding))
        index = faiss.read_index(index_path)
        vec = np.array([embedding]).astype('float32')
        index.add(vec)
        faiss.write_index(index, index_path)
        # Metadata handling can be extended (e.g., save to DB)
        return str(index.ntotal - 1)

    def query(self, person_id: int, embedding: List[float], top_k: int = 5) -> List[Any]:
        index_path = self._get_index_path(person_id)
        if not os.path.exists(index_path):
            return []
        index = faiss.read_index(index_path)
        vec = np.array([embedding]).astype('float32')
        D, I = index.search(vec, top_k)
        return I[0].tolist()
