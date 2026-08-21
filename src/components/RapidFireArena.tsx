import React, { useState, useEffect } from 'react';
import { RapidFireQuestion } from '../types';
import { sound } from '../utils/sound';
import { 
  Sparkles, 
  Clock, 
  Swords, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Trophy, 
  RotateCcw, 
  Flame, 
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

interface RapidFireArenaProps {
  initialTopic?: string;
  onFinishQuiz: (score: number, total: number, earnedXp: number, weakArea: string) => void;
  onClose: () => void;
}

export const RapidFireArena: React.FC<RapidFireArenaProps> = ({
  initialTopic = 'Data Structures & Algorithms',
  onFinishQuiz,
  onClose,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [questions, setQuestions] = useState<RapidFireQuestion[]>([
    {
      id: 1,
      question: 'What is the average search time complexity in a balanced Binary Search Tree (BST)?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctIndex: 1,
      explanation: 'In a balanced BST, tree height is log n, halving the search space each step.',
      damage: 100,
      xp: 20,
    },
    {
      id: 2,
      question: 'Which data structure follows the LIFO principle and manages function call execution stacks?',
      options: ['Queue', 'Stack', 'Priority Queue', 'Linked List'],
      correctIndex: 1,
      explanation: 'Stacks operate on Last-In-First-Out, making them ideal for recursion and back-tracking.',
      damage: 100,
      xp: 20,
    },
    {
      id: 3,
      question: 'Floyd’s Cycle-Finding Algorithm (Tortoise and Hare) detects linked list loops with what space complexity?',
      options: ['O(N) space', 'O(1) auxiliary space', 'O(log N) space', 'O(N^2) space'],
      correctIndex: 1,
      explanation: 'Using slow and fast pointers requires zero auxiliary memory (O(1)).',
      damage: 100,
      xp: 20,
    },
    {
      id: 4,
      question: 'Which technique avoids recomputing identical sub-problems in Dynamic Programming?',
      options: ['Greedy Choice', 'Memoization / Tabulation', 'Binary Bisection', 'Linear Probe'],
      correctIndex: 1,
      explanation: 'Memoization caches recursive states into a lookup table to achieve polynomial runtime.',
      damage: 100,
      xp: 20,
    },
    {
      id: 5,
      question: 'Which data structure is primarily used to implement Breadth-First Search (BFS)?',
      options: ['Stack', 'FIFO Queue', 'Max Binary Heap', 'Red-Black Tree'],
      correctIndex: 1,
      explanation: 'BFS explores graph vertices level by level using a First-In-First-Out Queue.',
      damage: 100,
      xp: 20,
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (quizFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizFinished]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered || quizFinished) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      sound.playBossHit();
      setScore((s) => s + 1);
      setTotalXp((x) => x + currentQ.xp);
    } else {
      sound.playClick();
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    sound.playQuestComplete();
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-amber-500/10 space-y-6">
        {/* Top Battle Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm">
              ⚔️
            </span>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                RAPID-FIRE COMBAT ARENA
              </h3>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                Topic: {topic}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 border font-mono font-bold text-xs ${
              timeLeft < 15
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                : 'bg-slate-800 text-amber-400 border-slate-700'
            }`}>
              <Clock className="h-3.5 w-3.5" />
              <span>{timeLeft}s</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {!quizFinished ? (
          <div className="space-y-6">
            {/* Progress & Score */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span className="text-emerald-400 font-mono">Current XP: +{totalXp}</span>
            </div>

            {/* Question Text */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = 'border-slate-800 bg-slate-900 hover:border-cyan-500/40 text-slate-200';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-950/50 text-emerald-300 ring-1 ring-emerald-500';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-950/50 text-rose-300 ring-1 ring-rose-500';
                  } else {
                    btnStyle = 'border-slate-800 bg-slate-950/50 text-slate-500 opacity-50';
                  }
                }

                return (
                  <button
                    key={opt + idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left text-xs sm:text-sm font-semibold transition-all ${btnStyle}`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-[11px] font-mono font-bold text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Trigger */}
            {isAnswered && (
              <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="text-xs text-slate-300">
                  <strong className="text-indigo-400">AI Context: </strong>
                  {currentQ.explanation}
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-extrabold text-white shadow-md hover:brightness-110"
                >
                  <span>{currentIndex + 1 === questions.length ? 'FINISH' : 'NEXT STRIKE'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Victory / Results Screen */
          <div className="text-center space-y-5 py-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 text-3xl">
              🏆
            </div>
            <div>
              <h4 className="text-2xl font-black text-white">BATTLE CONCLUDED!</h4>
              <p className="text-xs text-slate-400 mt-1">
                You executed rapid combat strikes against {topic}.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="block text-[10px] text-slate-500 font-bold uppercase">SCORE</span>
                <span className="text-lg font-black text-cyan-400 font-mono">{score}/{questions.length}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="block text-[10px] text-slate-500 font-bold uppercase">XP EARNED</span>
                <span className="text-lg font-black text-emerald-400 font-mono">+{totalXp}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="block text-[10px] text-slate-500 font-bold uppercase">SKILL GAIN</span>
                <span className="text-lg font-black text-amber-400 font-mono">+5% DSA</span>
              </div>
            </div>

            {/* Weak Area Quest Synthesis */}
            <div className="rounded-2xl border border-indigo-900/40 bg-indigo-950/20 p-4 text-left space-y-2">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4 text-indigo-400" />
                WEAK AREA ISOLATED & NEW QUEST GENERATED
              </span>
              <p className="text-xs text-slate-300">
                Identified minor hesitation on <strong>Tree & Graph Recursion</strong>. Created: <em>"Defeat the Binary Tree Mini-Boss"</em>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onFinishQuiz(score, questions.length, totalXp, 'Binary Trees');
                  onClose();
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg hover:brightness-110"
              >
                <span>CLAIM XP & RETURN TO BASE</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
