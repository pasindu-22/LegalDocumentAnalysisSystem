from models import SQLModel, Field, UUID, uuid4, List, Relationship, datetime,timezone,Optional


class ChatQuery(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: Optional[UUID] = Field(default=None, foreign_key="user.id")
    question: str
    response: str
    query_type: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    user: Optional["User"] = Relationship(back_populates="chat_queries")
