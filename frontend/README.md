# NexChakra AI Assistant 🚀

NexChakra is a premium digital transformation assistant specializing in high-end Digital Systems & Workflows for Healthcare, Education, Legal, and Hospitality sectors. This project features a **Next.js** frontend and a **FastAPI** backend with integrated **SQLite lead storage**, **Groq AI** conversation, and **SMTP email alerts**.

---

## 🛠️ Tech Stack
* **Frontend**: Next.js 14, Tailwind CSS, Lucide React.
* **Backend**: FastAPI (Python), SQLAlchemy ORM.
* **AI Engine**: Groq (Llama 3.3 70B Model).
* **Database**: SQLite (stored locally as `nexchakra_leads.db`).

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)
Navigate to the `backend` folder and install the required Python packages:

```bash
cd backend
pip install fastapi uvicorn groq python-dotenv sqlalchemy

# AI API Key
GROQ_API_KEY=your_groq_api_key_here

# Email Alert Configuration (Gmail SMTP)
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-google-app-password
ADMIN_EMAIL=supervisor-email@gmail.com

---


## 2.. Frontend setup 
cd frontend
npm install
npm run dev