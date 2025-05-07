from models import SQLModel, Field, UUID, uuid4, List, Relationship, datetime,timezone, Optional


class CasePrediction(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    document_id: UUID = Field(foreign_key="document.id")
    prediction_label: str
    confidence_score: float
    predicted_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    document: Optional["Document"] = Relationship(back_populates="predictions")
