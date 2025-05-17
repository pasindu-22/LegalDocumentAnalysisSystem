from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlmodel import Session, select
from db import get_session
from models.user import User
from services.security import SECRET_KEY, ALGORITHM
from uuid import UUID

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)) -> User:
#     credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_id = payload.get("sub")
#         if not user_id:
#             raise credentials_exception
#         #user = db.exec(select(User).where(User.id == user_id)).first()
#         user = db.exec(select(User).where(User.id == UUID(user_id))).first()

#         if not user:
#             raise credentials_exception
#         return user
#     except :
#         raise credentials_exception

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise credentials_exception

        try:
            user_uuid = UUID(user_id)
        except ValueError:
            raise credentials_exception

        user = db.exec(select(User).where(User.id == user_uuid)).first()
        if not user:
            raise credentials_exception

        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail=f"JWT decode error: {str(e)}")
    except Exception as e:
        print("Unexpected error in get_current_user:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
