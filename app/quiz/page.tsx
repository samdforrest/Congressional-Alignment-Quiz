'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizQuestion from '@/components/QuizQuestion';
import ProgressBar from '@/components/ProgressBar';

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
  optionId: number;
  value: number;
}

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call to fetch questions
    // For now, using mock questions
    const mockQuestions: Question[] = [
      {
        id: 1,
        text: 'What is your view on healthcare policy?',
        options: [
          { id: 1, text: 'Support universal healthcare', value: 5 },
          { id: 2, text: 'Support public option', value: 3 },
          { id: 3, text: 'Support market-based solutions', value: 1 },
        ],
      },
      {
        id: 2,
        text: 'What is your position on climate change?',
        options: [
          { id: 4, text: 'Urgent action needed', value: 5 },
          { id: 5, text: 'Moderate regulations', value: 3 },
          { id: 6, text: 'Minimal government intervention', value: 1 },
        ],
      },
      {
        id: 3,
        text: 'What is your view on taxation?',
        options: [
          { id: 7, text: 'Increase taxes on wealthy', value: 5 },
          { id: 8, text: 'Maintain current rates', value: 3 },
          { id: 9, text: 'Reduce taxes across the board', value: 1 },
        ],
      },
    ];

    setQuestions(mockQuestions);
    setLoading(false);
  }, []);

  const handleAnswer = (questionId: number, optionId: number, value: number) => {
    const newAnswer: Answer = { questionId, optionId, value };
    const updatedAnswers = [...answers];
    
    // Check if answer already exists for this question
    const existingIndex = updatedAnswers.findIndex(a => a.questionId === questionId);
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }
    
    setAnswers(updatedAnswers);

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz complete, navigate to results
        handleComplete();
      }
    }, 500);
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

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.filter(a => 
    questions.some(q => q.id === a.questionId)
  ).length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCurrentQuestionAnswered = answers.some(a => a.questionId === currentQuestion.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar current={answeredCount} total={questions.length} />
        
        <QuizQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
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
