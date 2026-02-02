# Base interface for vector store
from typing import List, Any

class VectorStoreBase:
    def add_embedding(self, person_id: int, embedding: List[float], metadata: dict) -> str:
        raise NotImplementedError

    def query(self, person_id: int, embedding: List[float], top_k: int = 5) -> List[Any]:
        raise NotImplementedError

    def create_index(self, person_id: int):
        raise NotImplementedError
