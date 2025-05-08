from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = "b404c4527931ad48d051e9ef84a3852c8637b41f964c02482fc53bbd27906701e3db9c3e70b4df3475ff7c7357789967a0dd74a0b6fc070e2656f20a0663c42b54ce3881d5db1b0ec32ac48084f6285725fc402c4c96677154afd9f96039d3118c532ef9f075bd1d768e6abfaf143960dc6ec7389ad2f85b7bfe8ace36244d1a8bb397d6434919086b833845617c3ebe5a6478d57073e3647d120313e729692e936c65ed0a6a7f3d2577088c7af8c73ece95574b3cc5dd22e54f1f13e1e95a7448a6d5acb0999fcc0669441d6c3c59af5b1ef350f4b2a43ce7733464af0aca34b35420fd6cd20a4b2633da89ee25b66771f513818e25655957b5f4de7be835cd"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
