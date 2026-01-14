import os
from fastapi import APIRouter, Body
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
router = APIRouter(prefix="/chat", tags=["Chat"]) # Prefix means this handles /chat/...
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

INDUSTRIES = ["Education", "Healthcare", "Government", "Legal", "Hospitality"]

class ChatInput(BaseModel):
    message: str
    is_button: bool = False

@router.post("") # Path is effectively /chat
async def hybrid_chat(input_data: ChatInput):
    # 1. Decision Tree Layer
    if input_data.is_button and input_data.message in INDUSTRIES:
        return {
            "text": f"NexChakra provides specialized digital systems for {input_data.message}. Would you like to see a demo?",
            "buttons": ["Show Demo", "Talk to Consultant"]
        }

    # 2. AI Layer (Groq)
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are the NexChakra assistant. Promote our industry solutions."},
            {"role": "user", "content": input_data.message}
        ]
    )
    return {"text": completion.choices[0].message.content, "buttons": INDUSTRIES}