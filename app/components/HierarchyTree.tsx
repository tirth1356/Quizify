import React, { useState } from 'react';

interface Hierarchy {
  topic: string;
  subtopics: { name: string; concepts: string[] }[];
}

interface HierarchyTreeProps {
  hierarchy: Hierarchy[];
  expandAll?: boolean;
}

export const HierarchyTree: React.FC<HierarchyTreeProps> = ({ hierarchy, expandAll = false }) => {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(
    expandAll ? new Set(hierarchy.map(t => t.topic)) : new Set()
  );

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) {
        next.delete(topic);
      } else {
        next.add(topic);
      }
      return next;
    });
  };

  if (hierarchy.length === 0) {
    return (
      <div className="text-center py-8 text-gray-300/70">
        No hierarchy data available
      </div>
    );
  }

  return (
    <div className="w-full py-4 space-y-4">
      {hierarchy.map((topic, topicIdx) => {
        const isExpanded = expandedTopics.has(topic.topic);
        const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
        
        return (
          <div
            key={topic.topic}
            className="animate-fade-in-up backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 shadow-lg hover:bg-white/8 transition-all"
            style={{ animationDelay: `${topicIdx * 100}ms` }}
          >
            {/* Topic Header */}
            <button
              onClick={() => hasSubtopics && toggleTopic(topic.topic)}
              className={`w-full flex items-center justify-between text-left ${
                hasSubtopics ? 'cursor-pointer hover:text-gray-200' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-400 shadow-lg shadow-gray-400/50"></div>
                <h3 className="text-xl font-bold text-gray-300">{topic.topic}</h3>
                {hasSubtopics && (
                  <span className="text-xs text-gray-400/70 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                    {topic.subtopics.length} subtopic{topic.subtopics.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {hasSubtopics && (
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {/* Subtopics */}
            {hasSubtopics && isExpanded && (
              <div className="mt-4 pl-6 space-y-4 border-l-2 border-white/20 ml-2">
                {topic.subtopics.map((subtopic, subIdx) => (
                  <div
                    key={subtopic.name}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(topicIdx * 100) + (subIdx * 50)}ms` }}
                  >
                    {/* Subtopic Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h4 className="text-lg font-semibold text-gray-200">{subtopic.name}</h4>
                      {subtopic.concepts && subtopic.concepts.length > 0 && (
                        <span className="text-xs text-gray-400/60 bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                          {subtopic.concepts.length} concept{subtopic.concepts.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Concepts */}
                    {subtopic.concepts && subtopic.concepts.length > 0 && (
                      <div className="flex flex-wrap gap-2 ml-4">
                        {subtopic.concepts.map((concept, conceptIdx) => (
                          <span
                            key={concept}
                            className="inline-flex items-center px-3 py-1.5 bg-white/10 text-gray-100 text-sm font-medium rounded-lg border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all shadow-sm hover:shadow-md hover:scale-105"
                          >
                            <span className="w-1 h-1 rounded-full bg-gray-400 mr-2"></span>
                            {concept}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Expand/Collapse All Button */}
      {hierarchy.length > 1 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => {
              if (expandedTopics.size === hierarchy.length) {
                setExpandedTopics(new Set());
              } else {
                setExpandedTopics(new Set(hierarchy.map(t => t.topic)));
              }
            }}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 border border-white/20 rounded-lg hover:bg-white/15 hover:border-white/30 transition-all"
          >
            {expandedTopics.size === hierarchy.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      )}
    </div>
  );
};

export default HierarchyTree;
