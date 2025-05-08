from fastapi import FastAPI, Depends
from sqlmodel import Session, select
from db import engine, get_session
from routers import auth,documents

app = FastAPI()

# @app.get("/test-db")
# def test_db_connection(session: Session = Depends(get_session)):
#     try:
#         session.exec(select(1))
#         return {"message": "✅ Database connection successful!"}
#     except Exception as e:
#         return {"message": "❌ Database connection failed", "error": str(e)}

app.include_router(auth.router)
app.include_router(documents.router)