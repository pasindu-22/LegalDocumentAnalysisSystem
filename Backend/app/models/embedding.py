from . import SQLModel, Field, UUID, uuid4, List, Relationship, datetime,timezone, VECTOR,Optional
from sqlalchemy import Column


class DocumentEmbedding(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    document_id: UUID = Field(foreign_key="document.id")
    chunk_id: Optional[int]
    chunk_text: str
    embedding: List[float] = Field(sa_column=Column(VECTOR(768))) # 768 for BERT-base etc.
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    document: Optional["Document"] = Relationship(back_populates="embeddings")

