'use client';

interface Coalition {
  id: string;
  name: string;
  description: string;
  score: number;
  percentage: number;
}

interface ResultCardProps {
  coalition: Coalition;
  rank: number;
}

export default function ResultCard({ coalition, rank }: ResultCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
            #{rank}
          </span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
            {coalition.name}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {coalition.percentage.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Score: {coalition.score}
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300">
        {coalition.description}
      </p>
      
      <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${coalition.percentage}%` }}
        />
      </div>
    </div>
  );
}

