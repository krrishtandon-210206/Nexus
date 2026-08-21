import React, { useState } from 'react';
import { sound } from '../utils/sound';
import { 
  Coins, 
  TrendingUp, 
  PiggyBank, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Flame, 
  BrainCircuit,
  CreditCard,
  PieChart
} from 'lucide-react';

interface MoneyQuestsProps {
  onCompleteFinancialQuest: (xp: number, questName: string) => void;
}

export const MoneyQuests: React.FC<MoneyQuestsProps> = ({ onCompleteFinancialQuest }) => {
  const [budget, setBudget] = useState({
    monthlyAllowance: 5000,
    spent: 3420,
    saved: 650,
  });

  const [quests, setQuests] = useState([
    {
      id: 'fin-1',
      title: 'Log Today’s Campus Canteen & Coffee Expenses',
      desc: 'Record today’s discretionary food spend to maintain budget visibility.',
      xp: 40,
      impact: 'Financial Discipline +5',
      completed: false,
    },
    {
      id: 'fin-2',
      title: 'Save ₹500 into High-Yield Emergency Vault',
      desc: 'Transfer savings buffer before weekend impulse purchases occur.',
      xp: 120,
      impact: 'Savings Vault +15, Security +10',
      completed: false,
    },
    {
      id: 'fin-3',
      title: 'Audit & Cancel Unused SaaS / Streaming Subscriptions',
      desc: 'Verify active subscriptions to prevent silent bank balance leaks.',
      xp: 80,
      impact: 'Discretionary Cashflow +8',
      completed: false,
    },
    {
      id: 'fin-4',
      title: 'Complete 10-Min Student Investing Fundamentals Module',
      desc: 'Understand Index Funds, Compound Interest, and emergency cash reserves.',
      xp: 90,
      impact: 'Financial Literacy +12',
      completed: false,
    },
  ]);

  const remaining = budget.monthlyAllowance - budget.spent;
  const spentPercent = Math.round((budget.spent / budget.monthlyAllowance) * 100);

  const handleComplete = (id: string, xp: number, name: string) => {
    sound.playQuestComplete();
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: true } : q))
    );
    onCompleteFinancialQuest(xp, name);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-900/40 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-950 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              FINANCIAL LITERACY & SAVINGS ENGINE
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Coins className="h-6 w-6 text-emerald-400" />
            STUDENT FINANCIAL QUESTS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real financial discipline rewarded with RPG progression. Master student budgeting, save emergency buffers, and prevent debt.
          </p>
        </div>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md">
          <span className="text-xs font-bold text-slate-400">MONTHLY ALLOWANCE</span>
          <div className="mt-2 text-3xl font-black text-white font-mono">
            ₹{budget.monthlyAllowance.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Allocated for current calendar month</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">TOTAL EXPENDITURE</span>
            <span className="text-xs font-mono font-bold text-amber-400">{spentPercent}%</span>
          </div>
          <div className="mt-2 text-3xl font-black text-amber-400 font-mono">
            ₹{budget.spent.toLocaleString()}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${spentPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md">
          <span className="text-xs font-bold text-slate-400">REMAINING EMERGENCY BUFFER</span>
          <div className="mt-2 text-3xl font-black text-emerald-400 font-mono">
            ₹{remaining.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Healthy 12-day buffer
          </span>
        </div>
      </div>

      {/* Financial Quests Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">
          ACTIVE FINANCIAL MASTERY QUESTS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map((q) => (
            <div
              key={q.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                q.completed
                  ? 'border-slate-800/60 bg-slate-950/40 opacity-70'
                  : 'border-slate-800 bg-slate-900/70 hover:border-emerald-500/40 hover:shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-emerald-400 font-bold font-mono">+{q.xp} XP</span>
                  <span className="text-slate-400 text-[11px]">{q.impact}</span>
                </div>

                <h4 className={`mt-3 font-bold text-sm sm:text-base ${
                  q.completed ? 'line-through text-slate-400' : 'text-slate-100'
                }`}>
                  {q.title}
                </h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {q.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Auto-syncs with stat score</span>
                {q.completed ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
                    <CheckCircle2 className="h-3.5 w-3.5" /> CLAIMED
                  </span>
                ) : (
                  <button
                    onClick={() => handleComplete(q.id, q.xp, q.title)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>COMPLETE & LOG</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
