import pytest

def test_register_user(client, test_user):
    # Test user registration
    response = client.post("/auth/register", json=test_user)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["email"] == test_user["email"]

def test_login_user(client, test_user):
    # Register first
    client.post("/auth/register", json=test_user)
    
    # Test login
    response = client.post(
        "/auth/login", 
        data={"username": test_user["email"], "password": test_user["password"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"

def test_access_protected_route(authenticated_client):
    # Test accessing a protected route with authentication
    response = authenticated_client.get("/users/me")
    assert response.status_code == 200
    data = response.json()
    assert "email" in data
    assert data["email"] == "test@example.com"

def test_invalid_login(client):
    # Test login with invalid credentials
    response = client.post(
        "/auth/login", 
        data={"username": "wrong@example.com", "password": "WrongPassword"}
    )
    assert response.status_code == 401
    data = response.json()
    assert "detail" in data