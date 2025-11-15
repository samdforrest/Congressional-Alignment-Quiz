#FASTAPI application
# main.py

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List
from quiz_data import QUESTIONS, FACTIONS
from scoring import calculate_scores, get_top_factions

app = FastAPI(title="Caucus Compass API")

# Configure CORS to allow requests from Next.js frontend
# In production, set ALLOWED_ORIGINS environment variable (comma-separated)
# Example: ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app.railway.app
# For Vercel preview deployments, include all your preview URLs or use: https://*.vercel.app (if supported)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    # Parse comma-separated origins from environment variable
    allowed_origins: List[str] = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
    print(f"✅ CORS configured with {len(allowed_origins)} allowed origin(s)")
else:
    # Default to localhost for development
    allowed_origins = [
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",
    ]
    print("⚠️  WARNING: ALLOWED_ORIGINS not set! Defaulting to localhost only.")
    print("   Set ALLOWED_ORIGINS environment variable in Render to fix CORS errors.")

# Log allowed origins for debugging
print(f"🌐 CORS allowed origins: {allowed_origins}")

# Add CORS middleware BEFORE other middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Note: CORS middleware should handle adding headers to all responses automatically
# FastAPI's CORS middleware runs for all requests, including errors

# --- Models ---
class QuizSubmission(BaseModel):
    answers: Dict[int, int]  # {question_id: answer_value}


# --- Routes ---

@app.get("/")
def root():
    """Health check endpoint."""
    return {
        "status": "ok", 
        "message": "Caucus Compass API is running",
        "allowed_origins": allowed_origins if os.getenv("ALLOWED_ORIGINS") else "localhost only (development mode)",
        "cors_configured": bool(os.getenv("ALLOWED_ORIGINS")),
        "environment": os.getenv("ENVIRONMENT", "unknown")
    }

@app.get("/health")
def health_check():
    """Detailed health check with CORS info."""
    return {
        "status": "healthy",
        "cors_configured": bool(os.getenv("ALLOWED_ORIGINS")),
        "allowed_origins_count": len(allowed_origins),
        "allowed_origins": allowed_origins if os.getenv("ALLOWED_ORIGINS") else "⚠️ NOT SET - CORS will fail!"
    }

@app.get("/questions")
def get_questions():
    """
    Returns all quiz questions.
    """
    try:
        return {
            "questions": QUESTIONS,
            "answer_scale": {
                -3: "Strongly disagree",
                -2: "Disagree",
                -1: "Slightly disagree",
                 0: "Neutral / Unsure",
                 1: "Slightly agree",
                 2: "Agree",
                 3: "Strongly agree",
            },
        }
    except Exception as e:
        print(f"Error in /questions endpoint: {e}")
        raise


@app.post("/score")
def score_quiz(submission: QuizSubmission):
    """
    Calculate and return quiz results.
    """
    scores = calculate_scores(submission.answers)
    top = get_top_factions(scores)
    return {
        "scores": scores,
        "top_factions": top,
        "factions": FACTIONS,
    }
