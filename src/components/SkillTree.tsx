import React, { useState } from 'react';
import { SkillNode } from '../types';
import { sound } from '../utils/sound';
import { 
  FolderGit2, 
  Lock, 
  Unlock, 
  Sparkles, 
  Swords, 
  ChevronRight, 
  TrendingUp, 
  Check, 
  Award,
  Layers,
  BrainCircuit
} from 'lucide-react';

interface SkillTreeProps {
  skillNodes: SkillNode[];
  onStartQuestFromSkill: (questTitle: string) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({
  skillNodes,
  onStartQuestFromSkill,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<'ALL' | 'TECHNICAL' | 'ACADEMIC' | 'CAREER'>('TECHNICAL');
  const [activeNode, setActiveNode] = useState<SkillNode>(skillNodes[1] || skillNodes[0]);

  const branches = [
    { id: 'TECHNICAL', label: '💻 Technical Tree' },
    { id: 'ACADEMIC', label: '📚 Academic Tree' },
    { id: 'CAREER', label: '🎯 Career Tree' },
    { id: 'ALL', label: '🌟 All Branches' },
  ];

  const filteredNodes = skillNodes.filter((n) => {
    if (selectedBranch === 'ALL') return true;
    return n.category === selectedBranch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              TALENT CONSTELLATION • RPG MASTERY
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-cyan-400" />
            INTERACTIVE SKILL TREE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Complete real-world missions and boss battles to unlock nodes, expand your technical depth, and level up career readiness.
          </p>
        </div>

        {/* Branch Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {branches.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                sound.playClick();
                setSelectedBranch(b.id as any);
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                selectedBranch === b.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Visual Tree Map + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Skill Map Stage (8 Cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden min-h-[480px]">
          {/* Subtle node connection lines styling */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-10"></div>

          <div className="relative space-y-8">
            {/* Tiers rendering */}
            {[1, 2, 3, 4].map((tierNum) => {
              const tierNodes = filteredNodes.filter((n) => n.tier === tierNum);
              if (tierNodes.length === 0) return null;

              return (
                <div key={tierNum} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                      TIER 0{tierNum}
                    </span>
                    <div className="h-px flex-1 bg-slate-800"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tierNodes.map((node) => {
                      const isSelected = activeNode?.id === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => {
                            sound.playClick();
                            setActiveNode(node);
                          }}
                          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 relative group ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-500/10'
                              : node.unlocked
                              ? 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900'
                              : 'border-slate-800/50 bg-slate-950/40 opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                                node.unlocked
                                  ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                                  : 'bg-slate-800 border border-slate-700 text-slate-500'
                              }`}>
                                {node.unlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-100 text-xs sm:text-sm group-hover:text-cyan-300 transition-colors">
                                  {node.name}
                                </h4>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {node.category}
                                </span>
                              </div>
                            </div>

                            <span className="font-mono text-xs font-bold text-cyan-400">
                              {node.levelPercent}%
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                              style={{ width: `${node.levelPercent}%` }}
                            ></div>
                          </div>

                          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                            <span className="truncate max-w-[180px]">Quest: {node.recommendedQuest}</span>
                            <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Inspector Drawer (4 Cols) */}
        {activeNode && (
          <div className="lg:col-span-4 rounded-3xl border border-cyan-900/40 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md space-y-5 sticky top-24">
            <div className="pb-4 border-b border-slate-800">
              <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-800">
                NODE INSPECTOR • {activeNode.category}
              </span>
              <h3 className="mt-2 text-xl font-black text-white">
                {activeNode.name}
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {activeNode.description}
              </p>
            </div>

            {/* Level & XP Gauge */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">MASTERY LEVEL</span>
                <span className="text-cyan-400 font-mono text-sm">{activeNode.levelPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                  style={{ width: `${activeNode.levelPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
                <span>XP: {activeNode.xp} / {activeNode.maxXp}</span>
                <span>Tier: {activeNode.tier}</span>
              </div>
            </div>

            {/* Recommended Quest Launcher */}
            <div className="rounded-2xl border border-indigo-900/40 bg-indigo-950/20 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <BrainCircuit className="h-4 w-4 text-indigo-400" />
                <span>RECOMMENDED GROWTH QUEST</span>
              </div>
              <p className="text-xs font-semibold text-slate-200">
                "{activeNode.recommendedQuest}"
              </p>
              <button
                onClick={() => {
                  sound.playClick();
                  onStartQuestFromSkill(activeNode.recommendedQuest);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-2.5 text-xs font-extrabold text-white shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Swords className="h-4 w-4" />
                <span>START SKILL QUEST</span>
              </button>
            </div>

            {/* Prerequisites */}
            <div className="text-xs text-slate-400 space-y-1">
              <span className="font-bold text-slate-300">Status:</span>
              <p>
                {activeNode.unlocked
                  ? '✅ Active node. Completing related quests steadily increases mastery %.'
                  : '🔒 Locked node. Complete previous tier prerequisite quests to unlock.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
