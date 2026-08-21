import React, { useState } from 'react';
import { sound } from '../utils/sound';
import { 
  Users2, 
  Trophy, 
  Swords, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';

interface TeamModeProps {
  onCompleteSquadQuest: (xp: number, title: string) => void;
}

export const TeamMode: React.FC<TeamModeProps> = ({ onCompleteSquadQuest }) => {
  const [teamProgress, setTeamProgress] = useState(65);
  const [squadMembers, setSquadMembers] = useState([
    { name: 'Alex (You)', role: 'Backend & ML Architecture', quest: 'Implement Cloud Endpoint & Gemini Embeddings', status: 'IN_PROGRESS', xp: 180, isUser: true },
    { name: 'Maya', role: 'UI/UX & Frontend Lead', quest: 'Figma Prototype & Design Token Sync', status: 'COMPLETED', xp: 150, isUser: false },
    { name: 'Jordan', role: 'Prompt Engineering & Testing', quest: 'Evaluation Benchmark Suite on 50 Edge Cases', status: 'IN_PROGRESS', xp: 140, isUser: false },
    { name: 'Dev', role: 'Pitch Deck & Video Demo', quest: '3-Minute Hackathon Demo Script & Slides', status: 'ASSIGNED', xp: 120, isUser: false },
  ]);

  const handleCompleteMyQuest = () => {
    sound.playQuestComplete();
    setSquadMembers((prev) =>
      prev.map((m) => (m.isUser ? { ...m, status: 'COMPLETED' } : m))
    );
    setTeamProgress((p) => Math.min(100, p + 15));
    onCompleteSquadQuest(180, 'Implement Cloud Endpoint & Gemini Embeddings');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-purple-900/40 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-950 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              MULTIPLAYER SQUAD CAMPAIGN • COLLABORATION
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Users2 className="h-6 w-6 text-purple-400" />
            TEAM MODE • SQUAD PHOENIX
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Share campaign goals with teammates, distribute deliverables, and tackle joint hackathons or group projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-purple-950 px-3 py-1 text-xs font-mono font-bold text-purple-300 border border-purple-800">
            🏆 Target: AI Studio Hackathon
          </span>
        </div>
      </div>

      {/* Team Objective & Shared Progress */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase">SHARED SQUAD OBJECTIVE</span>
            <h3 className="text-lg font-black text-white mt-0.5">
              Deploy "MediGuard AI" Fullstack Prototype
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-400">TEAM READINESS</span>
            <div className="text-2xl font-black text-purple-400 font-mono">{teamProgress}%</div>
          </div>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
            style={{ width: `${teamProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>Target Deadline: Sunday 11:59 PM</span>
          <span>Squad Pool Bonus: +500 XP upon completion</span>
        </div>
      </div>

      {/* Member Quest Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">
          SQUAD ROSTER & ACTIVE DELIVERABLES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {squadMembers.map((member) => (
            <div
              key={member.name}
              className={`rounded-2xl border p-5 transition-all ${
                member.isUser
                  ? 'border-cyan-500/50 bg-cyan-950/20 shadow-lg'
                  : 'border-slate-800 bg-slate-900/70'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    {member.name}
                    {member.isUser && (
                      <span className="rounded bg-cyan-500 text-slate-950 px-1.5 py-0.2 text-[9px] font-black">
                        YOU
                      </span>
                    )}
                  </h4>
                  <span className="text-[11px] text-slate-400">{member.role}</span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  member.status === 'COMPLETED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : member.status === 'IN_PROGRESS'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {member.status}
                </span>
              </div>

              <div className="mt-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase">ASSIGNED MISSION:</span>
                <p className="mt-0.5 font-bold text-slate-200 text-xs sm:text-sm">
                  {member.quest}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">+{member.xp} XP</span>

                {member.isUser && member.status !== 'COMPLETED' ? (
                  <button
                    onClick={handleCompleteMyQuest}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-1.5 text-xs font-extrabold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>COMPLETE SQUAD MISSION</span>
                  </button>
                ) : member.status === 'COMPLETED' ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> DELIVERED
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-mono">Working in progress...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
