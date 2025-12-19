import sys
sys.path.insert(0, 'c:/Users/prana/OneDrive/Desktop/PostathonF/backend')

from ai_reply import GEMINI_AVAILABLE, GEMINI_READY, GEMINI_API_KEY, model, health_check

print("=== AI Reply System Status ===")
print(f"GEMINI_AVAILABLE: {GEMINI_AVAILABLE}")
print(f"GEMINI_READY: {GEMINI_READY}")
print(f"API Key Set: {bool(GEMINI_API_KEY)}")
if GEMINI_API_KEY:
    print(f"API Key Length: {len(GEMINI_API_KEY)}")
print(f"Model: {model}")
print("\nHealth Check:")
print(health_check())
