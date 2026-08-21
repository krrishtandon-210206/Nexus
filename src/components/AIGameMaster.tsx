import React, { useState } from 'react';
import { PlayerProfile, Quest } from '../types';
import { sound } from '../utils/sound';
import { 
  BrainCircuit, 
  Sparkles, 
  Send, 
  Clock, 
  Check, 
  ArrowRight, 
  Zap, 
  Flame, 
  Target, 
  ShieldAlert, 
  HelpCircle,
  Play
} from 'lucide-react';

interface AIGameMasterProps {
  player: PlayerProfile;
  onAcceptPlan: (newQuests: Quest[]) => void;
}

export const AIGameMaster: React.FC<AIGameMasterProps> = ({
  player,
  onAcceptPlan,
}) => {
  const [userInput, setUserInput] = useState('');
  const [availableTime, setAvailableTime] = useState<number>(120);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>({
    planTitle: 'Session Strategy: High-Impact Gap Closure',
    reasoning: 'Prioritizing your 18% DSA gap and tomorrow night’s DBMS submission. Balancing 90 minutes of high-cognitive load with 15 minutes of recovery to protect stamina.',
    estimatedXp: 370,
    careerImpact: 'HIGH (+4.2%)',
    energyCost: 35,
    quests: [
      {
        id: 'gm-q1',
        title: 'DBMS Assignment: 3NF & B+ Tree Problem Set',
        category: 'ACADEMIC',
        timeMinutes: 45,
        xp: 150,
        difficulty: '★★★☆☆',
        skillImpact: 'Database Systems +10, SQL +6',
        careerImpact: '+3.0%',
        aiReasoning: 'Urgent academic deadline due tomorrow. Secures 150 XP and keeps Academic Health at 78%.',
      },
      {
        id: 'gm-q2',
        title: 'Array & Two-Pointer Mini Challenge Sprint',
        category: 'TECH SKILLS',
        timeMinutes: 30,
        xp: 120,
        difficulty: '★★★★☆',
        skillImpact: 'DSA +14, Problem Solving +8',
        careerImpact: '+5.0%',
        aiReasoning: 'DSA is currently your largest career gap (18%). Addressing this provides maximum ROI per minute.',
      },
      {
        id: 'gm-q3',
        title: 'DSA Rapid-Fire Battle & Quick Review',
        category: 'PERSONAL DEVELOPMENT',
        timeMinutes: 30,
        xp: 100,
        difficulty: '★★☆☆☆',
        skillImpact: 'Recall Speed +6, Consistency +5',
        careerImpact: '+1.5%',
        aiReasoning: 'Reinforces memory retention without heavy fatigue, concluding with a 15-min recovery buffer.',
      },
    ],
  });
  const [accepted, setAccepted] = useState(false);

  const quickPrompts = [
    { label: '⏱️ "I only have 2 hours tonight"', text: 'I have only two hours tonight. What should I prioritize?', time: 120 },
    { label: '🐉 "Exam in 4 days (Operating Systems)"', text: 'I have an Operating Systems exam in 4 days and need a prep campaign.', time: 90 },
    { label: '⚡ "Low Energy / Burnout prevention"', text: 'My energy is low today. Give me low-friction high-retention quests.', time: 45 },
    { label: '💼 "Focus 100% on Interview Prep"', text: 'I want to maximize my Software Engineer interview readiness.', time: 90 },
  ];

  const handleGeneratePlan = async (queryText?: string, timeMins?: number) => {
    const textToSend = (queryText || userInput).trim() || 'I have limited study time tonight. Recommend an optimal session plan.';
    const timeVal = timeMins || availableTime;
    
    setIsLoading(true);
    setAccepted(false);
    sound.playClick();

    try {
      const res = await fetch('/api/gemini/game-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          availableTimeMinutes: timeVal,
          targetCareer: player.targetCareer,
          playerStats: {
            level: player.level,
            careerReadiness: player.careerReadiness,
            academicHealth: player.academicHealth,
            energy: player.energy,
            weakSkills: player.weakSkills,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && (data.planTitle || (Array.isArray(data.quests) && data.quests.length > 0))) {
          setCurrentPlan(data);
        }
      }
    } catch (err) {
      console.error('Game Master error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (!currentPlan?.quests) return;
    sound.playQuestComplete();
    setAccepted(true);

    const formattedQuests: Quest[] = currentPlan.quests.map((q: any, i: number) => ({
      id: `gm-injected-${Date.now()}-${i}`,
      title: q.title || `Tactical Quest 0${i + 1}`,
      description: q.reasoning || 'AI Game Master assigned mission.',
      category: (q.category as any) || 'TECH SKILLS',
      xp: q.xp || 120,
      energyCost: 15,
      timeMinutes: q.timeMinutes || q.time || 30,
      difficulty: q.difficulty || '★★★☆☆',
      difficultyLevel: 3,
      skillImpact: q.skillImpact || 'Career Growth +5',
      careerImpact: q.careerImpact || '+3.0%',
      aiReasoning: q.reasoning || q.aiReasoning || 'Selected to optimize time and skill gaps.',
      completed: false,
    }));

    onAcceptPlan(formattedQuests);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-2xl border border-indigo-900/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 p-6 backdrop-blur-md">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
          <BrainCircuit className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              AI GAME MASTER & CAREER STRATEGIST
            </span>
            <span className="rounded bg-indigo-950 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-800">
              ADAPTIVE ENGINE
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">
            Dynamic Quest Orchestrator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            The AI analyzes your deadlines, skill gaps, energy level, and available hours to synthesize the highest-ROI quest path.
          </p>
        </div>
      </div>

      {/* Input / Strategy Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            AVAILABLE TIME TONIGHT: <span className="text-cyan-400 font-mono font-bold text-sm">{availableTime} minutes</span>
          </label>
          <div className="flex items-center gap-2">
            {[45, 60, 90, 120, 180].map((t) => (
              <button
                key={t}
                onClick={() => {
                  sound.playClick();
                  setAvailableTime(t);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                  availableTime === t
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}m
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Tell your AI Game Master your schedule, exams, or mood (e.g. 'I have only 2 hours tonight')..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGeneratePlan();
            }}
          />
          <button
            onClick={() => handleGeneratePlan()}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shrink-0"
          >
            {isLoading ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">SYNTHESIZE PLAN</span>
          </button>
        </div>

        {/* Quick Scenario Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] font-bold text-slate-500">Quick Scenarios:</span>
          {quickPrompts.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setUserInput(p.text);
                setAvailableTime(p.time);
                handleGeneratePlan(p.text, p.time);
              }}
              className="rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Generated Plan Output */}
      {currentPlan && (
        <div className="rounded-2xl border border-cyan-900/40 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-2xl backdrop-blur-md space-y-6 animate-in fade-in">
          {/* Plan Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  AI RECOMMENDATION
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                {currentPlan.planTitle}
              </h2>
            </div>

            {/* Impact Badges */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">ESTIMATED XP</span>
                <span className="text-sm font-black text-emerald-400 font-mono">+{currentPlan.estimatedXp}</span>
              </div>
              <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">CAREER IMPACT</span>
                <span className="text-sm font-black text-cyan-400 font-mono">{currentPlan.careerImpact}</span>
              </div>
            </div>
          </div>

          {/* AI Reasoning Narrative Box */}
          <div className="rounded-xl bg-slate-950/80 border border-indigo-900/30 p-4">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5 text-indigo-400" />
              Strategic Reasoning
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              {currentPlan.reasoning}
            </p>
          </div>

          {/* Quests Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Recommended Sequential Quests:
            </h3>
            <div className="space-y-3">
              {currentPlan.quests?.map((quest: any, idx: number) => (
                <div
                  key={quest.id || idx}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 font-mono font-bold text-cyan-400 text-xs">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{quest.title}</span>
                        <span className="text-[10px] rounded bg-slate-800 px-1.5 py-0.5 text-slate-400 font-mono">
                          {quest.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{quest.reasoning || quest.aiReasoning}</p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="text-emerald-400 font-semibold">{quest.skillImpact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-right">
                      <span className="block text-xs font-bold text-amber-400 font-mono">+{quest.xp} XP</span>
                      <span className="text-[11px] text-slate-500">{quest.timeMinutes || quest.time || 30} mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accept Plan Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              Accepting adds these missions to your active Quest Board and syncs with your daily streak.
            </p>
            <button
              onClick={handleAccept}
              disabled={accepted}
              className={`flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-black transition-all ${
                accepted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-95'
              }`}
            >
              {accepted ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>QUEST PLAN ACCEPTED & LOGGED</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>ACCEPT QUEST PLAN</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
