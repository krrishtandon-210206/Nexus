import React, { useState } from 'react';
import { BossBattle, BossWeapon } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Swords, 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  Award, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Plus, 
  BrainCircuit, 
  Play, 
  Trophy, 
  RotateCcw,
  Target
} from 'lucide-react';

interface BossBattlesProps {
  bosses: BossBattle[];
  onDefeatBoss: (bossId: string, xpReward: number, skills: { skill: string; boost: number }[]) => void;
  onStartRapidFire: (topic: string) => void;
  onGenerateCustomBoss: (challengeName: string, challengeType: string) => void;
}

export const BossBattles: React.FC<BossBattlesProps> = ({
  bosses,
  onDefeatBoss,
  onStartRapidFire,
  onGenerateCustomBoss,
}) => {
  const [selectedBossId, setSelectedBossId] = useState<string>(bosses[0]?.id || 'boss-os');
  const [activeBossList, setActiveBossList] = useState<BossBattle[]>(bosses);
  const [customInput, setCustomInput] = useState('');
  const [customType, setCustomType] = useState('EXAM');
  const [isGenerating, setIsGenerating] = useState(false);
  const [damagePopup, setDamagePopup] = useState<{ amount: number; text: string } | null>(null);

  const currentBoss = activeBossList.find((b) => b.id === selectedBossId) || activeBossList[0];

  const handleWeaponAttack = (weapon: BossWeapon, weaponIdx: number) => {
    if (!currentBoss || currentBoss.defeated || weapon.used) return;

    sound.playBossHit();

    // Damage calculation
    const damageDealt = weapon.damage;
    const newHp = Math.max(0, currentBoss.currentHp - damageDealt);
    const isDefeated = newHp === 0;

    // Show visual damage splash
    setDamagePopup({ amount: damageDealt, text: weapon.name });
    setTimeout(() => setDamagePopup(null), 1800);

    const updatedBosses = activeBossList.map((b) => {
      if (b.id === currentBoss.id) {
        const updatedWeapons = [...b.prepWeapons];
        updatedWeapons[weaponIdx] = { ...updatedWeapons[weaponIdx], used: true };
        return {
          ...b,
          currentHp: newHp,
          prepWeapons: updatedWeapons,
          defeated: isDefeated,
        };
      }
      return b;
    });

    setActiveBossList(updatedBosses);

    if (isDefeated) {
      sound.playBossDefeated();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#6366f1', '#f59e0b', '#10b981'],
      });
      onDefeatBoss(currentBoss.id, currentBoss.rewards.xp, currentBoss.rewards.skills);
    }
  };

  const handleGenerateBoss = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    sound.playClick();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini/boss-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeName: customInput.trim(),
          challengeType: customType,
          daysRemaining: 4,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newBoss: BossBattle = {
          id: `custom-boss-${Date.now()}`,
          bossName: data.bossName || `Titan of ${customInput}`,
          title: data.title || 'Custom Challenge Boss',
          challengeType: customType as any,
          difficultyPercentage: data.difficultyPercentage || 80,
          currentHp: data.totalHp || 1000,
          maxHp: data.totalHp || 1000,
          lore: data.lore || 'An intimidating challenge synthesized from your upcoming milestone.',
          weaknesses: data.weaknesses || ['Core Fundamentals', 'Speed Problem Solving', 'Mock Practice'],
          prepWeapons: data.prepWeapons || [
            { name: 'Targeted Concept Sprint', damage: 250, time: '30m', xp: 120, skill: 'Focus +8', used: false },
            { name: 'Previous Paper Breakdown', damage: 300, time: '40m', xp: 150, skill: 'Readiness +10', used: false },
            { name: 'AI Rapid-Fire Quiz', damage: 200, time: '15m', xp: 90, skill: 'Recall +6', used: false },
            { name: 'Final Mock Simulation', damage: 250, time: '45m', xp: 140, skill: 'Confidence +12', used: false },
          ],
          rewards: data.rewards || {
            xp: 500,
            skills: [{ skill: customInput, boost: 12 }],
            badge: 'Conqueror',
          },
          defeated: false,
        };

        setActiveBossList([newBoss, ...activeBossList]);
        setSelectedBossId(newBoss.id);
        setCustomInput('');
      }
    } catch (err) {
      console.error('Boss generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const hpPercentage = currentBoss ? Math.round((currentBoss.currentHp / currentBoss.maxHp) * 100) : 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-rose-900/40 bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-950 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
              ACADEMIC & CAREER COMBAT ARENA
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Swords className="h-6 w-6 text-rose-400" />
            BOSS BATTLES
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Turn dreaded exams, looming deadlines, and high-stakes interviews into conquerable RPG Bosses with tactical preparation weapons.
          </p>
        </div>

        {/* Boss Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {activeBossList.map((boss) => (
            <button
              key={boss.id}
              onClick={() => {
                sound.playClick();
                setSelectedBossId(boss.id);
              }}
              className={`rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedBossId === boss.id
                  ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{boss.defeated ? '🏆' : '🐉'}</span>
              <span>{boss.bossName.split(' ')[0]}</span>
              {boss.defeated && <span className="text-[10px] text-emerald-950 font-black">CLEARED</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main Boss Battle Stage */}
      {currentBoss && (
        <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Subtle combat grid texture */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>

          {/* Floating Damage Popup Notification */}
          {damagePopup && (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-bounce">
              <div className="rounded-2xl border border-rose-500 bg-rose-950/90 px-6 py-3 shadow-2xl shadow-rose-500/40 text-center">
                <span className="block text-2xl sm:text-3xl font-black text-rose-300 font-mono">
                  💥 -{damagePopup.amount} HP!
                </span>
                <span className="text-xs font-bold text-amber-300">
                  {damagePopup.text} Connected!
                </span>
              </div>
            </div>
          )}

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Boss Identity, Visual Avatar & HP */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              {/* Boss Visual Ring */}
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-rose-500/40 bg-gradient-to-br from-rose-950/80 via-slate-900 to-slate-950 shadow-2xl shadow-rose-500/20">
                <div className="text-6xl sm:text-7xl animate-pulse select-none">
                  {currentBoss.defeated ? '🏆' : currentBoss.challengeType === 'EXAM' ? '🐉' : currentBoss.challengeType === 'CAREER' ? '🤖' : '👹'}
                </div>
                {currentBoss.defeated && (
                  <div className="absolute inset-0 rounded-full bg-emerald-950/80 flex items-center justify-center border-4 border-emerald-500">
                    <span className="text-sm font-black text-emerald-300 tracking-wider">BOSS DEFEATED</span>
                  </div>
                )}
              </div>

              {/* Boss Title & Difficulty */}
              <div>
                <span className="rounded-full bg-rose-950/80 px-3 py-1 text-[11px] font-extrabold uppercase text-rose-300 border border-rose-800/60 font-mono">
                  {currentBoss.title}
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
                  {currentBoss.bossName}
                </h2>
                <p className="mt-1 text-xs text-slate-400 max-w-sm leading-relaxed">
                  {currentBoss.lore}
                </p>
              </div>

              {/* HP Bar */}
              <div className="w-full max-w-md space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                    BOSS HEALTH
                  </span>
                  <span className="font-mono text-rose-400">
                    {currentBoss.currentHp} / {currentBoss.maxHp} HP ({hpPercentage}%)
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      hpPercentage > 50
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : hpPercentage > 20
                        ? 'bg-gradient-to-r from-rose-500 to-rose-700'
                        : 'bg-rose-600 animate-pulse'
                    }`}
                    style={{ width: `${hpPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Difficulty: {currentBoss.difficultyPercentage}%</span>
                  <span>Defeat Reward: +{currentBoss.rewards.xp} XP</span>
                </div>
              </div>

              {/* Weaknesses List */}
              <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-left">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  KNOWN WEAKNESSES:
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {currentBoss.weaknesses.map((w) => (
                    <span
                      key={w}
                      className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[11px] font-semibold text-amber-300"
                    >
                      🎯 {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Tactical Preparation Weapons (Missions to damage boss) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    YOUR PREPARATION WEAPONS
                  </h3>
                  <p className="text-xs text-slate-400">
                    Each completed study, past paper, or rapid quiz inflicts direct damage on the Boss HP.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onStartRapidFire(currentBoss.weaknesses[0] || 'Data Structures');
                  }}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-extrabold text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5 fill-slate-950" />
                  <span>RAPID-FIRE BLITZ</span>
                </button>
              </div>

              {/* Weapons Grid */}
              <div className="space-y-3">
                {currentBoss.prepWeapons.map((weapon, idx) => (
                  <div
                    key={weapon.name + idx}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                      weapon.used
                        ? 'border-slate-800 bg-slate-950/40 opacity-60'
                        : 'border-slate-800 bg-slate-900/80 hover:border-rose-500/40 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs">
                        ⚔️
                      </div>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-bold ${
                          weapon.used ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}>
                          {weapon.name}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                          <span className="text-rose-400 font-mono font-bold">💥 {weapon.damage} DMG</span>
                          <span className="text-emerald-400 font-mono font-bold">+{weapon.xp} XP</span>
                          <span className="text-cyan-400">{weapon.skill}</span>
                          <span className="text-slate-500 flex items-center gap-0.5">
                            <Clock className="h-3 w-3" /> {weapon.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      {weapon.used ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
                          <CheckCircle2 className="h-3.5 w-3.5" /> STRUCK
                        </span>
                      ) : (
                        <button
                          onClick={() => handleWeaponAttack(weapon, idx)}
                          disabled={currentBoss.defeated}
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2 text-xs font-black text-slate-950 shadow-md shadow-rose-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
                        >
                          <Swords className="h-3.5 w-3.5 fill-slate-950" />
                          <span>STRIKE (-{weapon.damage} HP)</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Defeat Rewards Summary Banner */}
              <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-300">VICTORY SPOILS:</span>
                    <p className="text-xs text-slate-300">
                      +{currentBoss.rewards.xp} XP • Badge: <strong>"{currentBoss.rewards.badge}"</strong> • Massive Skill Surge
                    </p>
                  </div>
                </div>
                {currentBoss.defeated && (
                  <span className="rounded-xl bg-emerald-500 text-slate-950 px-3 py-1 text-xs font-black">
                    CLAIMED!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Custom Boss Generator (Prompt #9) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm sm:text-base font-black text-white">
            AI DYNAMIC BOSS GENERATOR
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Have an upcoming midterm, term project, or placement drive? Let the AI transform it into a full Boss encounter with customized preparation weapons.
        </p>

        <form onSubmit={handleGenerateBoss} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="e.g. Distributed Systems Final Exam or Hackathon Demo..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
          />
          <select
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-slate-300 focus:border-rose-500 focus:outline-none"
          >
            <option value="EXAM">🐉 Exam Boss</option>
            <option value="DEADLINE">👹 Deadline Boss</option>
            <option value="CAREER">🤖 Career Boss</option>
            <option value="HACKATHON">🏆 Hackathon Boss</option>
          </select>
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-rose-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shrink-0"
          >
            {isGenerating ? <Sparkles className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span>GENERATE BOSS</span>
          </button>
        </form>
      </div>
    </div>
  );
};
