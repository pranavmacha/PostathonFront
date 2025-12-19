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
