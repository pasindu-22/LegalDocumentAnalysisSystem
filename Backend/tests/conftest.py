import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db import Base, get_db
from app.main import app

# Create test database
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Set up test database
Base.metadata.create_all(bind=engine)

@pytest.fixture
def test_db():
    # Create test database tables
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    try:
        yield db
    finally:
        db.close()
        
    # Optionally teardown tables after test
    # Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(test_db):
    # Override get_db dependency to use test database
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def test_user():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!"
    }

@pytest.fixture
def authenticated_client(client, test_user):
    # Register user
    client.post("/auth/register", json=test_user)
    
    # Login and get token
    response = client.post(
        "/auth/login", 
        data={"username": test_user["email"], "password": test_user["password"]}
    )
    token = response.json()["access_token"]
    
    # Create client with authentication headers
    client.headers = {"Authorization": f"Bearer {token}"}
    return client