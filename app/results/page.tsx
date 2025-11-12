'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResultCard from '@/components/ResultCard';

interface Coalition {
  id: string;
  name: string;
  description: string;
  score: number;
  percentage: number;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<Coalition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get answers from URL params or localStorage
    const answersParam = searchParams.get('answers');
    const answers = answersParam 
      ? JSON.parse(decodeURIComponent(answersParam))
      : JSON.parse(localStorage.getItem('quizAnswers') || '[]');

    if (answers.length === 0) {
      router.push('/');
      return;
    }

    // Calculate results (this will be replaced with API call later)
    calculateResults(answers);
  }, [searchParams, router]);

  const calculateResults = async (answers: Array<{ questionId: number; value: number }>) => {
    // TODO: Replace with actual API call to backend
    // For now, mock results
    const mockResults: Coalition[] = [
      {
        id: '1',
        name: 'Progressive Coalition',
        description: 'You align with progressive policies focused on social justice, climate action, and economic equality.',
        score: 85,
        percentage: 85,
      },
      {
        id: '2',
        name: 'Moderate Coalition',
        description: 'You prefer pragmatic solutions and bipartisan approaches to governance.',
        score: 60,
        percentage: 60,
      },
      {
        id: '3',
        name: 'Conservative Coalition',
        description: 'You support traditional values, limited government, and free-market principles.',
        score: 30,
        percentage: 30,
      },
    ].sort((a, b) => b.score - a.score);

    setResults(mockResults);
    setLoading(false);
  };

  const handleRestart = () => {
    localStorage.removeItem('quizAnswers');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Calculating your results...</div>
          <div className="text-gray-600 dark:text-gray-400">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Your Congressional Coalition Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Based on your answers, here are the coalitions you align with:
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {results.map((coalition, index) => (
            <ResultCard key={coalition.id} coalition={coalition} rank={index + 1} />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    </div>
  );
}

