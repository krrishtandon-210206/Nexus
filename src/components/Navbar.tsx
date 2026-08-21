import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { sound } from '../utils/sound';
import { 
  Flame, 
  Zap, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  Swords, 
  Compass, 
  Target, 
  FolderGit2, 
  Users, 
  Award, 
  DollarSign, 
  BrainCircuit, 
  ChevronRight,
  HeartPulse
} from 'lucide-react';

interface NavbarProps {
  player: PlayerProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRestoreEnergy: () => void;
  onResetData: () => void;
  onStartJudgeDemo: () => void;
  todayXp: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  player,
  activeTab,
  setActiveTab,
  onRestoreEnergy,
  onResetData,
  onStartJudgeDemo,
  todayXp,
}) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [showEnergyMenu, setShowEnergyMenu] = useState(false);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const navItems = [
    { id: 'command', label: 'Command Center', icon: Compass },
    { id: 'gamemaster', label: 'AI Game Master', icon: BrainCircuit, badge: 'AI' },
    { id: 'quests', label: 'Quest Board', icon: Swords },
    { id: 'bosses', label: 'Boss Battles', icon: Swords, badge: 'HOT' },
    { id: 'skilltree', label: 'Skill Tree', icon: FolderGit2 },
    { id: 'career', label: 'Career Radar', icon: Target },
    { id: 'futureself', label: 'Future Self', icon: Sparkles },
    { id: 'campus', label: 'Campus World', icon: Users },
    { id: 'money', label: 'Money Quests', icon: DollarSign },
    { id: 'squad', label: 'Team Mode', icon: Users },
    { id: 'achievements', label: 'Achievements', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      {/* Top Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand & Player Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('command');
            }}
            className="flex items-center gap-2 text-left group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 shadow-lg shadow-cyan-500/20 text-white font-black text-lg group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-slate-100 text-sm sm:text-base">
                  NEXUS <span className="text-cyan-400">RPG</span>
                </span>
                <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-800/60">
                  STUDENT AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Level Up Real Life
              </p>
            </div>
          </button>

          {/* Player Quick Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800">
            <div className="flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3 py-1 border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-200">{player.name}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-amber-400 font-bold">Lv {player.level}</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                {player.currentClass}
              </span>
            </div>
          </div>
        </div>

        {/* Global Stats: XP, Streak, Energy, Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* XP Tracker */}
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
              <span>XP:</span>
              <span className="font-bold text-cyan-400">{player.xp.toLocaleString()}</span>
              <span className="text-slate-500">/ {player.xpToNextLevel.toLocaleString()}</span>
            </div>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-800 mt-1">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (player.xp / player.xpToNextLevel) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1.5 border border-amber-500/20 text-amber-400">
            <Flame className="h-4 w-4 animate-bounce" />
            <span className="text-xs font-bold">{player.streakDays}d Streak</span>
          </div>

          {/* Energy Pool with Restore Menu */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowEnergyMenu(!showEnergyMenu);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-2.5 py-1.5 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
              title="Energy reserves. Click to view recovery activities."
            >
              <Zap className="h-4 w-4 text-cyan-400 fill-cyan-400" />
              <span className="text-xs font-bold">{player.energy}/{player.maxEnergy}</span>
            </button>

            {showEnergyMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <HeartPulse className="h-4 w-4 text-emerald-400" />
                    <span>Energy & Recovery</span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-semibold">{player.energy}%</span>
                </div>
                <p className="text-[11px] text-slate-400 py-2">
                  Quests consume energy. Healthy recovery avoids burnout and keeps consistency high!
                </p>
                <div className="space-y-1.5 pt-1">
                  <button
                    onClick={() => {
                      onRestoreEnergy();
                      setShowEnergyMenu(false);
                    }}
                    className="w-full flex items-center justify-between rounded-lg bg-slate-800 hover:bg-emerald-950/60 hover:border-emerald-700/60 border border-slate-700 px-2.5 py-1.5 text-xs text-slate-200 transition-colors"
                  >
                    <span>☕ 20-min Power Break</span>
                    <span className="text-emerald-400 font-bold">+28 Energy</span>
                  </button>
                  <button
                    onClick={() => {
                      onRestoreEnergy();
                      setShowEnergyMenu(false);
                    }}
                    className="w-full flex items-center justify-between rounded-lg bg-slate-800 hover:bg-emerald-950/60 hover:border-emerald-700/60 border border-slate-700 px-2.5 py-1.5 text-xs text-slate-200 transition-colors"
                  >
                    <span>🚶 Campus Walk & Music</span>
                    <span className="text-emerald-400 font-bold">+28 Energy</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Judge 3-Min Demo Button (Highlight) */}
          <button
            onClick={() => {
              sound.playClick();
              onStartJudgeDemo();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-3 py-1.5 text-xs font-black text-slate-950 shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all animate-pulse"
          >
            <Sparkles className="h-3.5 w-3.5 fill-slate-950" />
            <span className="whitespace-nowrap">🔥 3-MIN JUDGE DEMO</span>
          </button>

          {/* Audio toggle & Reset */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleSound}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset demo state to default Level 18 student data?')) {
                  sound.playClick();
                  onResetData();
                }
              }}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
              title="Reset Player Progress"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="overflow-x-auto scrollbar-none border-t border-slate-900 bg-slate-950/60 px-4 py-1 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-1 sm:gap-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-black ${
                    item.badge === 'HOT' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
