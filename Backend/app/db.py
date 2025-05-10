from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text
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
    # Connect directly to PostgreSQL to drop database with CASCADE option
    with engine.begin() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE;"))
        conn.execute(text("CREATE SCHEMA public;"))
        conn.execute(text("GRANT ALL ON SCHEMA public TO postgres;"))
        conn.execute(text("GRANT ALL ON SCHEMA public TO public;"))
    
    # Now recreate all tables from SQLModel metadata
    SQLModel.metadata.create_all(engine)

# Only create tables if script is run directly
if __name__ == "__main__":
    create_db_and_tables()
    print("Tables created successfully.")
