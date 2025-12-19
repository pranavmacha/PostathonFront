import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from .database import get_db, Complaint
from .logic import classify_complaint, get_priority
from pydantic import BaseModel

app = FastAPI(title="PostHub Backend")

# Enable CORS for the frontend
cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174",
)
allowed_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class ComplaintCreate(BaseModel):
    title: str
    description: str
    user_name: str = "Anonymous"

class ComplaintResponse(BaseModel):
    id: int
    title: str
    description: str
    user_name: str
    department: str
    status: str
    timestamp: datetime
    admin_reply: Optional[str] = None

    class Config:
        from_attributes = True

@app.post("/api/complaints", response_model=ComplaintResponse)
def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db)):
    # Run classification logic
    department = classify_complaint(complaint.description)
    priority = get_priority(complaint.description)
    
    db_complaint = Complaint(
        title=complaint.title,
        description=complaint.description,
        user_name=complaint.user_name,
        department=department,
        status=priority
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@app.get("/api/admin/complaints", response_model=List[ComplaintResponse])
def get_complaints(department: str = None, db: Session = Depends(get_db)):
    query = db.query(Complaint)
    if department:
        query = query.filter(Complaint.department == department)
    return query.all()

@app.patch("/api/admin/complaints/{complaint_id}")
def update_complaint_reply(complaint_id: int, reply: str, db: Session = Depends(get_db)):
    db_complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    db_complaint.admin_reply = reply
    db_complaint.status = "green" # Marking as resolved
    db.commit()
    return {"message": "Reply sent and status updated to green"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
