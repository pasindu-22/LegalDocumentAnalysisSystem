from fastapi import FastAPI # type: ignore
# from app.routers import chat
from routers import docAnalysis
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
# app.include_router(chat.router)
app.include_router(docAnalysis.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
