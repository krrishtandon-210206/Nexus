import React from 'react';
import { Achievement } from '../types';
import { sound } from '../utils/sound';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  Flame,
  Star
} from 'lucide-react';

interface AchievementsHallProps {
  achievements: Achievement[];
}

export const AchievementsHall: React.FC<AchievementsHallProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-900/40 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-950 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              HALL OF VALOR • MILESTONE REWARDS
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-400" />
            ACHIEVEMENTS & TROPHIES
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Proof of real-world consistency, exam conquests, and project deployments immortalized on your student ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-amber-950/80 px-3 py-1.5 text-xs font-mono font-bold text-amber-300 border border-amber-800">
            Unlocked: {unlockedCount} / {achievements.length} Badges
          </span>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((badge) => (
          <div
            key={badge.id}
            className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
              badge.unlocked
                ? 'border-amber-500/30 bg-slate-900/80 shadow-lg shadow-amber-500/5 hover:border-amber-500/60'
                : 'border-slate-800 bg-slate-950/40 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-4xl select-none">{badge.icon}</span>
                <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                  badge.rarity === 'LEGENDARY'
                    ? 'bg-amber-950 text-amber-300 border border-amber-700'
                    : badge.rarity === 'EPIC'
                    ? 'bg-purple-950 text-purple-300 border border-purple-800'
                    : badge.rarity === 'RARE'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {badge.rarity}
                </span>
              </div>

              <h4 className="mt-3 font-extrabold text-white text-base flex items-center gap-1.5">
                {badge.title}
                {badge.unlocked && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
              </h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {badge.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-amber-400">+{badge.xpReward} XP</span>
              <span className="text-slate-500 font-mono text-[11px]">
                {badge.unlocked ? `Unlocked: ${badge.unlockedAt}` : '🔒 Locked'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
