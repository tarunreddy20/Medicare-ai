import logging
import os
import time
import uuid

import chromadb

logger = logging.getLogger(__name__)

_db_path = os.getenv(
    "CHROMA_DB_PATH",
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db")
)

_client = chromadb.PersistentClient(path=_db_path)
_collection = _client.get_or_create_collection(name="medical_chat_history")


def add_chat_message(user_id: str, specialty: str, sender: str, text: str) -> None:
    metadata = {
        "user_id": user_id,
        "specialty": specialty,
        "sender": sender,
        "timestamp": int(time.time() * 1000),
    }

    _collection.add(
        ids=[str(uuid.uuid4())],
        documents=[text],
        metadatas=[metadata],
    )


def get_chat_history(user_id: str, specialty: str, limit: int = 50) -> list[dict[str, str]]:
    try:
        result = _collection.get(
            where={
                "$and": [
                    {"user_id": user_id},
                    {"specialty": specialty},
                ]
            },
            include=["documents", "metadatas"],
        )

        documents = result.get("documents") or []
        metadatas = result.get("metadatas") or []

        rows: list[dict[str, object]] = []
        for document, metadata in zip(documents, metadatas):
            if not metadata:
                continue
            rows.append(
                {
                    "sender": str(metadata.get("sender", "bot")),
                    "text": str(document or ""),
                    "timestamp": int(metadata.get("timestamp", 0)),
                }
            )

        rows.sort(key=lambda item: int(item["timestamp"]))
        recent = rows[-limit:]
        return [{"sender": str(item["sender"]), "text": str(item["text"])} for item in recent]
    except Exception as exc:
        logger.error("Failed to read history from ChromaDB: %s", exc, exc_info=True)
        return []
