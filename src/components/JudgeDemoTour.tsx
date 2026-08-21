import React, { useState } from 'react';
import { sound } from '../utils/sound';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Trophy, 
  Target, 
  Swords, 
  BrainCircuit, 
  Flame, 
  ShieldCheck, 
  Check
} from 'lucide-react';

interface JudgeDemoTourProps {
  onNavigateTab: (tab: string) => void;
  onClose: () => void;
}

export const JudgeDemoTour: React.FC<JudgeDemoTourProps> = ({
  onNavigateTab,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '1. The Core Paradigm: Game IS the AI Interface',
      tab: 'command',
      badge: 'STUDENT RPG CHARACTER',
      description: 'Notice that NEXUS RPG is NOT a generic chat window with badges slapped on. The entire student life is modeled as an RPG character where coursework, skill gaps, and exams directly drive character stats and evolution.',
      highlight: 'Look at Level 18 "Skill Builder", 47% Career Readiness, and the 6-Day Streak.',
    },
    {
      title: '2. AI Game Master: Adaptive Tactical Planning',
      tab: 'gamemaster',
      badge: 'SYNTHESIS ENGINE',
      description: 'The Game Master doesn’t just generate lists—it weighs student fatigue, upcoming deadlines (DBMS tomorrow), and career gaps (DSA 18%) to produce high-ROI quest paths.',
      highlight: 'Click "I only have 2 hours tonight" or custom time to see dynamic quest synthesis.',
    },
    {
      title: '3. Boss Battles: Defeating Real Academic Dragons',
      tab: 'bosses',
      badge: 'COMBAT PREPARATION',
      description: 'High-stakes exams are transformed into Boss encounters. Instead of passive dread, students strike down Boss HP using preparation weapons (past papers, rapid quizzes, concept sprints).',
      highlight: 'Strike the "Dragon of Operating Systems" with a preparation weapon or trigger Rapid-Fire Blitz!',
    },
    {
      title: '4. Career Radar: Gap Analysis & Resume Converter',
      tab: 'career',
      badge: 'MARKET ALIGNMENT',
      description: 'Live radar identifies the exact gap preventing progression (DSA at 18%). The Resume-to-Quest converter extracts missing projects from student CVs into immediate RPG missions.',
      highlight: 'Check the 5 Evolution Classes and click "Launch DSA Quest" to fix the primary bottleneck.',
    },
    {
      title: '5. Future Self: Trajectory Simulator',
      tab: 'future',
      badge: 'PROBABILISTIC FORECAST',
      description: 'Students can compare 3 hypothetical futures: Keep Going (56% readiness in 6 mos), Level Up (92% readiness + internship), or Beast Mode (97% + leadership).',
      highlight: 'Toggle between "Level Up" and "Beast Mode" and click through the 30-Day and 90-Day timeline steps.',
    },
    {
      title: '6. Anti-XP Farming & Real Growth Engine',
      tab: 'command',
      badge: 'INTEGRITY GUARANTEE',
      description: 'NEXUS RPG strictly refuses to reward empty chatter or repetitive low-friction tasks. XP is ONLY earned through demonstrated action, verified problem sets, and strategic balance.',
      highlight: 'Complete a quest to verify the audio synthesizer and XP level-up loop!',
    },
  ];

  const step = steps[currentStep];

  const handleStepChange = (newIdx: number) => {
    sound.playClick();
    setCurrentStep(newIdx);
    onNavigateTab(steps[newIdx].tab);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-lg animate-in slide-in-from-bottom-5">
      <div className="rounded-3xl border border-cyan-500/50 bg-slate-950/95 p-5 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl space-y-3">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs">
              ⚡
            </span>
            <span className="text-xs font-black text-white uppercase tracking-wider">
              3-MINUTE JUDGE DEMO TOUR ({currentStep + 1}/6)
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Step Content */}
        <div>
          <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-800 font-mono">
            {step.badge}
          </span>
          <h4 className="text-sm font-black text-white mt-1.5">{step.title}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.description}</p>
          <div className="mt-2 rounded-xl bg-slate-900 border border-slate-800 p-2 text-[11px] text-cyan-300">
            <strong className="text-slate-400">Judge Action:</strong> {step.highlight}
          </div>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => handleStepChange(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </button>

          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStep ? 'w-5 bg-cyan-400' : 'w-1.5 bg-slate-800'
                }`}
              ></div>
            ))}
          </div>

          {currentStep + 1 < steps.length ? (
            <button
              onClick={() => handleStepChange(currentStep + 1)}
              className="flex items-center gap-1 rounded-xl bg-cyan-500 text-slate-950 px-4 py-1.5 text-xs font-black shadow-md hover:bg-cyan-400 active:scale-95 transition-all"
            >
              <span>Next Step</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playQuestComplete();
                onClose();
              }}
              className="flex items-center gap-1 rounded-xl bg-emerald-500 text-slate-950 px-4 py-1.5 text-xs font-black shadow-md hover:bg-emerald-400 transition-all"
            >
              <span>Complete Tour</span>
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
