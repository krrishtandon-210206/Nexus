import React from 'react';
import { PlayerProfile, PlayerStat, Quest } from '../types';
import { sound } from '../utils/sound';
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Target, 
  Swords, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Play, 
  Award,
  AlertCircle,
  BrainCircuit,
  HeartPulse,
  Youtube,
  Radio,
  Users
} from 'lucide-react';

interface CommandCenterProps {
  player: PlayerProfile;
  stats: PlayerStat[];
  quests: Quest[];
  todayXp: number;
  onOpenQuest: (quest: Quest) => void;
  onCompleteQuest: (questId: string) => void;
  onNavigateTab: (tab: string) => void;
  onRestoreEnergy: () => void;
  onOpenGameMaster: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  player,
  stats,
  quests,
  todayXp,
  onOpenQuest,
  onCompleteQuest,
  onNavigateTab,
  onRestoreEnergy,
  onOpenGameMaster,
}) => {
  const activeTodayQuests = quests.filter((q) => !q.completed).slice(0, 3);
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 p-6 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              COMMAND CENTER • SESSION ACTIVE
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white">
            GOOD MORNING, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">{player.name.toUpperCase()}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            "Your next level starts today. Real-world effort builds the future you."
          </p>
        </div>

        {/* Quick AI Tactical Launch Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('lectures');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-red-800/60 bg-red-950/30 px-3.5 py-2 text-xs font-bold text-red-300 hover:bg-red-950/60 transition-colors"
          >
            <Youtube className="h-4 w-4 text-red-400" />
            <span>Video Lectures</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('studyrooms');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-800/60 bg-cyan-950/30 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-950/60 transition-colors"
          >
            <Users className="h-4 w-4 text-cyan-400" />
            <span>Study Rooms</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenGameMaster();
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <BrainCircuit className="h-4 w-4" />
            <span>AI Game Master Plan</span>
          </button>
        </div>
      </div>

      {/* 3 Major Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Level & Evolution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>CURRENT LEVEL</span>
            <span className="text-amber-400 font-bold font-mono">Rank {player.currentClass}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-mono">{player.level}</span>
            <span className="text-xs text-slate-400">
              ({player.xp} / {player.xpToNextLevel} XP)
            </span>
          </div>
          {/* Progress to next level */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (player.xp / player.xpToNextLevel) * 100)}%` }}
            ></div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Class: <strong className="text-slate-200">{player.currentClass}</strong></span>
            <span className="text-cyan-400 flex items-center gap-0.5">
              Next: {player.nextEvolution} <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Career Readiness */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>CAREER READINESS</span>
            <span className="text-cyan-400 font-bold">{player.targetCareer}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-cyan-400 font-mono">{player.careerReadiness}%</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +4.5% this week
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${player.careerReadiness}%` }}
            ></div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Primary Gap: <strong className="text-rose-400">DSA (18%)</strong></span>
            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('career');
              }}
              className="text-cyan-400 hover:underline flex items-center gap-0.5 font-semibold"
            >
              Analyze Radar <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Today's XP & Consistency */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>TODAY'S XP</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 fill-amber-400" /> {player.streakDays}-Day Streak
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-400 font-mono">+{todayXp}</span>
            <span className="text-xs text-slate-400">XP earned today</span>
          </div>
          {/* Week Streak dots */}
          <div className="mt-3 flex items-center justify-between gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
              const active = player.streakDaysList[idx];
              return (
                <div key={day + idx} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`h-2.5 w-full rounded-full transition-colors ${
                      active ? 'bg-amber-400 shadow-sm shadow-amber-400/30' : 'bg-slate-800'
                    }`}
                  ></div>
                  <span className="text-[10px] text-slate-500 font-mono">{day}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 text-right">
            <span>Recovery Day allowed • Rest is strategic</span>
          </div>
        </div>
      </div>

      {/* Energy & Urgent Deadlines Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Energy Card */}
        <div className="rounded-2xl border border-cyan-900/30 bg-cyan-950/20 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Zap className="h-5 w-5 fill-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-200">ENERGY STATUS</span>
                <span className="text-xs font-mono font-bold text-cyan-400">{player.energy}/100</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {player.energy > 40
                  ? 'Healthy stamina for tactical quest execution.'
                  : 'Stamina low! Consider a 20-min break.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onRestoreEnergy();
            }}
            className="shrink-0 flex items-center gap-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 px-3 py-1.5 text-xs font-bold text-cyan-300 transition-colors"
          >
            <HeartPulse className="h-3.5 w-3.5" />
            <span>Power Rest (+28)</span>
          </button>
        </div>

        {/* Upcoming Challenges */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">UPCOMING BOSSES & DEADLINES</span>
                <span className="rounded bg-rose-950/80 px-1.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-800/60">
                  URGENT
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <strong>DBMS Assignment</strong> (Tomorrow) • <strong>Dragon of OS Exam</strong> (In 4 Days)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('bosses');
            }}
            className="flex items-center gap-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 px-3 py-1.5 text-xs font-bold text-rose-300 self-start sm:self-center transition-colors"
          >
            <Swords className="h-3.5 w-3.5" />
            <span>View Boss Battles</span>
          </button>
        </div>
      </div>

      {/* TODAY'S QUESTS Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black tracking-wide text-white flex items-center gap-2">
              <Swords className="h-5 w-5 text-cyan-400" />
              TODAY'S HIGH-IMPACT QUESTS
            </h2>
            <p className="text-xs text-slate-400">
              Actionable missions synthesized by AI to maximize career readiness and academic health.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('quests');
            }}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            View All ({quests.length}) <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeTodayQuests.map((quest, idx) => (
            <div
              key={quest.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all group"
            >
              <div>
                {/* Header Tag & Time */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                  <span className="font-mono font-bold text-slate-400">
                    ⚔️ QUEST 0{idx + 1}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3 text-slate-500" /> {quest.timeMinutes} mins
                  </span>
                </div>

                {/* Quest Title & Desc */}
                <h3 className="mt-3 font-bold text-slate-100 text-sm sm:text-base group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {quest.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {quest.description}
                </p>

                {/* AI Reasoning Pill */}
                <div className="mt-3 rounded-lg bg-slate-950/80 border border-slate-800/80 p-2 text-[11px] text-slate-300">
                  <span className="font-bold text-cyan-400">AI Why:</span> {quest.aiReasoning}
                </div>

                {/* Stats & Difficulty */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">+{quest.xp} XP</span>
                  <span className="text-amber-400 font-mono tracking-wider">{quest.difficulty}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenQuest(quest);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-2 text-xs font-extrabold text-white shadow-md shadow-cyan-500/10 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>START QUEST</span>
                </button>
                <button
                  onClick={() => {
                    sound.playQuestComplete();
                    onCompleteQuest(quest.id);
                  }}
                  className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-colors"
                  title="Mark as Completed"
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RPG CHARACTER STATS Grid (Prompt #4) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black tracking-wide text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              RPG CHARACTER ATTRIBUTES
            </h2>
            <p className="text-xs text-slate-400">
              Live progression metrics reflecting your real academic and professional competency.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('skilltree');
            }}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Explore Skill Tree <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 hover:bg-slate-900/90 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{stat.emoji}</span>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-200">
                      {stat.name}
                    </h4>
                    <span className="text-[10px] text-slate-500">Lv {stat.level}</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {stat.progressPercent}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${stat.progressPercent}%` }}
                ></div>
              </div>

              <div className="mt-2 text-[11px] text-slate-400">
                <p className="text-emerald-400 font-semibold">{stat.recentImprovement}</p>
                <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 truncate mr-2">Next: {stat.recommendedQuest}</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
