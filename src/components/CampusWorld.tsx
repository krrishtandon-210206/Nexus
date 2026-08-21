import React from 'react';
import { Quest } from '../types';
import { sound } from '../utils/sound';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Swords, 
  Trophy, 
  CheckCircle2, 
  Play, 
  ArrowRight,
  BrainCircuit
} from 'lucide-react';

interface CampusWorldProps {
  onAcceptCampusQuest: (quest: Quest) => void;
}

export const CampusWorld: React.FC<CampusWorldProps> = ({ onAcceptCampusQuest }) => {
  const campusEvents = [
    {
      id: 'campus-1',
      title: 'Attend Campus AI Club Workshop: Prompt & LLM Internals',
      location: 'Science Hall 304 • Friday 4:00 PM',
      category: 'CAMPUS',
      xp: 80,
      time: '60 min',
      difficulty: '★★☆☆☆',
      relevance: 'HIGH (Aligns with AI goals)',
      description: 'Hands-on live coding workshop with Gemini APIs and student developer networking.',
      reasoning: 'You indicated an interest in software engineering; peer collaboration boosts hackathon placement.',
    },
    {
      id: 'campus-2',
      title: 'Join Hackathon Squad Formation & Ideation Sprint',
      location: 'Innovation Lab • Saturday 11:00 AM',
      category: 'CAMPUS',
      xp: 120,
      time: '90 min',
      difficulty: '★★★☆☆',
      relevance: 'HIGH (Matches Hackathon goal)',
      description: 'Form a 4-person cross-functional team and brainstorm the hackathon prototype.',
      reasoning: 'Team Phoenix has an open backend role matching your current semester focus.',
    },
    {
      id: 'campus-3',
      title: 'Attend Placement Cell Mock Technical Screening Drive',
      location: 'Auditorium B • Next Tuesday 2:00 PM',
      category: 'CAREER',
      xp: 100,
      time: '45 min',
      difficulty: '★★★☆☆',
      relevance: 'CRITICAL (Prepares for interviews)',
      description: 'Simulated campus recruitment aptitude and algorithm round under timed conditions.',
      reasoning: 'Identifies any hidden gaps before real on-campus placement season.',
    },
    {
      id: 'campus-4',
      title: 'Join Senior Peer Code Review Circle',
      location: 'Library Group Room 2 • Wednesday 5:00 PM',
      category: 'ACADEMIC',
      xp: 60,
      time: '45 min',
      difficulty: '★★☆☆☆',
      relevance: 'MEDIUM',
      description: 'Exchange feedback on DBMS normalization homework and database query benchmarks.',
      reasoning: 'Directly validates your DBMS assignment due tomorrow.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-teal-900/40 bg-gradient-to-r from-slate-900 via-teal-950/20 to-slate-950 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              CAMPUS OPPORTUNITY ENGINE • PHYSICAL & SOCIAL
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-teal-400" />
            CAMPUS WORLD
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real campus clubs, hackathons, and study sessions dynamically converted into high-relevance quests.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campusEvents.map((evt) => (
          <div
            key={evt.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-5 hover:border-teal-500/40 hover:shadow-lg transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-teal-400" />
                  {evt.location}
                </span>
                <span className="rounded-full bg-teal-950 px-2 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-800 font-mono">
                  {evt.relevance}
                </span>
              </div>

              <h3 className="mt-3 font-bold text-white text-base">
                {evt.title}
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {evt.description}
              </p>

              {/* AI Why */}
              <div className="mt-3 rounded-lg bg-slate-950/80 border border-slate-800 p-2.5 text-[11px] text-slate-300">
                <span className="font-bold text-teal-400 flex items-center gap-1">
                  <BrainCircuit className="h-3 w-3" /> Campus AI Sync:
                </span>
                <p className="mt-0.5 text-slate-400">{evt.reasoning}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-mono font-bold text-emerald-400">+{evt.xp} XP</span>
                <span className="text-slate-500 font-mono">{evt.time}</span>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onAcceptCampusQuest({
                    id: `campus-accepted-${Date.now()}`,
                    title: evt.title,
                    description: evt.description,
                    category: 'CAMPUS',
                    xp: evt.xp,
                    energyCost: 10,
                    timeMinutes: 45,
                    difficulty: evt.difficulty,
                    difficultyLevel: 2,
                    skillImpact: 'Networking +10, Campus Engagement +8',
                    careerImpact: '+2.0%',
                    aiReasoning: evt.reasoning,
                    completed: false,
                  });
                }}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>ACCEPT QUEST</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
