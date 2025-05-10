from sqlmodel import SQLModel, Field, Relationship
from pgvector.sqlalchemy import VECTOR
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime, timezone

from .user import User
from .document import Document
from .case_predictions import CasePrediction
from .chat_query import ChatQuery

