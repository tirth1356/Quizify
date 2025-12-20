'use client';

import { useState, useMemo } from 'react';
import DifficultySelector from './components/DifficultySelector';
import ConceptHeatmap, { ConceptChip } from './components/ConceptHeatmap';
import HierarchyTree from './components/HierarchyTree';

/**
 * Types matching Groq API JSON response
 */
interface Concept {
  name: string;
  definition: string;
  importance: number;
}
interface TopicHierarchy {
  topic: string;
  subtopics: { subtopic: string; concepts: string[] }[];
}
interface GroqQuizQuestion {
  question: string;
  options: [string, string, string, string];
  answer: 'A' | 'B' | 'C' | 'D';
  difficulty: 'easy' | 'medium' | 'hard';
  relatedConcepts: string[];
}

interface GroqData {
  concepts: Concept[];
  topicHierarchy: TopicHierarchy[];
  quiz: GroqQuizQuestion[];
  selfCheck: 'pass' | 'fail';
}

interface TransformedQuestion {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctOption: 'A' | 'B' | 'C' | 'D';
  difficulty: 'easy' | 'medium' | 'hard';
  relatedConcepts: string[];
}

type Stage = 'input' | 'concepts' | 'hierarchy' | 'quiz' | 'results' | 'review';

export default function Home() {
  const [text, setText] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy'|'medium'|'hard'|'mixed'|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('input');
  const [apiData, setApiData] = useState<GroqData | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string|undefined>(undefined);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, 'A'|'B'|'C'|'D'|null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number; wrongQuestions: number[] } | null>(null);
  const [reveals, setReveals] = useState<{concepts: boolean; hierarchy: boolean; quiz: boolean}>({concepts: false, hierarchy: false, quiz: false});

  // Transform API questions to UI format
  const transformedQuestions = useMemo<TransformedQuestion[]>(() => {
    if (!apiData?.quiz) return [];
    return apiData.quiz.map((q, idx) => ({
      id: idx + 1,
      question: q.question,
      options: {
        A: q.options[0],
        B: q.options[1],
        C: q.options[2],
        D: q.options[3],
      },
      correctOption: q.answer,
      difficulty: q.difficulty,
      relatedConcepts: q.relatedConcepts || [],
    }));
  }, [apiData]);

  // Transform concepts for heatmap
  const conceptChips = useMemo<ConceptChip[]>(() => {
    if (!apiData?.concepts || !apiData?.quiz) return [];
    const conceptMap = new Map<string, { importance: number; hardRefs: number; totalRefs: number }>();
    
    apiData.concepts.forEach(c => {
      conceptMap.set(c.name, { importance: c.importance || 1, hardRefs: 0, totalRefs: 0 });
    });

    apiData.quiz.forEach((q, qIdx) => {
      q.relatedConcepts?.forEach(conceptName => {
        const entry = conceptMap.get(conceptName);
        if (entry) {
          entry.totalRefs++;
          if (q.difficulty === 'hard') entry.hardRefs++;
        }
      });
    });

    return Array.from(conceptMap.entries()).map(([name, data]) => ({
      name,
      importance: data.importance / 5, // normalize to 0-1
      difficultyDensity: data.hardRefs,
      referencedBy: Array.from({ length: data.totalRefs }, (_, i) => i + 1),
    }));
  }, [apiData]);

  // Transform hierarchy for display
  const hierarchyData = useMemo(() => {
    if (!apiData?.topicHierarchy) return [];
    return apiData.topicHierarchy.map(t => ({
      topic: t.topic,
      subtopics: t.subtopics.map(st => ({
        name: st.subtopic,
        concepts: st.concepts || [],
      })),
    }));
  }, [apiData]);

  // Unified AI call handler
  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }
    if (!selectedDifficulty) {
      setError('Please select a difficulty level');
      return;
    }
    setLoading(true);
    setError(null);
    setReveals({concepts: false, hierarchy: false, quiz: false});
    setSelectedConcept(undefined);
    setApiData(null);
    setStage('input');

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, difficulty: selectedDifficulty }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract and generate quiz');
      }
      const apiResult: GroqData = await response.json();
      setApiData(apiResult);
      setQuizAnswers({});
      setQuizSubmitted({});
      setQuizScore(null);
      setStage('concepts');
      setTimeout(() => setReveals((r) => ({ ...r, concepts: true })), 300);
      setTimeout(() => setStage('hierarchy'), 950);
      setTimeout(() => setReveals((r) => ({ ...r, hierarchy: true })), 1200);
      setTimeout(() => setStage('quiz'), 2000);
      setTimeout(() => setReveals((r) => ({ ...r, quiz: true })), 2300);
    } catch (err) {
      setError((err instanceof Error) ? err.message : 'An error occurred');
      setStage('input');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, option: 'A' | 'B' | 'C' | 'D') => {
    if (!quizSubmitted[questionId]) {
      setQuizAnswers((prev) => ({
        ...prev,
        [questionId]: option,
      }));
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const wrongQuestions: number[] = [];
    
    transformedQuestions.forEach((q) => {
      const userAnswer = quizAnswers[q.id];
      if (userAnswer === q.correctOption) {
        correctCount++;
      } else {
        wrongQuestions.push(q.id);
      }
    });

    setQuizScore({
      correct: correctCount,
      total: transformedQuestions.length,
      wrongQuestions,
    });
    setQuizSubmitted(Object.fromEntries(transformedQuestions.map(q => [q.id, true])));
    setStage('results');
  };

  const handleAttemptAgain = () => {
    setQuizAnswers({});
    setQuizSubmitted({});
    setQuizScore(null);
    setStage('quiz');
    setReveals({concepts: true, hierarchy: true, quiz: true});
  };

  const handleReviewAnswers = () => {
    setStage('review');
  };

  const handleReset = () => {
    setText('');
    setSelectedDifficulty(null);
    setApiData(null);
    setQuizAnswers({});
    setQuizSubmitted({});
    setQuizScore(null);
    setStage('input');
    setError(null);
    setReveals({concepts: false, hierarchy: false, quiz: false});
  };

  // Learning Gap Detector: find concepts from wrong answers
  const strugglingConcepts = useMemo(() => {
    if (!quizScore?.wrongQuestions || !apiData) return [];
    const conceptCounts = new Map<string, number>();
    
    quizScore.wrongQuestions.forEach(qId => {
      const question = transformedQuestions.find(q => q.id === qId);
      question?.relatedConcepts.forEach(concept => {
        conceptCounts.set(concept, (conceptCounts.get(concept) || 0) + 1);
      });
    });

    return Array.from(conceptCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
  }, [quizScore, transformedQuestions, apiData]);

  return (
    <div className="min-h-screen glass-bg transition-all duration-300 flex flex-col">
      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 w-full">
        {/* Centered Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-100 mb-3">
            Quizify
          </h1>
          <p className="text-lg text-gray-300/70">
            Turn educational content into structured knowledge and quizzes
          </p>
        </div>

        {/* Input Stage */}
        {stage === 'input' && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/8 transition-all">
              <form onSubmit={handleExtract} className="space-y-6">
                <div>
                  <label htmlFor="text" className="block text-sm font-semibold text-gray-200 mb-3">
                    Paste Educational Text
                  </label>
                  <textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your educational content here (articles, textbook excerpts, research summaries, etc.)"
                    className="w-full h-56 p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 resize-none"
                  />
                </div>

                {text.trim() && (
                  <div className="animate-in fade-in duration-300">
                    <DifficultySelector
                      onSelect={setSelectedDifficulty}
                      selected={selectedDifficulty}
                      disabled={loading}
                    />
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-xl bg-red-900/30 border border-red-600/50 text-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !text.trim()}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all backdrop-blur-md ${
                    loading || !text.trim()
                      ? 'bg-white/10 text-gray-400 cursor-not-allowed opacity-50 border border-white/10'
                      : 'bg-white/10 border border-white/20 text-gray-100 hover:bg-white/15 hover:border-white/30 active:scale-95 shadow-lg'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Generate Quiz'
                  )}
                </button>
              </form>
            </div>

            {/* How to Use Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-10">
              <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="text-lg font-bold text-gray-100 mb-2">Paste Text</h3>
                <p className="text-gray-300/70 text-sm">Copy and paste any educational content, article, or study material into the text area above.</p>
              </div>
               <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="text-lg font-bold text-gray-100 mb-2">Select Difficulty</h3>
                <p className="text-gray-300/70 text-sm">Choose your preferred quiz difficulty level: Easy, Medium, Hard, or Mixed for variety.</p>
              </div>
               <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-bold text-gray-100 mb-2">Take Quiz</h3>
                <p className="text-gray-300/70 text-sm">Review extracted concepts, explore the topic hierarchy, and test your knowledge with AI-generated questions.</p>
              </div>
            </div>
          </div>
        )}

        {/* Concepts Stage */}
        {(stage === 'concepts' || stage === 'hierarchy' || stage === 'quiz') && reveals.concepts && apiData && (
          <div className="space-y-6 mb-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/8 transition-all">
              <h2 className="text-2xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 shadow-lg shadow-gray-400/50"></div>
                Extracted Concepts
              </h2>
              <ConceptHeatmap
                concepts={conceptChips}
                selectedConcept={selectedConcept}
                onSelectConcept={setSelectedConcept}
              />
            </div>
          </div>
        )}

        {/* Hierarchy Stage */}
        {(stage === 'hierarchy' || stage === 'quiz') && reveals.hierarchy && apiData && (
          <div className="space-y-6 mb-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/8 transition-all">
              <h2 className="text-2xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 shadow-lg shadow-gray-400/50"></div>
                Topic Hierarchy
              </h2>
              <HierarchyTree hierarchy={hierarchyData} />
            </div>
          </div>
        )}

        {/* Quiz Stage */}
        {stage === 'quiz' && reveals.quiz && transformedQuestions.length > 0 && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 shadow-lg shadow-gray-400/50"></div>
                  Quiz: Answer all questions and click Submit Quiz
                </span>
              </div>
            </div>

            {transformedQuestions.map((question) => {
              const hoverColors = {
                easy: 'hover:bg-emerald-500/20 hover:border-emerald-400/40',
                medium: 'hover:bg-amber-500/20 hover:border-amber-400/40',
                hard: 'hover:bg-red-500/20 hover:border-red-400/40',
              };
              const badgeColors = {
                easy: 'bg-emerald-900/60 text-emerald-200 border-emerald-600/60',
                medium: 'bg-amber-900/60 text-amber-200 border-amber-600/60',
                hard: 'bg-red-900/60 text-red-200 border-red-600/60',
              };
              
              return (
              <div
                key={question.id}
                className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl transition-all ${hoverColors[question.difficulty]}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-100 flex-1">
                    Question {question.id}: {question.question}
                  </h3>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${badgeColors[question.difficulty]} border ml-3 whitespace-nowrap`}>
                    {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {(['A', 'B', 'C', 'D'] as const).map((optionKey) => {
                    const isSelected = quizAnswers[question.id] === optionKey;
                    const isCorrect = optionKey === question.correctOption;
                    const isSubmitted = quizSubmitted[question.id];
                    const isWrong = isSelected && isSubmitted && !isCorrect;

                    return (
                      <button
                        key={optionKey}
                        onClick={() => handleAnswerSelect(question.id, optionKey)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          isSubmitted
                            ? isCorrect
                              ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-100'
                              : isWrong
                              ? 'bg-red-500/20 border-red-400/50 text-red-100'
                              : 'bg-white/5 border-white/10 text-gray-400'
                            : isSelected
                            ? 'bg-white/10 border-white/20 text-gray-100'
                            : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-bold text-sm mt-0.5">{optionKey}.</span>
                          <span>{question.options[optionKey]}</span>
                          {isSubmitted && isCorrect && (
                            <span className="ml-auto text-emerald-400">✓</span>
                          )}
                          {isSubmitted && isWrong && (
                            <span className="ml-auto text-red-400">✗</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              );
            })}

            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(quizAnswers).length < transformedQuestions.length}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all backdrop-blur-md ${
                Object.keys(quizAnswers).length < transformedQuestions.length
                  ? 'bg-white/10 text-gray-400 cursor-not-allowed opacity-50 border border-white/10'
                  : 'bg-white/10 border border-white/20 text-gray-100 hover:bg-white/15 hover:border-white/30 active:scale-95 shadow-lg'
              }`}
            >
              Submit Quiz
            </button>
          </div>
        )}

        {/* Results Stage */}
        {stage === 'results' && quizScore && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">Quiz Complete!</h2>

              <div className="flex justify-around items-center mb-8">
                <div>
                  <div className="text-5xl font-bold text-gray-300">{quizScore.correct}</div>
                  <div className="text-gray-300 text-sm mt-2">Correct</div>
                </div>
                <div className="text-3xl text-gray-400">/</div>
                <div>
                  <div className="text-5xl font-bold text-gray-300">{quizScore.total}</div>
                  <div className="text-gray-300 text-sm mt-2">Total</div>
                </div>
              </div>

              <div className="text-4xl font-bold text-gray-100 mb-6">
                {Math.round((quizScore.correct / quizScore.total) * 100)}%
              </div>

              <p className="text-gray-300 text-lg mb-8">
                {quizScore.correct === quizScore.total
                  ? '🎉 Perfect score! Outstanding work!'
                  : quizScore.correct >= quizScore.total * 0.8
                  ? '✓ Great job! You passed!'
                  : quizScore.correct >= quizScore.total * 0.6
                  ? '→ Good effort. Review the concepts and try again!'
                  : '→ Keep learning! Try reviewing the material and attempt again!'}
              </p>

              {/* Learning Gap Detector */}
              {strugglingConcepts.length > 0 && (
                <div className="mb-8 p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Learning Gap Detector</h3>
                  <p className="text-gray-300">
                    You struggled most with: <strong className="text-gray-100">{strugglingConcepts.join(', ')}</strong>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mt-8">
                <button
                  onClick={handleAttemptAgain}
                  className="w-full py-3 px-6 rounded-xl font-semibold backdrop-blur-md bg-white/10 border border-white/20 text-gray-100 hover:bg-white/15 hover:border-white/30 active:scale-95 shadow-lg transition-all"
                >
                  Attempt This Again
                </button>
                <button
                  onClick={handleReviewAnswers}
                  className="w-full py-3 px-6 rounded-xl font-semibold backdrop-blur-md bg-white/10 border border-white/20 text-gray-100 hover:bg-white/15 hover:border-white/30 active:scale-95 shadow-lg transition-all"
                >
                  Review Answers
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-3 px-6 rounded-xl font-semibold backdrop-blur-md bg-white/10 border border-white/20 text-gray-100 hover:bg-white/15 hover:border-white/30 active:scale-95 shadow-lg transition-all"
                >
                  Start All Over
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Stage */}
        {stage === 'review' && transformedQuestions.length > 0 && quizScore && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Review Answers</h2>
              <p className="text-gray-300/70 text-sm">Correct answers are highlighted in green</p>
            </div>

            {transformedQuestions.map((question) => {
              const userAnswer = quizAnswers[question.id];
              const isCorrect = userAnswer === question.correctOption;
              const hoverColors = {
                easy: 'hover:bg-emerald-500/20 hover:border-emerald-400/40',
                medium: 'hover:bg-amber-500/20 hover:border-amber-400/40',
                hard: 'hover:bg-red-500/20 hover:border-red-400/40',
              };

              return (
                <div
                  key={question.id}
                  className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl transition-all ${hoverColors[question.difficulty]}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-100 flex-1">
                      Question {question.id}: {question.question}
                    </h3>
                    <div className="flex gap-2 ml-3">
                      {isCorrect ? (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-900/60 text-emerald-200 border border-emerald-600/60">
                          ✓ Correct
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-900/60 text-red-200 border border-red-600/60">
                          ✗ Incorrect
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900/60 text-slate-300 border border-slate-700/60">
                        {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(['A', 'B', 'C', 'D'] as const).map((optionKey) => {
                      const isUserChoice = userAnswer === optionKey;
                      const isCorrectAnswer = optionKey === question.correctOption;

                      let optionClass = 'bg-white/5 border-white/10 text-gray-400';
                      if (isCorrectAnswer) {
                        optionClass = 'bg-emerald-900/50 border-emerald-500 text-emerald-100';
                      } else if (isUserChoice && !isCorrect) {
                        optionClass = 'bg-red-900/40 border-red-500 text-red-100';
                      }

                      return (
                        <div
                          key={optionKey}
                          className={`p-4 rounded-xl border-2 ${optionClass} flex items-start gap-3`}
                        >
                          <span className="font-bold text-sm mt-0.5">{optionKey}.</span>
                          <span className="flex-1">{question.options[optionKey]}</span>
                          {isCorrectAnswer && (
                            <span className="text-emerald-400 font-bold">✓ Correct Answer</span>
                          )}
                          {isUserChoice && !isCorrect && (
                            <span className="text-red-400 font-bold">Your Answer</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="flex gap-3">
              <button
                onClick={() => setStage('results')}
                className="flex-1 py-3 px-6 rounded-xl font-semibold backdrop-blur-md bg-white/10 border border-white/20 text-gray-100 hover:bg-white/15 hover:border-white/30 active:scale-95 shadow-lg transition-all"
              >
                Back to Results
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-6 rounded-xl font-semibold backdrop-blur-md bg-white/10 border border-white/20 text-gray-100 hover:bg-white/15 hover:border-white/30 active:scale-95 shadow-lg transition-all"
              >
                Start All Over
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400/70 text-sm">
            Made with <span className="text-red-400">❤️</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
