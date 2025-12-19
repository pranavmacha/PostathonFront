# 🔧 Gemini Response Generation - Troubleshooting

## Problem: "Gemini response is not being generated"

This guide helps you diagnose and fix the issue.

---

## ✅ Quick Checklist

- [ ] Backend is running
- [ ] GEMINI_API_KEY is set in environment
- [ ] google-generativeai is installed
- [ ] API key is valid and has access
- [ ] No errors in backend console
- [ ] Network request succeeds

---

## 🔍 Step-by-Step Diagnosis

### Step 1: Check Backend is Running

```bash
# Terminal 1: Start backend
cd backend
python main.py
```

**Look for these messages:**
```
[SUCCESS] Gemini AI model initialized successfully!
[SUCCESS] Backend Ready!
```

OR

```
[WARNING] GEMINI_API_KEY environment variable not set.
[INFO] Using template responses for admin replies.
[SUCCESS] Backend Ready!
```

### Step 2: Verify GEMINI_API_KEY is Set

**Windows (Command Prompt):**
```bash
echo %GEMINI_API_KEY%
```
Should print your API key (or nothing if not set)

**Windows (PowerShell):**
```bash
$env:GEMINI_API_KEY
```

**Linux/Mac:**
```bash
echo $GEMINI_API_KEY
```

**If empty:** Go to "Setting GEMINI_API_KEY" section below

### Step 3: Check API Package is Installed

```bash
python -c "import google.generativeai; print('✅ Installed')"
```

**If error:** Run:
```bash
pip install google-generativeai
```

### Step 4: Test the API Endpoint

**Using curl:**
```bash
# Test with complaint ID 1
curl http://localhost:8000/api/admin/suggest-reply/1
```

**Expected response:**
```json
{
  "suggested_reply": "We sincerely apologize for..."
}
```

**If error:** Check backend console for error messages

### Step 5: Check Backend Console Logs

Look for these messages:

**Success:**
```
[SUCCESS] Gemini AI model initialized successfully!
```

**Warning (using templates):**
```
[WARNING] GEMINI_API_KEY environment variable not set.
[INFO] Using template responses for admin replies.
```

**Error:**
```
[ERROR] Failed to initialize Gemini: ...
[INFO] Falling back to template responses...
```

---

## 🆘 Common Issues & Fixes

### Issue 1: GEMINI_API_KEY Not Found

**Symptom:** Console shows warning about API key not set

**Fix:**

#### Option A: Set Environment Variable (Permanent)
```bash
# Windows: Use Environment Variables GUI
# Search "Environment Variables" → New User Variable
# Name: GEMINI_API_KEY
# Value: your-api-key

# Then restart terminal/IDE/VS Code
```

#### Option B: Set in Current Terminal Session
```bash
# Windows Command Prompt:
set GEMINI_API_KEY=your-api-key-here
python main.py

# Windows PowerShell:
$env:GEMINI_API_KEY="your-api-key-here"
python main.py

# Linux/Mac:
export GEMINI_API_KEY="your-api-key-here"
python main.py
```

#### Option C: Create .env File
```bash
# In backend/ directory, create .env file:
# backend/.env
GEMINI_API_KEY=your-api-key-here

# Then start backend normally:
python main.py
```

---

### Issue 2: "google.generativeai module not found"

**Symptom:**
```
ModuleNotFoundError: No module named 'google.generativeai'
```

**Fix:**
```bash
pip install google-generativeai
```

**Verify:**
```bash
python -c "import google.generativeai; print('OK')"
```

---

### Issue 3: API Key is Invalid

**Symptom:**
```
[ERROR] Failed to initialize Gemini: Invalid API key
```

**Fix:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Generate a new API key
3. Replace the old key in environment variable
4. Restart backend

---

### Issue 4: Gemini API Not Enabled

**Symptom:**
```
[ERROR] Failed to initialize Gemini: 403 Permission denied
```

**Fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable "Generative Language API"
3. Make sure you're using the correct project
4. Generate new API key if needed
5. Replace in environment variable
6. Restart backend

---

### Issue 5: Network/Timeout Error

**Symptom:**
```
[ERROR] Gemini API call failed: Connection timeout
```

**Why:** Slow internet or Gemini API is slow

**Fix:**
- Wait a few seconds and try again
- System will use template response as fallback
- Check your internet connection
- Check if Google is experiencing issues

---

### Issue 6: Frontend Shows "Error generating suggestion"

**Symptom:** Admin dashboard shows error when loading suggestion

