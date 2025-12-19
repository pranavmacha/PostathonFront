# PostHub - Complaint Management System

A full-stack complaint management system with ML-powered classification, sentiment analysis, and admin dashboard.

## Features

- 🤖 **ML Classification** - Automatic complaint categorization using trained model
- 📊 **Sentiment Analysis** - Priority assignment (Red/Yellow/Green) based on urgency
- ⏰ **Hourly Tracking** - View complaints organized by time slots
- 👨‍💼 **Admin Dashboard** - Department-wise complaint management
- 💬 **Template Responses** - Professional reply suggestions
- 📱 **Responsive UI** - Modern glassmorphism design

## Tech Stack

**Backend:**
- FastAPI (Python)
- SQLAlchemy (ORM)
- PostgreSQL / SQLite
- Scikit-learn (ML)
- NLTK (Sentiment Analysis)

**Frontend:**
- React
- Vite
- Modern CSS with glassmorphism

## Local Development

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on `http://localhost:8000`

### Frontend Setup
```bash
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## Deployment

See `implementation_plan.md` in the artifacts folder for detailed Render deployment instructions.

### Quick Deploy to Render
1. Push to GitHub
2. Import repository in Render
3. Use the included `render.yaml` for automatic configuration
4. Add PostgreSQL database
5. Deploy!

## Project Structure

```
PostathonF/
├── backend/
│   ├── main.py           # FastAPI app
│   ├── database.py       # Database models
│   ├── logic.py          # ML & business logic
│   └── requirements.txt  # Python dependencies
├── src/
│   ├── components/       # React components
│   ├── api.js           # API service
│   └── App.jsx          # Main app
├── complaint_ml/
│   ├── complaint_classifier.pkl  # Trained ML model
│   └── complaints_data.csv       # Training data
└── render.yaml          # Render deployment config
```

## ML Model

The system uses a trained classifier that categorizes complaints into:
- Post Related Issues
- Finance
- Software Issues

Priority is assigned based on:
- Sentiment analysis (VADER)
- Keyword detection (urgent, emergency, lost, etc.)

## License

MIT
