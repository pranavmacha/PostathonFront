import os
import pickle
import pandas as pd
from datetime import datetime

# Global model variable
model = None

def load_model():
    global model
    try:
        # Path to the model file relative to this file
        # logic.py is in backend/, model is in complaint_ml/
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "..", "complaint_ml", "complaint_classifier.pkl")
        
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print(f"Model loaded successfully from {model_path}")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None

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
            return prediction
        except Exception as e:
            print(f"Prediction error: {e}")
            return "Uncategorized"
    else:
        # Fallback if model failed to load
        print("Model not loaded, using fallback.")
        return "Uncategorized"

def get_priority(description: str):
    """
    Assigns initial priority based on certain 'urgent' keywords.
    """
    desc = description.lower()
    urgent_keywords = ["urgent", "emergency", "lost", "stolen", "immediately", "damages", "critical", "failed"]
    
    if any(k in desc for k in urgent_keywords):
        return "red"
    
    return "yellow" if len(desc) > 50 else "red"

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
