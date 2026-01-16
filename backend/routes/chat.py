import os
import re
import smtplib
from email.mime.text import MIMEText
from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from data.db import SessionLocal
from models.lead import Lead
from sqlalchemy.exc import IntegrityError

load_dotenv()
router = APIRouter(prefix="/chat")
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

NEXCHAKRA_SUMMARY = """
NexChakra is a premium digital transformation agency specializing in high-end Digital Systems & Workflows. 
Primary focus: Healthcare, Education, Legal, and Hospitality.
Philosophy: 'Namaste'—warm partnership with world-class engineering.
"""

INDUSTRY_SOLUTIONS = {
    "Healthcare": "Namaste! 🙏 NexChakra specializes in HIPAA-compliant patient management portals and automated appointment systems. Ready to see the demo?",
    "Education": "Namaste! 🎓 For institutions, we build automated student enrollment workflows and digital learning management systems. Shall I show you the demo?",
    "Legal": "Namaste! ⚖️ We provide secure document automation and AI-assisted case research tools. Interested in a quick look?",
    "Hospitality": "Namaste! 🏨 Our systems automate guest check-in/out and real-time inventory management. Want to see how it looks?",
}

class ChatInput(BaseModel):
    message: str
    is_button: bool = False

def send_email_alert(lead_email, context):
    """Sends an immediate email notification to the admin."""
    try:
        msg = MIMEText(f"Namaste Team!\n\nA new lead has been captured via NexChakra AI:\nEmail: {lead_email}\nMessage: {context}")
        msg['Subject'] = f"🚀 New NexChakra Lead: {lead_email}"
        msg['From'] = SENDER_EMAIL
        msg['To'] = ADMIN_EMAIL

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"Email Alert Failed: {e}")

@router.post("")
async def handle_hybrid_chat(data: ChatInput):
    msg_raw = data.message.strip()
    msg_lower = msg_raw.lower()

    
    emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', msg_raw)
    if emails:
        db = SessionLocal()
        try:
            new_lead = Lead(email=emails[0], message_context=msg_raw)
            db.add(new_lead)
            db.commit()
            
            send_email_alert(emails[0], msg_raw) 
            response_text = f"Namaste! 🙏 I have received your email ({emails[0]}). I've alerted our team for immediate contact. A senior consultant will reach out to you shortly!"
        except IntegrityError:
            db.rollback()
            response_text = f"Namaste! 🙏 We already have your email ({emails[0]}) on file. Our team is already preparing to reach out to you!"
        finally:
            db.close()
            
        return {"text": response_text, "intent": "lead_captured", "buttons": ["Healthcare", "Education", "Legal"]}

    
    if any(x in msg_lower for x in ["contact", "expert", "call", "help"]) or msg_raw == "Contact Expert ⚡":
        return {
            "text": "Namaste! 🙏 Our experts are ready to assist. Would you like to visit our official Contact Page or just leave your email here for an immediate call back?",
            "intent": "contact_offer",
            "buttons": ["Visit Contact Page", "Leave Email", "Main Menu"]
        }

    
    if data.is_button and msg_raw in INDUSTRY_SOLUTIONS:
        return {"text": INDUSTRY_SOLUTIONS[msg_raw], "intent": "solution_offer", "buttons": ["Yes, show demo", "No, just browsing"]}

    
    if any(x in msg_lower for x in ["yes", "show demo", "sure", "tell me more"]):
        return {"text": "Namaste! 🙏 Excellent choice. Redirecting you to our digital systems demo portal now.", "intent": "redirect_demo", "buttons": ["Contact Expert ⚡"]}

    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": f"You are the NexChakra partner. Always start with 'Namaste'. Max 2 sentences. Identity: {NEXCHAKRA_SUMMARY}."}, {"role": "user", "content": msg_raw}],
            temperature=0.5
        )
        return {"text": completion.choices[0].message.content, "intent": "general", "buttons": ["Healthcare", "Education", "Contact Expert ⚡"]}
    except Exception:
        return {"text": "Namaste! Syncing... How can I help you explore NexChakra?", "intent": "error", "buttons": ["Contact Expert ⚡"]}