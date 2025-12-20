import React from 'react';

export interface QuizQuestion {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctOption: 'A' | 'B' | 'C' | 'D';
  difficulty: 'easy' | 'medium' | 'hard';
  concepts: string[];
}

interface QuizSectionProps {
  questions: QuizQuestion[];
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
  onSelect: (questionId: number, opt: 'A' | 'B' | 'C' | 'D') => void;
  onSubmit: () => void;
  quizSubmitted: boolean;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  answers,
  onSelect,
  onSubmit,
  quizSubmitted
}) => {
  return (
    <div className="w-full py-4 animate-fade-in">
      {questions.map((q) => (
        <div
          key={q.id}
          className="mb-6 bg-slate-900/40 border border-slate-700/50 rounded-2xl shadow-xl p-6 animate-fade-in-up backdrop-blur-md"
        >
          {/* Question Header */}
          <div className="flex items-center gap-3 mb-2">
            <span className="flex-none font-mono text-sm px-2 py-1 bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-lg text-emerald-300">
              Q{q.id}
            </span>
            <span className="font-bold text-emerald-100 text-lg">{q.question}</span>
            <span
              className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${
                q.difficulty === 'hard'
                  ? 'bg-rose-900 text-rose-300'
                  : q.difficulty === 'medium'
                  ? 'bg-yellow-900 text-yellow-300'
                  : 'bg-emerald-900 text-emerald-200'
              }`}
            >
              {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
            </span>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3 mt-2">
            {(['A', 'B', 'C', 'D'] as const).map((key) => {
              const isSelected = answers[q.id] === key;

              return (
                <button
                  key={key}
                  onClick={() => onSelect(q.id, key)}
                  disabled={quizSubmitted}
                  className={`relative text-left p-4 rounded-xl border-2 font-medium transition-all duration-300
                    ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-800 to-emerald-600 text-emerald-50 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.7)] border-emerald-400'
                        : 'bg-slate-900/50 border-slate-700 text-gray-300 hover:bg-slate-800/70 hover:text-emerald-200 hover:scale-105 hover:shadow-[0_0_12px_rgba(16,185,129,0.5)] hover:border-emerald-400'
                    }
                    ${quizSubmitted ? 'opacity-60 pointer-events-none' : ''}`}
                >
                  <span className="font-bold mr-2">{key}.</span>
                  <span>{q.options[key]}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <button
        className={`w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20 transition-all mt-6 ${
          quizSubmitted ? 'opacity-60 cursor-not-allowed' : ''
        }`}
        disabled={quizSubmitted}
        onClick={onSubmit}
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizSection;
