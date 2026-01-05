from fastapi import FastAPI

app = FastAPI(title="NexChakra Chatbot Backend")

@app.get("/")
def read_root():
    return {"message": "Hello, NexChakra Chatbot is running!"}
