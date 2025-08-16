from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import time
import re
import PyPDF2
import io
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ResumeCustomizeRequest(BaseModel):
    resume_text: str
    job_description: str
    session_id: Optional[str] = None

class ResumeCustomizeResponse(BaseModel):
    customized_resume: str
    improvements: List[str]
    keywords_added: List[str]
    processing_time: float
    session_id: str

class PDFExtractionResponse(BaseModel):
    extracted_text: str
    filename: str
    page_count: int

class ProcessingHistory(BaseModel):
    session_id: str
    original_resume_preview: str  # First 500 chars
    job_title: str
    processing_time: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    keywords_added: List[str]


# Initialize OpenAI client
def create_llm_chat(session_id: str) -> LlmChat:
    """Create an LLM chat instance with OpenAI GPT-4o"""
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")
    
    system_message = """You are an expert ATS resume optimization specialist with deep knowledge of Applicant Tracking Systems and recruiting best practices. Your task is to analyze a resume against a specific job description and rewrite the resume to maximize ATS compatibility and hiring manager appeal while maintaining complete truthfulness.

Key Guidelines:
1. Add relevant keywords naturally throughout the resume
2. Restructure experience to highlight matching skills and responsibilities
3. Keep all information truthful - never fabricate experience, skills, or achievements
4. Use ATS-friendly formatting (no tables, proper headings, standard fonts)
5. Tailor the summary/objective to match the role requirements
6. Quantify achievements where possible and relevant
7. Ensure proper keyword density without keyword stuffing
8. Use action verbs and industry-standard terminology
9. Maintain professional formatting and readability
10. Focus on accomplishments rather than just duties

Your response should be ONLY the optimized resume text, formatted professionally and ready for both ATS scanning and human review."""
    
    chat = LlmChat(
        api_key=api_key,
        session_id=session_id,
        system_message=system_message
    ).with_model("openai", "gpt-4o")
    
    return chat


def extract_pdf_text(pdf_content: bytes) -> tuple[str, int]:
    """Extract text from PDF content"""
    try:
        pdf_file = io.BytesIO(pdf_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text() + "\n"
        
        page_count = len(pdf_reader.pages)
        return text_content.strip(), page_count
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract PDF text: {str(e)}")


def extract_job_title(job_description: str) -> str:
    """Extract job title from job description"""
    lines = job_description.strip().split('\n')[:5]  # Check first 5 lines
    
    for line in lines:
        line = line.strip()
        if len(line) > 5 and len(line) < 100:  # Reasonable job title length
            # Check if it looks like a job title (not a full sentence)
            if not line.endswith('.') and not line.startswith('http'):
                return line
    
    return "Unknown Position"


def analyze_improvements(original_resume: str, customized_resume: str, job_description: str) -> tuple[List[str], List[str]]:
    """Analyze improvements made and keywords added"""
    
    # Mock analysis for now - in a real implementation, you might use NLP to detect changes
    improvements = [
        "Enhanced professional summary to align with job requirements",
        "Restructured experience section to highlight relevant skills",
        "Added industry-specific keywords for ATS optimization",
        "Improved action verbs and quantified achievements",
        "Optimized formatting for ATS compatibility"
    ]
    
    # Extract potential keywords from job description
    job_words = set(re.findall(r'\b[A-Za-z]{3,}\b', job_description.lower()))
    common_keywords = [
        'react', 'node.js', 'javascript', 'python', 'aws', 'docker', 
        'kubernetes', 'api', 'database', 'agile', 'scrum', 'git'
    ]
    
    keywords_added = [kw for kw in common_keywords if kw in job_words][:8]
    
    return improvements, keywords_added


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "ATS Resume Customization Agent API"}


@api_router.post("/extract-pdf", response_model=PDFExtractionResponse)
async def extract_pdf(file: UploadFile = File(...)):
    """Extract text from uploaded PDF file"""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        content = await file.read()
        extracted_text, page_count = extract_pdf_text(content)
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
        
        return PDFExtractionResponse(
            extracted_text=extracted_text,
            filename=file.filename,
            page_count=page_count
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")


@api_router.post("/customize-resume", response_model=ResumeCustomizeResponse)
async def customize_resume(request: ResumeCustomizeRequest):
    """Customize resume based on job description using OpenAI GPT"""
    start_time = time.time()
    session_id = request.session_id or str(uuid.uuid4())
    
    if not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty")
    
    if not request.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty")
    
    try:
        # Create OpenAI chat instance
        chat = create_llm_chat(session_id)
        
        # Prepare the prompt
        user_prompt = f"""RESUME:
{request.resume_text}

JOB DESCRIPTION:
{request.job_description}

Please optimize this resume for the above job description. Follow the guidelines provided in the system message and return ONLY the optimized resume text, formatted professionally and ready for ATS scanning."""
        
        user_message = UserMessage(text=user_prompt)
        
        # Get AI response
        ai_response = await chat.send_message(user_message)
        customized_resume = ai_response.strip()
        
        # Analyze improvements and keywords
        improvements, keywords_added = analyze_improvements(
            request.resume_text, 
            customized_resume, 
            request.job_description
        )
        
        processing_time = time.time() - start_time
        
        # Save processing history
        try:
            job_title = extract_job_title(request.job_description)
            history_entry = ProcessingHistory(
                session_id=session_id,
                original_resume_preview=request.resume_text[:500],
                job_title=job_title,
                processing_time=processing_time,
                keywords_added=keywords_added
            )
            await db.processing_history.insert_one(history_entry.dict())
        except Exception as e:
            # Don't fail the request if history save fails
            logging.warning(f"Failed to save processing history: {e}")
        
        return ResumeCustomizeResponse(
            customized_resume=customized_resume,
            improvements=improvements,
            keywords_added=keywords_added,
            processing_time=round(processing_time, 2),
            session_id=session_id
        )
        
    except Exception as e:
        logging.error(f"Resume customization failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to customize resume: {str(e)}")


@api_router.get("/history/{session_id}")
async def get_processing_history(session_id: str):
    """Get processing history for a session"""
    try:
        history = await db.processing_history.find(
            {"session_id": session_id}
        ).sort("created_at", -1).limit(10).to_list(10)
        
        if not history:
            return {
                "session_id": session_id,
                "processing_count": 0,
                "last_processed": None,
                "recent_customizations": []
            }
        
        return {
            "session_id": session_id,
            "processing_count": len(history),
            "last_processed": history[0]["created_at"],
            "recent_customizations": [
                {
                    "job_title": item["job_title"],
                    "processing_time": item["processing_time"],
                    "keywords_added": item["keywords_added"],
                    "created_at": item["created_at"]
                }
                for item in history
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")


# Legacy endpoints for backward compatibility
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()