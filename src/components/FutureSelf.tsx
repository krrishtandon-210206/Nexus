import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { sound } from '../utils/sound';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Flame, 
  Rocket, 
  Smile, 
  AlertCircle, 
  BrainCircuit, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface FutureSelfProps {
  player: PlayerProfile;
}

export const FutureSelf: React.FC<FutureSelfProps> = ({ player }) => {
  const [selectedPath, setSelectedPath] = useState<'keepGoing' | 'levelUp' | 'beastMode'>('levelUp');
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number>(2); // 30 Days default

  const pathsData: Record<string, any> = {
    keepGoing: {
      title: 'Keep Going (Baseline)',
      emoji: '😐',
      badge: 'CURRENT TRAJECTORY',
      color: 'from-slate-500/20 to-slate-700/20',
      border: 'border-slate-700',
      summary: 'Continuing current ad-hoc study routines without structured gap remediation or weekly boss battles.',
      timeline: [
        { period: 'Today', readiness: 47, level: 18, milestone: 'Inconsistent DSA prep, vulnerable to technical screening filters.' },
        { period: '7 Days', readiness: 48, level: 18, milestone: 'Submitted DBMS assignment; DSA weakness remains at 18%.' },
        { period: '30 Days', readiness: 50, level: 19, milestone: 'Cleared OS midterm with average grade; zero portfolio additions.' },
        { period: '90 Days', readiness: 53, level: 20, milestone: 'Struggles with live coding rounds due to lack of mock interview discipline.' },
        { period: '6 Months', readiness: 56, level: 22, milestone: 'Remains in Explorer class. Applying to dozens of jobs with low response rates.' },
      ],
    },
    levelUp: {
      title: 'Level Up (AI Recommended)',
      emoji: '🔥',
      badge: 'RECOMMENDED STRATEGY',
      color: 'from-cyan-500/20 to-indigo-600/20',
      border: 'border-cyan-500/40',
      summary: 'Executing AI daily tactical quests, conquering boss battles, closing the 18% DSA gap, and maintaining 6-day consistency with planned rest.',
      timeline: [
        { period: 'Today', readiness: 47, level: 18, milestone: 'Initiates Array Boss battle & solves 2-pointer LeetCode set.' },
        { period: '7 Days', readiness: 55, level: 19, milestone: 'DSA surges to 34%. Completed Dragon of OS prep with high confidence.' },
        { period: '30 Days', readiness: 68, level: 22, milestone: 'Project Builder unlocked! Built fullstack cloud expense tracker portfolio piece.' },
        { period: '90 Days', readiness: 81, level: 28, milestone: 'Interview Ready! Cleared 15 AI mock sessions with 88% passing rate.' },
        { period: '6 Months', readiness: 92, level: 35, milestone: 'Industry Ready! Secured high-paying software engineering internship offer.' },
      ],
    },
    beastMode: {
      title: 'Beast Mode (Aggressive Focus)',
      emoji: '🚀',
      badge: 'MAXIMUM ACCELERATION',
      color: 'from-purple-500/20 to-rose-500/20',
      border: 'border-rose-500/40',
      summary: 'High-octane commitment: Campus hackathon wins, daily algorithm mastery, open-source PRs, and system design mock defenses.',
      timeline: [
        { period: 'Today', readiness: 47, level: 18, milestone: 'Completes 3 daily quests + Array Boss execution in 90-minute deep block.' },
        { period: '7 Days', readiness: 61, level: 20, milestone: 'Won campus hackathon with Team Phoenix. DSA surges to 45%.' },
        { period: '30 Days', readiness: 76, level: 26, milestone: 'Deployed 2 cloud microservices. System design level 12% -> 48%.' },
        { period: '90 Days', readiness: 89, level: 34, milestone: 'Top 3% candidate in campus placement drive with multiple referrals.' },
        { period: '6 Months', readiness: 97, level: 42, milestone: 'Fullstack Architect tier. Leading team projects and mentoring juniors.' },
      ],
    },
  };

  const activePath = pathsData[selectedPath];
  const activeTimelineItem = activePath.timeline[selectedPeriodIndex];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-indigo-900/40 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-950 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              TRAJECTORY SIMULATION • PROBABILISTIC FORECAST
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            FUTURE SELF SIMULATOR
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Compare 3 hypothetical trajectories based on your daily quest choices. Your future isn't predicted — it is constructed.
          </p>
        </div>

        {/* Disclaimer Tag */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 max-w-md">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>AI Simulation Disclaimer</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            Hypothetical scenario projections based on skill acquisition models. Not guaranteed predictions.
          </p>
        </div>
      </div>

      {/* 3 Path Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: 'keepGoing', data: pathsData.keepGoing },
          { key: 'levelUp', data: pathsData.levelUp },
          { key: 'beastMode', data: pathsData.beastMode },
        ].map(({ key, data }) => {
          const isSelected = selectedPath === key;
          return (
            <div
              key={key}
              onClick={() => {
                sound.playClick();
                setSelectedPath(key as any);
              }}
              className={`cursor-pointer rounded-2xl border p-5 transition-all relative group ${
                isSelected
                  ? `border-cyan-500 bg-gradient-to-b ${data.color} shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/50`
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{data.emoji}</span>
                <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                  isSelected ? 'bg-slate-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {data.badge}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-black text-white">{data.title}</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-3">
                {data.summary}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">6-Mo Readiness:</span>
                <span className="font-bold text-cyan-400 text-sm">
                  {data.timeline[4].readiness}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Timeline Navigation (Today -> 7d -> 30d -> 90d -> 6m) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              TIMELINE STEP INSPECTION
            </h3>
            <span className="text-lg sm:text-xl font-black text-white flex items-center gap-2 mt-0.5">
              <span>{activePath.emoji}</span> {activePath.title} • {activeTimelineItem.period}
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {activePath.timeline.map((item: any, idx: number) => (
              <button
                key={item.period}
                onClick={() => {
                  sound.playClick();
                  setSelectedPeriodIndex(idx);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                  selectedPeriodIndex === idx
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.period}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Milestone Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Readiness Meter (4 cols) */}
          <div className="md:col-span-4 rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase">PROJECTED READINESS</span>
            <div className="text-5xl font-black font-mono text-cyan-400">
              {activeTimelineItem.readiness}%
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${activeTimelineItem.readiness}%` }}
              ></div>
            </div>
            <span className="inline-block text-xs font-mono text-amber-400 font-bold">
              Projected Level: {activeTimelineItem.level}
            </span>
          </div>

          {/* Scenario Narrative (8 cols) */}
          <div className="md:col-span-8 rounded-2xl border border-indigo-900/30 bg-indigo-950/20 p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <BrainCircuit className="h-4 w-4 text-indigo-400" />
              <span>PROJECTED SCENARIO & MILESTONES</span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              "{activeTimelineItem.milestone}"
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-indigo-900/30">
              <span>Path: <strong className="text-white">{activePath.title}</strong></span>
              <span className="text-cyan-400">Timeframe: {activeTimelineItem.period}</span>
            </div>
          </div>
        </div>

        {/* Motivational Closing */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-center">
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            "Your future isn't predicted. <span className="text-cyan-400 font-bold">It is built through your next actions."</span>
          </p>
        </div>
      </div>
    </div>
  );
};
