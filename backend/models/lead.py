from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from data.db import Base # We will create data/db.py next

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    industry_interest = Column(String, nullable=True)
    message_context = Column(String, nullable=True) # Stores the text that triggered the capture
    created_at = Column(DateTime(timezone=True), server_default=func.now())