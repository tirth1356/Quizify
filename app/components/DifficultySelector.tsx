'use client';

interface DifficultySelectorProps {
  onSelect: (difficulty: 'easy' | 'medium' | 'hard' | 'mixed') => void;
  selected: 'easy' | 'medium' | 'hard' | 'mixed' | null;
  disabled?: boolean;
}

export default function DifficultySelector({
  onSelect,
  selected,
  disabled = false,
}: DifficultySelectorProps) {
  const options: Array<{
    value: 'easy' | 'medium' | 'hard' | 'mixed';
    label: string;
    description: string;
  }> = [
    {
      value: 'easy',
      label: 'Easy',
      description: 'Basic concepts and definitions',
    },
    {
      value: 'medium',
      label: 'Medium',
      description: 'Understanding and application',
    },
    {
      value: 'hard',
      label: 'Hard',
      description: 'Analysis and synthesis',
    },
    {
      value: 'mixed',
      label: 'Mixed',
      description: 'All difficulty levels',
    },
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-200 mb-3">
        Select Question Difficulty
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            disabled={disabled}
            className={`p-3 rounded-xl border-2 transition-all text-sm font-medium backdrop-blur-sm ${
              selected === option.value
                ? 'bg-white/15 border-white/30 text-gray-100'
                : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="font-semibold">{option.label}</div>
            <div className="text-xs text-gray-300/70 mt-1">
              {option.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