**Debug:**
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Trigger the suggestion request
4. Check response from `/api/admin/suggest-reply/{id}`
5. Look at error message

**Common causes:**
- Backend not running
- Complaint ID doesn't exist
- Backend returned error (check console)

---

## 🧪 Testing Without Gemini

If you want to test without setting up Gemini:

### The system works in "Template Mode"
- No API key needed
- Returns professional templates
- Response generation still works
- Perfect for testing

**Just don't set GEMINI_API_KEY and the system uses templates automatically!**

---

## 🔐 Getting a Gemini API Key

### Step 1: Go to Google AI Studio
```
https://aistudio.google.com/app/apikey
```

### Step 2: Click "Get API Key"
- Choose "Create API key in new project" OR
- Choose "Create API key in existing project"

### Step 3: Copy the Key
```
Your key looks like: AIzaSy...
```

### Step 4: Set in Your System
See "Setting GEMINI_API_KEY" section above

### ⚠️ Security Tips
- Never share your API key
- Never commit to git
- Rotate regularly
- Use .gitignore for .env file

---

## 📊 Verify Gemini Works

### Test 1: Check Initialization
```bash
# In backend directory:
python -c "from ai_reply import health_check; print(health_check())"
```

**Good output:**
```
{'gemini_available': True, 'gemini_ready': True, 'api_key_configured': True, 'status': 'ready', 'message': 'AI generation ready'}
```

**Template mode output:**
```
{'gemini_available': True, 'gemini_ready': False, 'api_key_configured': False, 'status': 'template_mode', 'message': 'Using template responses...'}
```

### Test 2: Generate a Response
```python
from database import SessionLocal, Complaint
from ai_reply import generate_ai_reply

db = SessionLocal()
complaint = db.query(Complaint).first()

if complaint:
    reply = generate_ai_reply(complaint)
    print(f"Generated:\n{reply}")
else:
    print("No complaints in database. Submit one first!")
```

### Test 3: API Endpoint
```bash
# Assuming complaint ID 1 exists:
curl http://localhost:8000/api/admin/suggest-reply/1 | python -m json.tool
```

---

## 🆘 Still Not Working?

### Check These Files Exist
- ✅ `backend/ai_reply.py` - Should have generate_ai_reply function
- ✅ `backend/main.py` - Should import from ai_reply
- ✅ `src/api.js` - Should have getSuggestedReply function
- ✅ `backend/requirements.txt` - Should include google-generativeai

### Check Imports
```python
# In backend/main.py:
from ai_reply import generate_ai_reply  # ← Should be present

# In backend/ai_reply.py:
import google.generativeai as genai  # ← Should work
```

### Check Endpoint Exists
```bash
# Should work if backend is running:
curl http://localhost:8000/api/admin/suggest-reply/1
```

### Clear Cache and Restart
```bash
# Stop backend (Ctrl+C)
# Clear Python cache:
find . -type d -name __pycache__ -exec rm -r {} +
find . -name "*.pyc" -delete

# Restart:
python main.py
```

---

## 📈 Performance Notes

- **First request:** 2-3 seconds (model warm-up)
- **Subsequent requests:** 1-2 seconds
- **Template fallback:** <100ms (instant)
- **Timeout:** 30 seconds (returns template)

If slow, it's normal! Gemini takes time on first call.

---

## 💡 Pro Tips

### 1. Use Template Mode for Development
```bash
# Don't set GEMINI_API_KEY to test without API
python main.py  # Uses templates automatically
```

### 2. Monitor API Usage
```
Google Cloud Console → Generative Language API → Quotas & System Limits
```

### 3. Set Rate Limits
```
If you expect high volume, set quotas in Google Cloud Console
Free tier: 60 requests per minute
```

### 4. Custom Prompts
Edit `backend/ai_reply.py` to customize the Gemini prompt

---

## ✅ Success Indicators

Your system is working when:

1. ✅ Backend console shows "Gemini AI model initialized"
2. ✅ Frontend loads suggestions for complaints
3. ✅ Suggestions are different from templates
4. ✅ Admin can edit and send the suggestion
5. ✅ No errors in console

---

## 🎯 Next Steps

1. **Get API Key:** [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Set Environment:** `export GEMINI_API_KEY="your-key"`
3. **Install Package:** `pip install google-generativeai`
4. **Restart Backend:** `python main.py`
5. **Test in Frontend:** Submit complaint → View in Admin → See suggestion

---

**Need more help?** Check GEMINI_SETUP.md for detailed setup instructions.
