from sqlmodel import SQLModel, Field, Relationship
from typing import List
from uuid import UUID, uuid4
from datetime import datetime, timezone

class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str
    email: str = Field(unique=True)
    password_hash: str
    role: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    documents: List["Document"] = Relationship(back_populates="user")
    chat_queries: List["ChatQuery"] = Relationship(back_populates="user")
