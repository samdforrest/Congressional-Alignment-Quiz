'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResultCard from '@/components/ResultCard';
import { submitAnswers } from '@/lib/api';

interface Coalition {
  id: string;
  name: string;
  description: string;
  score: number;
  percentage: number;
}

// Faction descriptions (you can move this to a separate file or fetch from backend)
const FACTION_DESCRIPTIONS: { [key: string]: string } = {
  'Progressive Caucus': 'You align with progressive policies focused on social justice, climate action, and economic equality.',
  'New Democrat Coalition': 'You support pro-business policies, innovation, and pragmatic progressive solutions.',
  'Blue Dog Coalition': 'You prefer fiscally conservative and socially moderate approaches to governance.',
  'Mainstream Democrats': 'You align with traditional Democratic values and party positions.',
  'Freedom Caucus': 'You support limited government, fiscal conservatism, and traditional values.',
  'Republican Study Committee': 'You align with conservative principles and free-market economics.',
  'Main Street Caucus': 'You prefer pragmatic, business-friendly conservative solutions.',
  'Problem Solvers Caucus': 'You value bipartisanship, compromise, and finding common ground.',
};

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<Coalition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get answers from URL params or localStorage
    const answersParam = searchParams.get('answers');
    let answers: { [questionId: number]: number } = {};
    
    try {
      if (answersParam) {
        answers = JSON.parse(decodeURIComponent(answersParam));
      } else {
        const stored = localStorage.getItem('quizAnswers');
        if (stored) {
          answers = JSON.parse(stored);
        }
      }
    } catch (err) {
      console.error('Error parsing answers:', err);
      router.push('/');
      return;
    }

    if (Object.keys(answers).length === 0) {
      router.push('/');
      return;
    }

    // Calculate results using backend API
    calculateResults(answers);
  }, [searchParams, router]);

  const calculateResults = async (answers: { [questionId: number]: number }) => {
    try {
      const response = await submitAnswers(answers);
      
      // Convert backend response to frontend format
      const formattedResults: Coalition[] = Object.entries(response.scores)
        .map(([name, score]) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          description: FACTION_DESCRIPTIONS[name] || `You align with the ${name}.`,
          score: Math.round(score),
          percentage: Math.round(score),
        }))
        .sort((a, b) => b.score - a.score); // Sort by score descending

      setResults(formattedResults);
      setLoading(false);
    } catch (err) {
      console.error('Error calculating results:', err);
      setError('Failed to calculate results. Please make sure the backend server is running.');
      setLoading(false);
    }
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">
            Error Calculating Results
          </div>
          <div className="text-gray-600 dark:text-gray-400 mb-4">{error}</div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </button>
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

