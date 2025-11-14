#FASTAPI application
# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
from quiz_data import QUESTIONS, FACTIONS
from scoring import calculate_scores, get_top_factions

app = FastAPI(title="Caucus Compass API")

# Configure CORS to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class QuizSubmission(BaseModel):
    answers: Dict[int, int]  # {question_id: answer_value}


# --- Routes ---

@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Caucus Compass API is running"}

@app.get("/questions")
def get_questions():
    """
    Returns all quiz questions.
    """
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
