from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import models
import os

# Load environment variables
load_dotenv()

# Database URL from .env
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Dependency for FastAPI routes
def get_session():
    with Session(engine) as session:
        yield session

# Function to create DB tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Only create tables if script is run directly
if __name__ == "__main__":
    create_db_and_tables()
    print("✅ Tables created successfully.")
