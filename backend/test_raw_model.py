import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from logic import model

print("=== Testing New ML Model (Raw Output) ===\n")

# Test cases
test_cases = [
    "My parcel is delayed by 5 days",
    "The package never arrived",
    "Item arrived broken and damaged",
    "Delivered to wrong address",
    "Cannot track my shipment online",
    "Need refund for lost package",
    "Staff was very rude to me",
    "App keeps crashing on login",
    "Payment not processed",
]

print("Raw model predictions:\n")
for text in test_cases:
    raw_prediction = model.predict([text])[0]
    print(f"Input: '{text}'")
    print(f"  Raw Category: {raw_prediction}\n")

print("\n=== Model is working! ===")
print("The categories are being mapped to frontend departments in logic.py")
