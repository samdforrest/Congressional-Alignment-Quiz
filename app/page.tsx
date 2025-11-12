'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStartQuiz = () => {
    // Clear any previous answers
    localStorage.removeItem('quizAnswers');
    router.push('/quiz');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <main className="w-full max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Congressional Coalition Quiz
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Discover which congressional coalition in the United States you align with
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            How it works
          </h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
              Answer a series of questions about your political views
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
              Our algorithm analyzes your responses
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
              Discover which congressional coalition best matches your positions
            </li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={handleStartQuiz}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Start Quiz
          </button>
        </div>
      </main>
    </div>
  );
}
