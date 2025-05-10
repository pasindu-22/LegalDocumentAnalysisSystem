from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime, timezone

class Document(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    title: str
    content: str
    type: str
    language: Optional[str] = "en"
    status: str = "uploaded"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ethereum_tx: Optional[str]

    user: Optional["User"] = Relationship(back_populates="documents")
    predictions: List["CasePrediction"] = Relationship(back_populates="document")
