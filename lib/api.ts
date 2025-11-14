const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Question {
  id: number;
  text: string;
}

export interface AnswerScale {
  [key: number]: string;
}

export interface QuestionsResponse {
  questions: { [key: number]: string };
  answer_scale: AnswerScale;
}

export interface QuizSubmission {
  answers: { [questionId: number]: number };
}

export interface FactionInfo {
  name: string;
  score: number;
  percentage: number;
}

export interface ScoreResponse {
  scores: { [faction: string]: number };
  top_factions: Array<[string, number]>;
  factions: string[];
}

export async function fetchQuestions(): Promise<QuestionsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Cannot connect to backend at ${API_BASE_URL}. ` +
        `Please make sure the FastAPI server is running. ` +
        `Start it with: cd backend && uvicorn main:app --reload --port 8000`
      );
    }
    throw error;
  }
}

export async function submitAnswers(answers: { [questionId: number]: number }): Promise<ScoreResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Cannot connect to backend at ${API_BASE_URL}. ` +
        `Please make sure the FastAPI server is running. ` +
        `Start it with: cd backend && uvicorn main:app --reload --port 8000`
      );
    }
    throw error;
  }
}

