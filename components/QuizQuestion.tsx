'use client';

import { useState, useEffect } from 'react';

interface QuizQuestionProps {
  question: {
    id: number;
    text: string;
    options: Array<{
      id: number;
      text: string;
      value: number;
    }>;
  };
  onAnswer: (questionId: number, optionId: number, value: number) => void;
  currentQuestion: number;
  totalQuestions: number;
  selectedValue?: number;
}

export default function QuizQuestion({
  question,
  onAnswer,
  currentQuestion,
  totalQuestions,
  selectedValue,
}: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Reset selection when question changes
  useEffect(() => {
    if (selectedValue !== undefined) {
      // Find the option ID that matches the selected value
      const matchingOption = question.options.find(opt => opt.value === selectedValue);
      setSelectedOption(matchingOption?.id || null);
    } else {
      setSelectedOption(null);
    }
  }, [question.id, selectedValue, question.options]);

  const handleOptionSelect = (optionId: number, value: number) => {
    setSelectedOption(optionId);
    onAnswer(question.id, optionId, value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Question {currentQuestion} of {totalQuestions}
        </span>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id, option.value)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedOption === option.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <span className="text-gray-900 dark:text-gray-100">
              {option.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

