"""
Template-based reply generation for PostHub complaints.
No external API dependencies - fast, reliable, and free!
"""

# Template responses by category
RESPONSE_TEMPLATES = {
    "Delivery Delay": "We sincerely apologize for the delay in your delivery. We understand your frustration and are actively tracking your consignment. You can expect an update within 24 hours. - PostHub Support Team",
    
    "Lost Parcel": "We deeply regret that your parcel is missing. We have immediately initiated a comprehensive search at our distribution centers. Please expect a full report within 48 hours. - PostHub Support Team",
    
    "Damaged Item": "We are sorry your package arrived damaged. Please send us photographs of the damage for our insurance claim processing. We will resolve this promptly. - PostHub Support Team",
    
    "Wrong Delivery": "We apologize for the misdelivery. We are coordinating with our delivery partner to retrieve the package and deliver it to the correct address within 2-3 business days. - PostHub Support Team",
    
    "Tracking Issue": "We apologize for the tracking difficulties. Our technical team is working to resolve this issue. Please try again in 2 hours or contact our helpline for immediate assistance. - PostHub Support Team",
    
    "Refund / Compensation": "Your refund request has been approved. The amount will be credited to your original payment method within 3-5 business days. Thank you for your patience. - PostHub Support Team",
    
    "Staff Behavior": "We take this very seriously. An official inquiry has been initiated, and appropriate action will be taken. Thank you for bringing this to our attention. - PostHub Support Team",
    
    "Technical Issue": "We are aware of the technical issue and sincerely apologize for the inconvenience. Our IT team is investigating immediately and expects resolution within 24 hours. - PostHub Support Team",
    
    "Payment Issue": "We understand the urgency of this payment issue. Our finance team is investigating with highest priority and will resolve within 24 hours. - PostHub Support Team",
    
    "Post Related Issues": "Thank you for reporting this postal service issue. Our operations team has been notified and will investigate immediately. We will update you within 24-48 hours. - PostHub Support Team",
    
    "Finance": "Your financial concern has been escalated to our accounts department. A specialist will review your case and respond within 24-48 hours. - PostHub Support Team",
    
    "Software Issues": "We apologize for the technical difficulties you're experiencing. Our development team has been notified and is working on a fix. Please try again in a few hours. - PostHub Support Team",
    
    "Other": "Thank you for contacting us. We have received your complaint and a team member will review it shortly. We will respond within 24-48 hours. - PostHub Support Team",
}


def get_template_response(department: str, priority: str = None) -> str:
    """
    Get a template response based on complaint department and priority.
    
    Args:
        department: The complaint category/department
        priority: Optional priority level (red/yellow/green)
    
    Returns:
        Professional template response string
    """
    # Get base template
    response = RESPONSE_TEMPLATES.get(department, RESPONSE_TEMPLATES["Other"])
    
    # Add urgency note for high priority complaints
    if priority and priority.lower() == "red":
        response = response.replace("within 24 hours", "immediately")
        response = response.replace("within 24-48 hours", "within 24 hours")
    
    return response


def generate_ai_reply(complaint):
    """
    Generates a professional admin response for a given complaint.
    Uses template-based responses - reliable and fast!
    
    Args:
        complaint: Complaint object with department, status, title, description
    
    Returns:
        Professional response string
    """
    try:
        department = getattr(complaint, 'department', 'Other')
        priority = getattr(complaint, 'status', 'yellow')
        
        return get_template_response(department, priority)
        
    except Exception as e:
        print(f"[ERROR] Template generation error: {e}")
        return RESPONSE_TEMPLATES["Other"]


def health_check() -> dict:
    """Check health of reply system"""
    return {
        "status": "ready",
        "mode": "template",
        "templates_loaded": len(RESPONSE_TEMPLATES),
        "message": "Template-based responses active"
    }
