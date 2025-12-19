# 🤖 Gemini AI Response Generation - Setup Guide

## Overview

Your PostHub Connect system now includes **AI-powered response generation** using Google's Gemini API. When an admin requests a suggested reply for a complaint, the system will:

1. ✅ Fetch the complaint details
2. ✅ Generate a professional response using Gemini AI
3. ✅ Display it for the admin to review/edit
4. ✅ Fall back to templates if Gemini unavailable

---

## 🔧 Setup Steps

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key" button
3. Create a new API key (or use existing)
4. Copy the API key

### Step 2: Set Environment Variable

#### Option A: Windows (Permanent)
```powershell
# Open Environment Variables
# Settings → System → Advanced system settings → Environment Variables

# Add new User Variable:
Variable name: GEMINI_API_KEY
Variable value: your-api-key-here

# Then restart terminal/IDE
```

#### Option B: Windows (Temporary - Current Session Only)
```bash
# In Command Prompt:
set GEMINI_API_KEY=your-api-key-here

# Or in PowerShell:
$env:GEMINI_API_KEY="your-api-key-here"
```

#### Option C: Linux/Mac
```bash
export GEMINI_API_KEY="your-api-key-here"
```

#### Option D: .env File
Create file: `backend/.env`
```
GEMINI_API_KEY=your-api-key-here
```

**Note:** The code will load from environment variables first, then fall back to `.env` file.

### Step 3: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Make sure these packages are installed:
- ✅ `google-generativeai`
- ✅ `python-dotenv` (optional, for .env support)

### Step 4: Verify Installation

```bash
# Check if google-generativeai is installed
python -c "import google.generativeai; print('✅ Installed')"
```

### Step 5: Start Backend

```bash
python main.py
```

**Expected output when Gemini is configured:**
```
[SUCCESS] Gemini AI model initialized successfully!
[SUCCESS] Backend Ready!
```

**If Gemini is NOT configured:**
```
[WARNING] GEMINI_API_KEY environment variable not set.
[INFO] Using template responses for admin replies.
[SUCCESS] Backend Ready!
```

---

## 🧪 Testing Gemini Response Generation

### Method 1: Via Frontend

1. Start frontend: `npm run dev`
2. Go to Admin Portal
3. Select a department and view complaints
4. Click on any complaint
5. In the "Response Management" section, you should see a suggested reply auto-populated
6. Edit and send the reply

### Method 2: Via API (cURL)

```bash
# Get suggested reply for complaint ID 1
curl http://localhost:8000/api/admin/suggest-reply/1
```

**Expected response:**
```json
{
  "suggested_reply": "Dear Customer, we sincerely apologize for the delivery delay. Our team is actively tracking your consignment and will provide an update within 24 hours. Thank you for your patience. - PostHub Support Team"
}
```

### Method 3: Direct Python Test

```python
# In backend directory, run:
from database import SessionLocal, Complaint
from ai_reply import generate_ai_reply

db = SessionLocal()
complaint = db.query(Complaint).first()

if complaint:
    reply = generate_ai_reply(complaint)
    print(f"Generated Reply:\n{reply}")
else:
    print("No complaints in database")
```

---

## 📊 How It Works

### Without Gemini (Template Mode)
```
User submits complaint
    ↓
Admin views complaint
    ↓
Admin clicks "View Suggestion"
    ↓
Backend returns template response ✅
    ↓
Admin sees pre-written template
    ↓
Admin can edit or use as-is
```

### With Gemini (AI Mode)
```
User submits complaint
    ↓
Admin views complaint
    ↓
Admin clicks "View Suggestion"
    ↓
Backend calls Gemini API with complaint details
    ↓
Gemini generates personalized, empathetic response ✅
    ↓
Admin sees AI-enhanced response
    ↓
Admin can edit or use as-is
```

---

## 🎯 Response Generation Examples

### Example 1: Lost Package (RED Priority)

**Complaint:**
```
Title: Package Lost
Description: My package has been lost for 3 weeks! I need it urgently!
```

**Gemini Generated Response:**
```
We deeply apologize that your package has been missing for this extended period. 
This is unacceptable, and we are immediately escalating your case to our management 
team for urgent investigation. You can expect a full resolution or replacement within 
48 hours. - PostHub Support Team
```

### Example 2: Tracking Issue (YELLOW Priority)

**Complaint:**
```
Title: Tracking Not Working
Description: The tracking system isn't showing updates
```

**Gemini Generated Response:**
```
We sincerely apologize for the tracking difficulties. Our technical team has identified 
the issue and is working to restore full functionality. We expect the tracking system 
to be fully operational within 2 hours. Thank you for your patience. - PostHub Support Team
```

