from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import models
import os

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Dependency for FastAPI routes
def get_session():
    with Session(engine) as session:
        yield session

# Function to create DB tables
def create_db_and_tables():
    SQLModel.metadata.drop_all(engine) 
    SQLModel.metadata.create_all(engine)

# Only create tables if script is run directly
if __name__ == "__main__":
    create_db_and_tables()
    print("Tables created successfully.")
