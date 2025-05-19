from fastapi import FastAPI, Depends
from sqlmodel import Session, select
from db import engine, get_session
from routers import auth,documents,predict,chat,docAnalysis,verify
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(debug=True,title="Legal-AI")

origins = [
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# @app.get("/test-db")
# def test_db_connection(session: Session = Depends(get_session)):
#     try:
#         session.exec(select(1))
#         return {"message":  Database connection successful!"}
#     except Exception as e:
#         return {"message":  Database connection failed", "error": str(e)}

app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(predict.router)
app.include_router(chat.router)
app.include_router(docAnalysis.router)
app.include_router(verify.router)
