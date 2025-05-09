from models import SQLModel, Field, UUID, uuid4, List, Relationship, datetime,timezone, Optional


class Document(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    title: str
    content: str
    type: str
    language: Optional[str] = "en"
    status: str = "uploaded"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    user: Optional["User"] = Relationship(back_populates="documents")
    embeddings: List["DocumentEmbedding"] = Relationship(back_populates="document")
    predictions: List["CasePrediction"] = Relationship(back_populates="document")
