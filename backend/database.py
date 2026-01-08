import os
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Use SQLite locally, but Postgres if DATABASE_URL is provided (e.g. on Render)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./posthub.db")

# Fix for Render (replace postgres:// with postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(100), default="Anonymous")
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    department = Column(String(100), nullable=False)
    status = Column(String(20), default="red") # red, yellow, green
    timestamp = Column(DateTime, default=datetime.utcnow)
    admin_reply = Column(Text, nullable=True)

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
