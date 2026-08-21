import React, { useState, useEffect } from 'react';
import { Quest } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Swords, 
  Clock, 
  CheckCircle2, 
  Zap, 
  BrainCircuit, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  X,
  Target
} from 'lucide-react';

interface ActiveQuestModalProps {
  quest: Quest;
  onComplete: (questId: string) => void;
  onClose: () => void;
}

export const ActiveQuestModal: React.FC<ActiveQuestModalProps> = ({
  quest,
  onComplete,
  onClose,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(quest.timeMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [subtasks, setSubtasks] = useState([
    { id: 1, text: 'Review core concepts and problem requirements', done: true },
    { id: 2, text: 'Implement key algorithm or written solution deliverables', done: false },
    { id: 3, text: 'Self-evaluate edge cases and verify clean submission', done: false },
  ]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const toggleSubtask = (id: number) => {
    sound.playClick();
    setSubtasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleFinish = () => {
    sound.playQuestComplete();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#6366f1', '#10b981'],
    });
    onComplete(quest.id);
    onClose();
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 space-y-6">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-800 font-mono">
                {quest.category}
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {quest.difficulty}
              </span>
            </div>
            <h3 className="mt-1 font-extrabold text-white text-lg sm:text-xl">
              {quest.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Focus Timer */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 font-mono text-sm font-bold border border-cyan-500/30">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                DEEP WORK FOCUS TIMER
              </span>
              <div className="text-2xl font-black text-white font-mono">
                {formatTimer(secondsLeft)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setIsRunning(!isRunning);
              }}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                isRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-cyan-500 text-slate-950 shadow-md hover:bg-cyan-400'
              }`}
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-slate-950" />}
              <span>{isRunning ? 'PAUSE' : 'START FOCUS'}</span>
            </button>
          </div>
        </div>

        {/* Subtasks Checklist */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            MISSION CHECKLIST:
          </span>
          <div className="space-y-2">
            {subtasks.map((st) => (
              <div
                key={st.id}
                onClick={() => toggleSubtask(st.id)}
                className={`cursor-pointer flex items-center gap-3 rounded-xl border p-3 text-xs transition-all ${
                  st.done
                    ? 'border-emerald-800/60 bg-emerald-950/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border ${
                  st.done ? 'border-emerald-500 bg-emerald-500 text-slate-950 font-bold' : 'border-slate-700 bg-slate-900'
                }`}>
                  {st.done && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
                <span className={st.done ? 'line-through text-slate-400' : ''}>{st.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact & Reward Bar */}
        <div className="rounded-xl border border-indigo-900/30 bg-indigo-950/20 p-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">SKILL REWARD</span>
            <p className="font-bold text-cyan-300 mt-0.5">{quest.skillImpact}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase">XP PAYOUT</span>
            <p className="font-black text-emerald-400 font-mono text-sm">+{quest.xp} XP</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleFinish}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 py-3.5 text-sm font-black text-white shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span>SUBMIT WORK & CLAIM REWARDS (+{quest.xp} XP)</span>
        </button>
      </div>
    </div>
  );
};
