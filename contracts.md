# ATS Resume Customization Agent - API Contracts

## Backend Implementation Plan

### 1. OpenAI Integration Setup
- Install `emergentintegrations` library
- Add `EMERGENT_LLM_KEY=sk-emergent-4F1773b736f342dC8B` to backend/.env
- Use `gpt-4o` model for optimal resume analysis and customization

### 2. API Endpoints

#### POST /api/customize-resume
**Purpose**: Main endpoint to process resume and job description
**Request Body**:
```json
{
  "resume_text": "string - resume content",
  "job_description": "string - job posting content", 
  "session_id": "string - optional for tracking"
}
```
**Response**:
```json
{
  "customized_resume": "string - optimized resume text",
  "improvements": ["array of improvement descriptions"],
  "keywords_added": ["array of keywords"],
  "processing_time": "number - seconds taken",
  "session_id": "string"
}
```

#### POST /api/extract-pdf
**Purpose**: Extract text from uploaded PDF files
**Request**: Multipart form data with PDF file
**Response**:
```json
{
  "extracted_text": "string - text content from PDF",
  "filename": "string - original filename",
  "page_count": "number - total pages"
}
```

#### GET /api/history/{session_id} (Optional)
**Purpose**: Get processing history for a session
**Response**:
```json
{
  "session_id": "string",
  "processing_count": "number",
  "last_processed": "timestamp",
  "recent_customizations": ["array of recent results"]
}
```

### 3. Current Frontend Mock Data to Replace

#### In mock.js:
- `mockResume` → Real user input
- `mockJobDescription` → Real user input  
- `mockCustomizedResume` → AI-generated content
- `processResume()` function → Real API call

#### In App.js:
- Replace `processResume()` import with real API call
- Update error handling for actual API responses
- Add loading states during real processing

#### In FileUpload.jsx:
- Add real PDF processing capability
- Handle actual file upload to backend
- Real text extraction instead of mock

### 4. OpenAI Prompt Strategy

**System Message**: 
"You are an expert ATS resume optimization specialist. Your task is to analyze a resume against a specific job description and rewrite the resume to maximize ATS compatibility and relevance while maintaining truthfulness."

**User Prompt Template**:
```
RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Please optimize this resume for the above job description. Follow these guidelines:
1. Add relevant keywords naturally throughout the resume
2. Restructure experience to highlight matching skills
3. Keep all information truthful - do not fabricate experience
4. Use ATS-friendly formatting (no tables, proper headings)
5. Tailor the summary/objective to match the role
6. Quantify achievements where possible
7. Ensure proper keyword density without stuffing

Return ONLY the optimized resume text, formatted professionally and ready for ATS scanning.
```

### 5. PDF Processing Library
- Use `PyPDF2` or `pdfplumber` for text extraction
- Handle various PDF formats and layouts
- Extract clean, readable text for processing

### 6. Database Schema (Simple)
```python
# Optional - Simple processing history
class ResumeProcessing(BaseModel):
    session_id: str
    original_resume: str  # First 500 chars for reference
    job_title: str       # Extracted from job description  
    processing_time: float
    created_at: datetime
    keywords_added: List[str]
```

### 7. Error Handling
- PDF extraction failures
- OpenAI API rate limits/errors
- Large file size limits
- Invalid text content

### 8. Frontend Integration Changes
- Remove mock.js dependency from App.js
- Update FileUpload to call /api/extract-pdf for PDFs
- Replace processResume with real API call to /api/customize-resume
- Add proper error handling and loading states
- Maintain existing UI/UX flow

### 9. Implementation Priority
1. Install emergentintegrations and setup OpenAI
2. Create PDF extraction endpoint
3. Create resume customization endpoint  
4. Update frontend to use real APIs
5. Add simple processing history (optional)
6. Test end-to-end functionality