from fastapi import FastAPI # type: ignore
from app.routers import chat

app = FastAPI()
app.include_router(chat.router)
