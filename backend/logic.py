import os
import pickle
import pandas as pd
from datetime import datetime
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Download VADER lexicon if not present
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    nltk.download('vader_lexicon')

# Initialize sentiment analyzer
sia = SentimentIntensityAnalyzer()

# Global model variable
model = None

def load_model():
    global model
    try:
        # Path to the model file relative to this file
        # logic.py is in backend/, model is in complaint_ml/
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "..", "complaint_ml", "complaint_classifier.pkl")
        
        if not os.path.exists(model_path):
            print(f"[WARNING] Model file not found at {model_path}")
            print("[INFO] To fix this, run: python complaint_ml/train_model.py")
            model = None
            return False
        
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print(f"[SUCCESS] Model loaded successfully from {model_path}")
        return True
    except Exception as e:
        print(f"[ERROR] Error loading model: {e}")
        model = None
        return False

# Load model on start
load_model()

def classify_complaint(description: str):
    """
    Uses the loaded ML model to classify the complaint.
    Falls back to 'Uncategorized' if model is not loaded.
    """
    if model:
        try:
            prediction = model.predict([description])[0]
            
            # Map detailed categories to Frontend Departments
            mapping = {
                "Delivery Delay": "Post Related Issues",
                "Lost Parcel": "Post Related Issues",
                "Damaged Item": "Post Related Issues",
                "Wrong Delivery": "Post Related Issues",
                "Staff Behavior": "Post Related Issues",
                "Appreciation": "Post Related Issues",
                "Tracking Issue": "Post Related Issues",
                
                "Refund / Compensation": "Finance",
                
                "Technical Issue": "Software Issues"
            }
            
            # Return the mapped department, or default to "Post Related Issues" if unknown
            return mapping.get(prediction, "Post Related Issues")
            
        except Exception as e:
            print(f"Prediction error: {e}")
            return "Post Related Issues" # Default fallback
    else:
        # Fallback if model failed to load
        print("Model not loaded, using fallback.")
        return "Post Related Issues"

def get_priority(description: str):
    """
    Assigns priority based on keywords AND sentiment analysis.
    Returns: "red" (urgent), "yellow" (medium), or "green" (low)
    """
    desc = description.lower()
    urgent_keywords = ["urgent", "emergency", "lost", "stolen", "immediately", "damages", "critical", "failed"]
    
    # Analyze sentiment
    sentiment_score = sia.polarity_scores(description)["compound"]
    
    # Logic: Urgent keywords OR very negative sentiment → Red
    if any(k in desc for k in urgent_keywords) or sentiment_score < -0.5:
        return "red"
    
    # Moderate negative sentiment → Yellow
    elif sentiment_score < -0.2 or len(desc) > 100:
        return "yellow"
    
    # Positive or neutral → Green
    else:
        return "green"

def get_hourly_stats(complaints: list):
    """
    Groups complaints by hour and calculates status counts.
    Returns a list of 24 hourly slots.
    """
    slots = []
    
    # Bucket complaints
    buckets = {i: [] for i in range(24)}
    
    for c in complaints:
        if hasattr(c, 'timestamp'):
            h = c.timestamp.hour
            buckets[h].append(c)
    
    # Create stats for each hour 0-23
    for i in range(24):
        slot_complaints = buckets[i]
        
        red_count = 0
        yellow_count = 0
        green_count = 0
        
        formatted_complaints = []
        
        for c in slot_complaints:
            if c.status == 'red': red_count += 1
            elif c.status == 'yellow': yellow_count += 1
            elif c.status == 'green': green_count += 1
            
            formatted_complaints.append(c)

        # Generate label
        period = 'AM' if i < 12 else 'PM'
        display_hour = 12 if i % 12 == 0 else i % 12
        next_h_raw = (i + 1)
        next_display = 12 if next_h_raw % 12 == 0 else next_h_raw % 12
        next_period = 'PM' if 12 <= next_h_raw < 24 else ('AM' if next_h_raw == 24 else period)
        
        label = f"{display_hour} {period} - {next_display} {next_period}"
        
        overall = 'green'
        if red_count > 0: overall = 'red'
        elif yellow_count > 0: overall = 'yellow'
        
        slots.append({
            "hour_label": label,
            "red": red_count,
            "yellow": yellow_count,
            "green": green_count,
            "status": overall,
            "count": len(slot_complaints),
            "complaints": formatted_complaints
        })
        
    return slots[::-1] # Reverse to match frontend display order
