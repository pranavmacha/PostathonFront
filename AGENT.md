# GEMINI.md

## Project Overview

This project, named "PostHub," is a full-stack web application designed as a complaint management system. It features a React-based front-end and a Python back-end powered by the FastAPI framework. The application allows users to submit complaints and provides an administrative dashboard for managing and responding to them. The system categorizes complaints by department and priority, and it includes features for tracking resolution status and viewing hourly statistics.

**Front-End:**
- **Framework:** React with Vite
- **Key Libraries:** `react`, `react-dom`, `framer-motion`, `lucide-react`
- **Structure:** The application is component-based, with separate views for users and administrators. State management is handled within components.

**Back-End:**
- **Framework:** FastAPI
- **Key Libraries:** `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`
- **Database:** The back-end uses SQLAlchemy, suggesting a relational database (the file `posthub.db` indicates SQLite).
- **API:** The back-end exposes a RESTful API for creating, retrieving, and updating complaints.

## Building and Running

### Front-End (React)

To run the front-end development server:
1.  Navigate to the project root directory.
2.  Install dependencies: `npm install`
3.  Start the server: `npm run dev`

The front-end will be accessible at `http://localhost:5173`.

### Back-End (FastAPI)

To run the back-end server:
1.  Navigate to the `backend` directory.
2.  Install Python dependencies: `pip install -r requirements.txt`
3.  Start the server: `python main.py` or `uvicorn main:app --reload`

The back-end API will be accessible at `http://localhost:8000`.

### Building for Production

To create a production build of the front-end:
```bash
npm run build
```
This will create a `dist` folder with the optimized and minified static assets.

## Development Conventions

### Code Style

- **Front-End:** The front-end follows standard React conventions. The use of ESLint suggests a focus on code quality and consistency.
- **Back-End:** The back-end uses type hints and Pydantic models, which is idiomatic for modern Python and FastAPI development.

### API Interaction

- The front-end communicates with the back-end via a RESTful API.
- The `api.js` file in the `src` directory likely contains the logic for making API requests.
- The API endpoints are defined in `backend/main.py`.

### Testing

- A `test_hourly_api.py` file exists in the `backend` directory, indicating that there are some tests for the back-end. To run them, you would typically use a test runner like `pytest`.
- There are no readily apparent tests for the front-end.
