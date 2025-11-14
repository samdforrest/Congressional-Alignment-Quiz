'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizQuestion from '@/components/QuizQuestion';
import ProgressBar from '@/components/ProgressBar';
import { fetchQuestions, type QuestionsResponse } from '@/lib/api';

interface Question {
  id: number;
  text: string;
  options: Array<{
    id: number;
    text: string;
    value: number;
  }>;
}

interface Answer {
  questionId: number;
  value: number;
}

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data: QuestionsResponse = await fetchQuestions();
        
        // Convert backend format to frontend format
        const formattedQuestions: Question[] = Object.entries(data.questions)
          .map(([id, text]) => {
            const questionId = parseInt(id);
            // Create options from answer scale (-3 to 3)
            // Note: JSON keys are strings, so we need to parse them
            const options = Object.entries(data.answer_scale)
              .map(([valueStr, label]) => {
                const value = parseInt(valueStr);
                return {
                  id: questionId * 10 + value + 3, // Unique ID (shift by 3 to avoid negatives)
                  text: label as string,
                  value: value,
                };
              })
              .sort((a, b) => b.value - a.value); // Sort from strongly agree to strongly disagree
            
            return {
              id: questionId,
              text,
              options,
            };
          })
          .sort((a, b) => a.id - b.id); // Sort by question ID

        setQuestions(formattedQuestions);
        setLoading(false);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load questions. Please make sure the backend server is running.');
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  const handleAnswer = (questionId: number, optionId: number, value: number) => {
    // Update answers in the format expected by backend: {questionId: value}
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleComplete = () => {
    // Save answers to localStorage
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    
    // Navigate to results page
    const answersParam = encodeURIComponent(JSON.stringify(answers));
    router.push(`/results?answers=${answersParam}`);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">No questions available</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">
            Error Loading Quiz
          </div>
          <div className="text-gray-600 dark:text-gray-400 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCurrentQuestionAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar current={answeredCount} total={questions.length} />
        
        <QuizQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedValue={answers[currentQuestion.id]}
        />

        <div className="flex justify-between mt-8 max-w-2xl mx-auto">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered && !isLastQuestion}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !isCurrentQuestionAnswered && !isLastQuestion
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLastQuestion ? 'View Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
