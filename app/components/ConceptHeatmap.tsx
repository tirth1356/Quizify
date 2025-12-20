import React from 'react';

export interface ConceptChip {
  name: string;
  importance: number;
  difficultyDensity: number;
  referencedBy: number[];
}

interface ConceptHeatmapProps {
  concepts: ConceptChip[];
  selectedConcept?: string;
  onSelectConcept?: (name: string) => void;
}

// Subtle glass-like colors matching the dark brown theme
function getColorClass(density: number) {
  if (density < 1) return 'bg-emerald-900/40 border-emerald-700/50 text-emerald-200';
  if (density < 2) return 'bg-amber-900/40 border-amber-700/50 text-amber-200';
  return 'bg-red-900/40 border-red-700/50 text-red-200';
}

function getSizeClass(importance: number) {
  const normalized = Math.max(0.3, Math.min(1, importance));
  if (normalized >= 0.8) return 'text-base px-4 py-2';
  if (normalized >= 0.6) return 'text-sm px-3 py-1.5';
  if (normalized >= 0.4) return 'text-xs px-2.5 py-1';
  return 'text-xs px-2 py-1';
}

export const ConceptHeatmap: React.FC<ConceptHeatmapProps> = ({ concepts, selectedConcept, onSelectConcept }) => {
  if (concepts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-300/70">
        No concepts extracted
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3 items-center justify-center py-6 px-2">
        {concepts.map((concept, idx) => {
          const isSelected = selectedConcept === concept.name;
          const sizeClass = getSizeClass(concept.importance);
          const colorClass = getColorClass(concept.difficultyDensity);
          
          return (
            <button
              key={concept.name}
              onClick={() => onSelectConcept?.(concept.name)}
              className={`group relative transition-all duration-300 ease-out z-auto ${
                isSelected ? 'scale-105' : 'hover:scale-102'
              }`}
              style={{
                animationDelay: `${idx * 30}ms`,
                zIndex: isSelected ? 50 : 'auto',
              }}
            >
              <div
                className={`
                  ${colorClass}
                  ${sizeClass}
                  backdrop-blur-md
                  rounded-lg
                  font-medium
                  shadow-sm
                  border
                  ${isSelected ? 'ring-2 ring-gray-400/50 ring-offset-2 ring-offset-black/50' : ''}
                  hover:border-opacity-80
                  hover:shadow-md
                  hover:bg-opacity-60
                  transition-all
                `}
              >
                {concept.name}
              </div>
              
              {/* Subtle tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]">
                <div className="backdrop-blur-xl bg-black/90 text-gray-100 text-xs px-3 py-2 rounded-lg shadow-xl border border-white/20 whitespace-nowrap">
                  <div className="font-semibold mb-0.5">{concept.name}</div>
                  <div className="text-gray-300/70 text-xs">
                    {concept.referencedBy.length} question{concept.referencedBy.length !== 1 ? 's' : ''}
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Subtle legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300/60">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded backdrop-blur-md bg-emerald-900/40 border border-emerald-700/50"></div>
          <span>Easy concepts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded backdrop-blur-md bg-amber-900/40 border border-amber-700/50"></div>
          <span>Medium concepts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded backdrop-blur-md bg-red-900/40 border border-red-700/50"></div>
          <span>Hard concepts</span>
        </div>
        <div className="text-gray-400/50 ml-4">
          Size = importance
        </div>
      </div>
    </div>
  );
};

export default ConceptHeatmap;
