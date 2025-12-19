import requests
from datetime import datetime

API_URL = "http://localhost:8001/api"

def test_hourly_stats():
    print("Testing Hourly Stats API...")
    
    # 1. Create a few complaints at different times (mocking time by just creating them now, 
    # they will fall into current hour)
    # Note: To test different hours, we'd need to mock the time on backend or insert with custom timestamps.
    # The current backend `create_complaint` uses `datetime.utcnow`.
    # For now, we verify structure and current hour count.
    
    # Create a complaint
    complaint = {
        "title": "Test Hourly",
        "description": "Urgent weather issue",
        "user_name": "Tester"
    }
    requests.post(f"{API_URL}/complaints", json=complaint)
    
    # 2. Fetch stats
    response = requests.get(f"{API_URL}/admin/hourly-stats")
    if response.status_code != 200:
        print(f"FAILED: Status {response.status_code}")
        print(response.text)
        return

    data = response.json()
    print(f"Received {len(data)} hourly slots.")
    
    # Validate structure
    current_hour = datetime.utcnow().hour
    
    found_complaint = False
    for slot in data:
        print(f"Slot: {slot['hour_label']} | Count: {slot['count']} | Status: {slot['status']}")
        if slot['count'] > 0:
            found_complaint = True
            # Verify complaints are inside
            if 'complaints' not in slot:
                 print("  ERROR: Missing 'complaints' list in slot")
    
    if found_complaint:
        print("PASSED: Found complaints in hourly slots.")
    else:
        print("WARNING: No complaints found (did create succeed?)")

if __name__ == "__main__":
    test_hourly_stats()
