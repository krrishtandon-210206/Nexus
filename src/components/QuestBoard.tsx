import React, { useState } from 'react';
import { Quest, QuestCategory } from '../types';
import { sound } from '../utils/sound';
import { 
  Swords, 
  Filter, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Play, 
  Zap, 
  Sparkles, 
  BrainCircuit, 
  Check, 
  Flame,
  Award,
  ChevronDown
} from 'lucide-react';

interface QuestBoardProps {
  quests: Quest[];
  onOpenQuest: (quest: Quest) => void;
  onCompleteQuest: (questId: string) => void;
  onAddQuest: (newQuest: Quest) => void;
  onOpenAiGameMaster?: () => void;
}

export const QuestBoard: React.FC<QuestBoardProps> = ({
  quests,
  onOpenQuest,
  onCompleteQuest,
  onAddQuest,
  onOpenAiGameMaster,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<QuestCategory>('TECH SKILLS');
  const [newTime, setNewTime] = useState(30);
  const [newDifficulty, setNewDifficulty] = useState<'★★★☆☆' | '★★★★☆' | '★★☆☆☆'>('★★★☆☆');
  const [newXp, setNewXp] = useState(120);

  const categories = [
    { id: 'ALL', label: 'All Quests' },
    { id: 'ACADEMIC', label: '📚 Academic' },
    { id: 'TECH SKILLS', label: '💻 Tech Skills' },
    { id: 'CAREER', label: '🎯 Career' },
    { id: 'PERSONAL DEVELOPMENT', label: '🧠 Personal Dev' },
    { id: 'FINANCIAL', label: '💰 Financial' },
    { id: 'CAMPUS', label: '🌍 Campus' },
    { id: 'SOCIAL', label: '🤝 Social' },
  ];

  const filteredQuests = quests.filter((q) => {
    if (selectedCategory === 'ALL') return true;
    return q.category === selectedCategory;
  });

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sound.playClick();
    const created: Quest = {
      id: `custom-q-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Student-created custom mission.',
      category: newCat,
      xp: Number(newXp) || 120,
      energyCost: 15,
      timeMinutes: Number(newTime) || 30,
      difficulty: newDifficulty,
      difficultyLevel: newDifficulty === '★★★★☆' ? 4 : newDifficulty === '★★★☆☆' ? 3 : 2,
      skillImpact: `${newCat} Competency +8`,
      careerImpact: '+3.0%',
      deadline: 'Today',
      aiReasoning: 'Custom self-directed quest aligned with personal growth goals.',
      completed: false,
    };

    onAddQuest(created);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              MISSION ARCHIVE • LEVEL PROGRESSION
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Swords className="h-6 w-6 text-cyan-400" />
            QUEST BOARD
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Demonstrate real skills, complete coursework, and execute career preparation to earn verified XP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          {onOpenAiGameMaster && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenAiGameMaster();
              }}
              className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/60 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-indigo-300 hover:bg-indigo-900/60 hover:text-white transition-all shadow-md active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>AI RECOMMEND QUESTS</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>NEW QUEST</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'ALL' 
            ? quests.length 
            : quests.filter((q) => q.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                isSelected ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuests.map((quest) => (
          <div
            key={quest.id}
            className={`flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-md transition-all group ${
              quest.completed
                ? 'border-slate-800/60 bg-slate-950/40 opacity-75'
                : 'border-slate-800 bg-slate-900/70 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5'
            }`}
          >
            <div>
              {/* Header: Category & Deadline */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-cyan-300 font-mono">
                  {quest.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="h-3 w-3 text-slate-500" /> {quest.timeMinutes}m
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className={`mt-3 font-bold text-sm sm:text-base leading-snug ${
                quest.completed ? 'text-slate-400 line-through' : 'text-slate-100 group-hover:text-cyan-300'
              }`}>
                {quest.title}
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-3">
                {quest.description}
              </p>

              {/* AI Reasoning pill */}
              <div className="mt-3 rounded-lg bg-slate-950/80 border border-slate-800/80 p-2.5 text-[11px] text-slate-300">
                <span className="font-bold text-indigo-400 flex items-center gap-1">
                  <BrainCircuit className="h-3 w-3" /> AI Context:
                </span>
                <p className="mt-0.5 text-slate-400 line-clamp-2">{quest.aiReasoning}</p>
              </div>

              {/* Rewards & Skill Impact */}
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">+{quest.xp} XP</span>
                  <span className="text-amber-400 font-mono">{quest.difficulty}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Impact: <strong className="text-cyan-400 font-normal">{quest.skillImpact}</strong></span>
                  <span className="text-emerald-400 font-semibold">{quest.careerImpact}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
              {quest.completed ? (
                <div className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-bold">
                  <Check className="h-4 w-4" />
                  <span>QUEST COMPLETED (+{quest.xp} XP)</span>
                </div>
              ) : (
                <>
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
                    title="Mark Complete"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Quest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Swords className="h-4 w-4 text-cyan-400" />
                CREATE CUSTOM QUEST
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuest} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Quest Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Graph BFS in C++"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as QuestCategory)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="ACADEMIC">📚 Academic</option>
                  <option value="TECH SKILLS">💻 Tech Skills</option>
                  <option value="CAREER">🎯 Career</option>
                  <option value="PERSONAL DEVELOPMENT">🧠 Personal Development</option>
                  <option value="FINANCIAL">💰 Financial</option>
                  <option value="CAMPUS">🌍 Campus</option>
                  <option value="SOCIAL">🤝 Social</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Estimated Time (mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newTime}
                    onChange={(e) => setNewTime(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">XP Reward</label>
                  <input
                    type="number"
                    min="20"
                    max="500"
                    value={newXp}
                    onChange={(e) => setNewXp(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Outline key deliverables or test cases..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110"
                >
                  Create Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
