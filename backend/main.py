from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat 
from data.db import init_db  # Import the initialization function

# Initialize the database and create nexchakra_leads.db
init_db() 

app = FastAPI(title="NexChakra AI Backend")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)

@app.get("/")
def home():
    return {"message": "Namaste! NexChakra Backend is running and Database is active."}