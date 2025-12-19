# 🚀 PostHub Connect - Setup & Run Guide

## ✅ All Issues Fixed!

This guide walks you through setting up and running the entire PostHub Connect system with all fixes applied.

---

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+ & npm
- Git (optional)

---

## 🔧 Step 1: Train the ML Model

**Required first!** The ML model file must exist before running the backend.

```bash
# Navigate to ML directory
cd complaint_ml

# Install dependencies
pip install -r requirements.txt

# Train the model
python train_model.py
```

**Expected Output:**
```
Loading data...
Setting up pipeline and grid search...
Training with GridSearch (finding best parameters)...

Best Parameters: {...}
Best Cross-Validation Score: 0.XX%

Evaluating on Test Set...
Test Set Accuracy: 0.XX%

Classification Report:
...

Model saved to 'complaint_classifier.pkl'
```

**Verify:** Check that `complaint_ml/complaint_classifier.pkl` exists (should be ~1-5 MB)

---

## 🔧 Step 2: Setup Backend (FastAPI)

```bash
# From project root, navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python main.py
```

**Expected Output:**
```
🚀 PostHub Backend Starting...
✅ Model loaded successfully from ...\complaint_ml\complaint_classifier.pkl
✅ Backend Ready!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ **Keep this terminal open!** Backend must stay running.

---

## 🔧 Step 3: Setup Frontend (React)

**Open a NEW terminal window!**

```bash
# From project root
cd .

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Frontend is now running at http://localhost:5173**

---

## 🧪 Testing the System

### Test 1: Submit a User Complaint

1. Open http://localhost:5173 in browser
2. Click **"User Portal"** button
3. Fill in complaint form:
   - **Title:** "My package is lost and I need it urgently!"
   - **Description:** "I've been waiting for my package for 2 weeks. It shows delivered but I never received it. This is urgent!"
4. Click **"Submit Complaint"**

**Expected Results:**
- ✅ Success message with tracking ID (e.g., "PH-X42")
- ✅ Backend console shows:
  ```
  Prediction error: [if model failed]
  OR
  (silently processes and saves)
  ```

---

### Test 2: Admin Views Hourly Stats

1. Go back to home (click "PostHub" logo or "Home" button)
2. Click **"Admin Portal"** button
3. Enter any credentials (authentication is mocked in demo)
4. Select a **Department** (e.g., "Logistics")

**Expected Results:**
- ✅ 24-hour grid displays
- ✅ Red/Yellow/Green counts shown for each hour
- ✅ Current hour with complaints shows as "ACTIVE"

---

### Test 3: Admin Sends Reply to Complaint

1. In Admin Dashboard, click on an hour with red/yellow/green counts
2. Click on a complaint from the list
3. In the **"Response Management"** section:
   - Type a reply message
   - Click **"Send Response"**

**Expected Results:**
- ✅ Reply sent successfully
- ✅ Complaint status changes to **GREEN** (resolved)
- ✅ If you go back and select the same complaint, it now shows as GREEN

---

## 📊 Data Verification

### Check Database
The system creates `backend/posthub.db` (SQLite database).

To view complaints:
```bash
# Windows
cd backend
python -c "from database import SessionLocal, Complaint; db = SessionLocal(); complaints = db.query(Complaint).all(); [print(f'{c.id}: {c.title} - {c.department} ({c.status})') for c in complaints]"
```

---

## 🔍 Testing Priority Assignment

### Test Case 1: Urgent Complaint (Should be RED)
```
Title: Package Damage
Description: My package arrived completely damaged! I need this replaced IMMEDIATELY!
Expected Priority: RED ✅
Reasoning: Has "IMMEDIATELY" keyword + negative sentiment
```

### Test Case 2: Normal Complaint (Should be YELLOW or GREEN)
```
Title: Tracking Issue
Description: I'm having trouble with the tracking system.
Expected Priority: YELLOW or GREEN ✅
Reasoning: Neutral tone, no urgent keywords
```

### Test Case 3: Positive Feedback (Should be GREEN)
```
Title: Great Service
Description: Thank you for the fast delivery and excellent service!
Expected Priority: GREEN ✅
Reasoning: Positive sentiment
```

---

## 🐛 Troubleshooting

### Issue: "Model file not found" Warning

**Solution:**
```bash
cd complaint_ml
python train_model.py
cd ..
```

Then restart backend.

---

### Issue: Backend crashes on startup

**Check:**
1. Is Python 3.8+? → `python --version`
2. Are dependencies installed? → `pip install -r requirements.txt`
3. Is port 8000 already in use? → Change port in `main.py`

**Restart:**
```bash
cd backend
python main.py
```

---

### Issue: Frontend shows "Connection error"

**Check:**
1. Is backend running on `http://localhost:8000`? 
2. Are both frontend and backend running in separate terminals?
3. Check browser console for CORS errors

**Fix CORS if needed:**
In `backend/main.py`, line 19-24:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    ...
)
```

---

### Issue: Hourly stats not loading

**Check:**
1. Any complaints submitted? (Admin dashboard needs data)
2. Backend returning error? (Check terminal)
3. Try refreshing page (F5)

---

## 📁 File Structure Reference

```
PostathonF/
├── backend/
│   ├── main.py                 ← FastAPI server
│   ├── logic.py                ← ML classification & priority
│   ├── database.py             ← SQLAlchemy models
│   ├── requirements.txt         ← Backend dependencies
│   └── posthub.db              ← Database (created on first run)
│
├── complaint_ml/
│   ├── train_model.py          ← Train ML model
│   ├── complaints_data.csv     ← Training data
│   ├── complaint_classifier.pkl ← Trained model (generated)
│   └── requirements.txt         ← ML dependencies
│
├── src/
│   ├── App.jsx                 ← Main React app
│   ├── api.js                  ← API client
│   ├── components/
│   │   ├── user/
│   │   │   └── UserComplaintForm.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── Login.jsx
│   │       └── DepartmentSelect.jsx
│   └── ...
│
├── package.json                ← Frontend dependencies
├── vite.config.js              ← Vite config
└── index.html
```

---

## 🎯 Key Features (Now Fixed!)

✅ **ML Classification**: Complaints auto-categorized by department  
✅ **Sentiment Analysis**: Priority based on emotional tone  
✅ **Priority System**: Red (urgent) → Yellow (medium) → Green (resolved)  
✅ **Hourly Stats**: 24-hour complaint distribution dashboard  
✅ **Admin Replies**: Admins can respond to complaints and mark resolved  
✅ **Real-time Updates**: Dashboard refreshes after each action  

---

## 📞 Support

If you encounter issues:

1. **Check the terminal output** - Error messages are descriptive
2. **Review INTEGRATION_ANALYSIS.md** - Detailed architecture explanation
3. **Check CODE_REVIEW.md** - All fixes documented
4. **Verify all steps completed** - Follow setup guide in order

---

## ✨ You're All Set!

Your PostHub Connect system is now fully functional with:
- ✅ ML model loading with validation
- ✅ Sentiment-based priority assignment
- ✅ Proper hourly stats grouping
- ✅ Admin reply synchronization
- ✅ All dependencies installed

**Happy coding! 🚀**
