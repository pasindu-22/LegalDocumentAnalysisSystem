from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.user import User
from services.security import hash_password, verify_password, create_access_token
from dependencies.auth import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from db import get_session
from pydantic import BaseModel, EmailStr
from dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

class UserRegistration(BaseModel):
    username: str
    email: EmailStr
    password: str
    confirm_password: str  # Optional: for password validation

@router.post("/register")
def register(registration_data: UserRegistration, db: Session = Depends(get_session)):
    if registration_data.password != registration_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = db.exec(select(User).where(User.email == registration_data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=registration_data.username,
        email=registration_data.email,
        password_hash=hash_password(registration_data.password),
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"msg": "User registered"}

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_session)):
    user = db.exec(select(User).where(User.username == form.username)).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def read_user(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "email": user.email,
        "username": user.username,
        "role": user.role,
        "created_at": user.created_at
    }
