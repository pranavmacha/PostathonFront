from logic import load_model, classify_complaint

# Reload the model
load_model()

print("=== Testing New ML Model ===\n")

# Test cases covering different categories
test_cases = [
    ("My parcel is delayed by 5 days", "Expected: Delivery Delay"),
    ("The package never arrived", "Expected: Lost Parcel"),
    ("Item arrived broken and damaged", "Expected: Damaged Item"),
    ("Delivered to wrong address", "Expected: Wrong Delivery"),
    ("Cannot track my shipment online", "Expected: Tracking Issue"),
    ("Need refund for lost package", "Expected: Refund / Compensation"),
    ("Staff was very rude to me", "Expected: Staff Behavior"),
    ("App keeps crashing on login", "Expected: Technical Issue"),
    ("Payment not processed", "Expected: Refund / Compensation"),
]

print("Testing classifications:\n")
correct = 0
total = len(test_cases)

for text, expected in test_cases:
    result = classify_complaint(text)
    status = "[OK]" if expected.split(": ")[1] in result else "[FAIL]"
    if status == "[OK]":
        correct += 1
    print(f"{status} Input: '{text}'")
    print(f"  Result: {result}")
    print(f"  {expected}\n")

accuracy = (correct / total) * 100
print(f"=== Accuracy: {correct}/{total} ({accuracy:.1f}%) ===")