### Example 3: Positive Feedback (GREEN Priority)

**Complaint:**
```
Title: Great Service
Description: Thank you for the excellent service and fast delivery!
```

**Gemini Generated Response:**
```
Thank you so much for your kind feedback! We truly appreciate your business and are 
delighted that we could provide you with an excellent experience. We look forward to 
serving you again. - PostHub Support Team
```

---

## 🔍 Troubleshooting

### ❌ Error: "GEMINI_API_KEY environment variable not set"

**Solution:**
1. Verify the API key is correctly set in environment
2. Try restarting the terminal/IDE
3. Check the key is valid and has API access enabled

**Test:**
```bash
# Windows Command Prompt:
echo %GEMINI_API_KEY%

# Windows PowerShell:
$env:GEMINI_API_KEY

# Linux/Mac:
echo $GEMINI_API_KEY
```

### ❌ Error: "google.generativeai module not found"

**Solution:**
```bash
pip install google-generativeai
```

Verify installation:
```bash
python -c "import google.generativeai; print('OK')"
```

### ❌ Error: "Failed to authenticate with Gemini"

**Possible causes:**
- API key is invalid
- API key doesn't have access to generativeai API
- Gemini API not enabled in Google Cloud Console

**Solution:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Generate a new API key
3. Replace the old key in environment variable
4. Restart backend

### ❌ Gemini is slow or timeout

**Solution:**
- Gemini free tier may be rate-limited
- First request might be slower (model warm-up)
- Backend will timeout after 30 seconds and use template

### ✅ Using Template Fallback

If Gemini is unavailable, the system automatically uses templates:
- Still shows professional responses
- Responses are category-appropriate
- Can be customized in `backend/ai_reply.py`

---

## 📝 Customizing Templates

If you want to modify the fallback templates:

Edit `backend/ai_reply.py`:

```python
RESPONSE_TEMPLATES = {
    "Delivery Delay": "Your custom response here...",
    "Lost Parcel": "Your custom response here...",
    # ... more categories
}
```

---

## 🚀 Production Deployment

### Important Security Notes

1. **Never commit API keys** to git
2. **Use environment variables** only
3. **Rotate keys regularly**
4. **Monitor API usage** in Google Cloud Console
5. **Set API quotas** to prevent unexpected costs

### Recommended Setup

```bash
# Create .env file (add to .gitignore)
echo "GEMINI_API_KEY=your-key-here" > backend/.env

# Add to .gitignore
echo "backend/.env" >> .gitignore
backend/.env

# In production, set via:
export GEMINI_API_KEY="your-production-key"
```

---

## 💡 Tips & Tricks

### 1. Test with Sample Complaints

```python
# Generate replies for existing complaints
from database import SessionLocal, Complaint
from ai_reply import generate_ai_reply

db = SessionLocal()
complaints = db.query(Complaint).limit(5).all()

for c in complaints:
    reply = generate_ai_reply(c)
    print(f"\n{c.title}")
    print(f"Reply: {reply}")
    print("-" * 50)
```

### 2. Check System Status

```python
from ai_reply import health_check

status = health_check()
print(f"Status: {status['status']}")
print(f"Gemini Ready: {status['gemini_ready']}")
print(f"Message: {status['message']}")
```

### 3. Measure Response Time

```python
import time
from database import SessionLocal, Complaint
from ai_reply import generate_ai_reply

db = SessionLocal()
complaint = db.query(Complaint).first()

start = time.time()
reply = generate_ai_reply(complaint)
elapsed = time.time() - start

print(f"Response generated in {elapsed:.2f} seconds")
print(f"Length: {len(reply)} characters")
```

---

## 📞 Support

### Gemini Issues?
- Check [Google AI Studio](https://aistudio.google.com)
- Review [Gemini API Docs](https://ai.google.dev/docs)
- Check API quotas in Google Cloud Console

### Backend Issues?
- Check backend console for error messages
- Review `backend/ai_reply.py` for fallback logic
- Ensure GEMINI_API_KEY is set correctly

---

## ✅ System Status

```
Component              Status
─────────────────────────────
Gemini Integration     ✅ READY
API Endpoint           ✅ /api/admin/suggest-reply/{id}
Frontend Support       ✅ Auto-loads suggestions
Fallback Templates     ✅ 10 categories covered
Error Handling         ✅ Comprehensive
Logging                ✅ Clear & helpful
```

---

## 🎉 You're Ready!

Your PostHub Connect system now has:
- ✅ AI-powered response generation
- ✅ Professional templates as fallback
- ✅ Easy setup with environment variables
- ✅ Automatic error handling
- ✅ Full API integration
- ✅ Real-time suggestion loading

**Enjoy the power of AI in your complaint management! 🚀**
