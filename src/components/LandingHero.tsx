import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/sound';
import { 
  Sparkles, 
  Swords, 
  Target, 
  ArrowRight, 
  ShieldAlert, 
  BrainCircuit, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Zap,
  Flame,
  Award
} from 'lucide-react';

interface LandingHeroProps {
  onEnterApp: () => void;
  onEnterDemo: () => void;
  onStartJudgeDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onEnterApp,
  onEnterDemo,
  onStartJudgeDemo,
}) => {
  const steps = [
    { title: 'YOUR LIFE', desc: 'Deadlines, Exams, Classes & Goals', icon: '🎓', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-cyan-500/30' },
    { title: 'AI ANALYSIS', desc: 'Game Master identifies skill gaps & time', icon: '🧠', color: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/30' },
    { title: 'QUESTS', desc: 'High-impact tactical missions & bosses', icon: '⚔️', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
    { title: 'XP & STREAK', desc: 'Earned only through real progress', icon: '⚡', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
    { title: 'SKILLS', desc: 'Interactive skill trees unlock & grow', icon: '🌳', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30' },
    { title: 'CAREER', desc: 'Interview ready & verified readiness', icon: '🚀', color: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-500/30' },
  ];

  const highlights = [
    {
      icon: Swords,
      title: 'Real Challenges as Boss Battles',
      description: 'Your DBMS assignment becomes a preparation mission. Your Operating Systems final becomes a 1,000 HP Dragon with weaknesses to exploit.',
    },
    {
      icon: BrainCircuit,
      title: 'AI Game Master & Coach',
      description: 'Input "I only have 2 hours tonight" — AI crafts the optimal high-impact quest sequence with full transparent reasoning.',
    },
    {
      icon: ShieldAlert,
      title: 'Anti-XP Farming AI',
      description: 'Detects if you repeat easy low-effort tasks for points. Intercepts with a warning: Real Growth > Grinding.',
    },
    {
      icon: TrendingUp,
      title: 'Future Self Simulator',
      description: 'Simulate 3 hypothetical trajectories (Keep Going 😐, Level Up 🔥, Beast Mode 🚀) across 7d, 30d, 90d, and 6 months.',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background glow meshes */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-cyan-500/15 via-indigo-500/10 to-transparent blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-40 right-10 h-[400px] w-[500px] rounded-full bg-purple-600/10 blur-3xl"></div>

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Track Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold tracking-wide uppercase text-cyan-300">
            Student AI Track Winner Candidate
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 font-black tracking-tight text-white text-4xl sm:text-6xl md:text-7xl font-sans"
        >
          NEXUS <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">RPG</span>
        </motion.h1>

        {/* Cinematic Taglines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 space-y-1 text-lg sm:text-2xl font-bold text-slate-200"
        >
          <p className="text-cyan-300">"Your degree is the map.</p>
          <p className="text-indigo-300">Your career is the destination.</p>
          <p className="text-amber-400">Let's play the journey."</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed"
        >
          An AI-powered RPG that turns your real student goals, assignments, exams, and career gaps into personalized quests, tactical challenges, and verifiable career progression.
        </motion.p>

        {/* Primary Call to Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={() => {
              sound.playClick();
              onEnterApp();
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3.5 text-sm sm:text-base font-extrabold text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all"
          >
            <Swords className="h-5 w-5" />
            <span>START YOUR JOURNEY</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onEnterDemo();
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-sm sm:text-base font-bold text-slate-200 hover:bg-slate-800 hover:border-slate-600 active:scale-95 transition-all"
          >
            <span>ENTER DEMO MODE</span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-amber-400 font-mono">Alex Lv 18</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onStartJudgeDemo();
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-3.5 text-sm sm:text-base font-black text-slate-950 shadow-xl shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="h-5 w-5 fill-slate-950" />
            <span>🔥 3-MINUTE JUDGE DEMO</span>
          </button>
        </motion.div>

        {/* Central Game Flow Mechanism: YOUR LIFE -> AI ANALYSIS -> QUESTS -> XP -> SKILLS -> CAREER */}
        <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              The Real-World Game Loop
            </h3>
            <span className="text-[11px] font-semibold text-cyan-400">
              ASSESS → PLAN → QUEST → COMPLETE → EARN XP → UNLOCK SKILLS → LEVEL UP
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {steps.map((st, i) => (
              <div key={st.title} className="relative group">
                <div className={`flex flex-col items-center justify-between h-full rounded-xl border ${st.border} bg-gradient-to-b ${st.color} p-4 transition-all duration-300 hover:scale-105`}>
                  <div className="text-2xl sm:text-3xl mb-2">{st.icon}</div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-100">{st.title}</div>
                  <p className="text-[11px] text-slate-400 mt-1 text-center line-clamp-2">{st.desc}</p>
                  <div className="mt-2 text-[10px] font-bold text-slate-500">Step 0{i + 1}</div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-600 z-10 font-black text-xs">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Unique Selling Points */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.title}
                className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm sm:text-base">{h.title}</h4>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">{h.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Footer Banner */}
        <div className="mt-12 rounded-xl border border-indigo-900/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 p-6">
          <p className="text-base sm:text-lg font-bold text-slate-200">
            "AI shouldn't do your life for you. <span className="text-cyan-400">It should help you level up."</span>
          </p>
        </div>
      </div>
    </div>
  );
};
