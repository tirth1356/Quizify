import React from 'react';

export interface QuizQuestion {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctOption: 'A' | 'B' | 'C' | 'D';
  difficulty: 'easy' | 'medium' | 'hard';
  concepts: string[]; // kept for compatibility; source will use model 'llama-3.1-8b-instant'
}

interface QuizSectionProps {
  questions: QuizQuestion[];
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
  onSelect: (questionId: number, opt: 'A' | 'B' | 'C' | 'D') => void;
  onSubmit: () => void;
  quizSubmitted: boolean;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ questions, answers, onSelect, onSubmit, quizSubmitted }) => {
  return (
    <div className="w-full py-4 fade-in">
      {questions.map((q) => (
        <div key={q.id} className="mb-6 bg-emerald-950/25 border border-emerald-800/40 rounded-2xl shadow-xl p-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex-none font-mono text-sm px-2 py-1 bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-lg text-emerald-300">Q{q.id}</span>
            <span className="font-bold text-emerald-100 text-lg">{q.question}</span>
            <span className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${q.difficulty === 'hard' ? 'bg-rose-900 text-rose-300' : q.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-emerald-900 text-emerald-200'}`}>{q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}</span>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {(['A','B','C','D'] as const).map((key) => (
              <button key={key} className={`transition-all rounded-xl p-3 text-left border font-medium ${answers[q.id] === key ? 'bg-emerald-800/50 border-emerald-300 text-emerald-100 scale-[1.03]' : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-emerald-400'} ${quizSubmitted ? 'opacity-60 pointer-events-none' : ''}`} onClick={() => onSelect(q.id, key)} disabled={quizSubmitted}>
                <span className="font-bold mr-2">{key}.</span>{q.options[key]}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20 transition-all mt-6" disabled={quizSubmitted} onClick={onSubmit}>Submit Quiz</button>
    </div>
  );
};
export default QuizSection;


