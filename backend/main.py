from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat # Import your router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# This replaces your old @app.post("/chat")
app.include_router(chat.router)

@app.get("/")
def home():
    return {"message": "NexChakra Backend Running"}