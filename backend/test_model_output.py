from logic import load_model, classify_complaint

load_model()
print(f"Prediction for 'app crash': {classify_complaint('app crash')} (Expected: Software Issues)")
print(f"Prediction for 'login failed': {classify_complaint('login failed')} (Expected: Software Issues)")
print(f"Prediction for 'parcel lost': {classify_complaint('parcel lost')} (Expected: Post Related Issues)")
print(f"Prediction for 'refund delay': {classify_complaint('refund delay')} (Expected: Finance)")
