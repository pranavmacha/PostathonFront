def classify_complaint(description: str):
    """
    Keyword-based classification to simulate an ML model.
    """
    desc = description.lower()
    
    # Define keywords for each department
    post_keywords = ["parcel", "delivery", "post", "mail", "package", "stuck", "courier", "delayed"]
    finance_keywords = ["refund", "billing", "money", "payment", "charge", "bank", "invoice"]
    software_keywords = ["app", "crash", "bug", "website", "login", "software", "error", "mobile"]

    # Check for keywords
    if any(k in desc for k in post_keywords):
        return "Post Related Issues"
    if any(k in desc for k in finance_keywords):
        return "Finance"
    if any(k in desc for k in software_keywords):
        return "Software Issues"

    # Default if no keywords match
    return "Post Related Issues"

def get_priority(description: str):
    """
    Assigns initial priority based on certain 'urgent' keywords.
    """
    desc = description.lower()
    urgent_keywords = ["urgent", "emergency", "lost", "stolen", "immediately", "damages"]
    
    if any(k in desc for k in urgent_keywords):
        return "red"
    
    # For simulation, most will be yellow or red initially
    return "yellow" if len(desc) > 50 else "red"

def get_hourly_stats(complaints: list):
    """
    Groups complaints by hour and calculates status counts.
    Returns a list of 24 hourly slots.
    """
    # Initialize 24 slots (reversed to match frontend display: typically newest first? 
    # Actually frontend creates 0-23 and reverses it. Let's return 0-23 and let frontend order? 
    # Or match frontend exactly. Frontend does: 24 items, 12 PM start... wait.
    # Frontend logic:
    # hours = Array.from({ length: 24 }, (_, i) => ...).reverse()
    # So it shows 11 PM - 12 AM at top? No, let's look at frontend code logic.
    # Frontend: i=0 -> 12 AM - 1 AM. i=23 -> 11 PM - 12 AM.
    # .reverse() -> 11 PM first.
    
    slots = []
    
    # Bucket complaints
    buckets = {i: [] for i in range(24)}
    
    for c in complaints:
        # Assuming c.timestamp is available as datetime object or string
        # Backend returns Pydantic models in main.py, but here we might work with ORM objects or list
        if hasattr(c, 'timestamp'):
             h = c.timestamp.hour
             buckets[h].append(c)
    
    # Create stats for each hour 0-23
    for i in range(24):
        slot_complaints = buckets[i]
        
        red = sum(1 for c in slot_complaints if c.status == 'red') # status might be pre-calculated or stored
        # Wait, status in DB is "red", "yellow", "green"
        # BUT frontend calculates color based on time sometimes: getStatusColorFromTime
        # "if diff < 1 return red"
        # The backend should probably just use the stored status for now, OR replicate that time logic.
        # The stored status is initial priority. 
        # The frontend logic `getStatusColorFromTime` overrides based on elapsed time.
        # If we move logic to backend, we should replicate that "elapsed time" check or rely on DB status.
        # DB status is "red" initially. 
        # Let's stick to DB status for simplicity as per plan "Rule-based classification... assigns priority".
        
        red_count = 0
        yellow_count = 0
        green_count = 0
        
        formatted_complaints = []
        
        from datetime import datetime
        now = datetime.utcnow()
        
        for c in slot_complaints:
            # Replicate frontend dynamic status logic if needed, or just use c.status
            # Frontend: if currentStatus == 'green' return 'green'
            # else check time. 
            # Let's do a simple count based on stored status for now to match "Rule-based inference".
            # The plan says "assigns priority... Saves to SQLite". So we trust the DB status.
            
            if c.status == 'red': red_count += 1
            elif c.status == 'yellow': yellow_count += 1
            elif c.status == 'green': green_count += 1
            
            formatted_complaints.append(c) # Will be serialized later

        # Generate label
        # 0 -> 12 AM - 1 AM
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
