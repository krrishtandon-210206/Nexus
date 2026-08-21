import React, { useState } from 'react';
import { VideoLecture } from '../types';
import { sound } from '../utils/sound';
import { 
  Play, 
  Youtube, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Clock, 
  ExternalLink, 
  Plus, 
  FileText, 
  Copy, 
  Download, 
  Check, 
  Layers,
  BrainCircuit,
  Filter
} from 'lucide-react';

interface VideoLecturesProps {
  lectures: VideoLecture[];
  onCompleteLecture: (lectureId: string, xpReward: number) => void;
  onAddCustomLecture: (newLecture: VideoLecture) => void;
}

export const VideoLectures: React.FC<VideoLecturesProps> = ({
  lectures,
  onCompleteLecture,
  onAddCustomLecture,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLecture, setActiveLecture] = useState<VideoLecture | null>(lectures[0] || null);
  const [customUrl, setCustomUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<VideoLecture['category']>('DSA');
  const [showAddModal, setShowAddModal] = useState(false);
  const [notes, setNotes] = useState<{ [key: string]: string }>({
    'lec-1': 'Key takeaway: Focus on identifying patterns (like two pointers or fast/slow pointers) rather than memorizing individual problems.',
  });
  const [copiedNote, setCopiedNote] = useState(false);

  const categories = [
    'ALL',
    'DSA',
    'SYSTEM DESIGN',
    'OPERATING SYSTEMS',
    'AI & ML',
    'WEB DEV',
    'CAREER & FINANCE',
  ];

  // Helper to extract YouTube ID from any standard or short URL
  const extractYoutubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : 'KLlXCFG5TnA';
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const ytId = extractYoutubeId(customUrl.trim());
    const newLec: VideoLecture = {
      id: `custom-lec-${Date.now()}`,
      title: customTitle.trim() || 'Custom YouTube Masterclass',
      channel: 'YouTube Creator',
      duration: '30 mins',
      category: customCategory,
      youtubeId: ytId,
      youtubeUrl: customUrl.trim(),
      thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      description: 'Custom video lecture added to your Nexus RPG Lore Academy study schedule.',
      topicsCovered: [customCategory, 'Core Mastery', 'Active Recall'],
      xpReward: 60,
      completed: false,
    };

    onAddCustomLecture(newLec);
    setActiveLecture(newLec);
    setCustomUrl('');
    setCustomTitle('');
    setShowAddModal(false);
    sound.playQuestComplete();
  };

  const filteredLectures = lectures.filter((lec) => {
    const matchesCat = selectedCategory === 'ALL' || lec.category === selectedCategory;
    const matchesSearch =
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.topicsCovered.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopyNotes = () => {
    if (!activeLecture) return;
    const noteText = notes[activeLecture.id] || '';
    navigator.clipboard.writeText(noteText);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  const handleDownloadNotes = () => {
    if (!activeLecture) return;
    const noteText = notes[activeLecture.id] || '';
    const content = `# Notes: ${activeLecture.title}\nChannel: ${activeLecture.channel}\nCategory: ${activeLecture.category}\nLink: ${activeLecture.youtubeUrl}\n\n## Lecture Notes:\n${noteText}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeLecture.title.slice(0, 20).replace(/\s+/g, '_')}_notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-red-900/40 bg-gradient-to-r from-slate-900 via-red-950/20 to-slate-950 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              LORE ACADEMY • FREE VIDEO ARCHIVE
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Youtube className="h-7 w-7 text-red-500" />
            FREE VIDEO LECTURES & PREVIEWS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Curated high-yield YouTube lectures across Data Structures, Operating Systems, System Design, AI/ML, and Career Prep. Watch in-app, take structured notes, and earn RPG XP.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-red-500/20 hover:brightness-110 active:scale-95 transition-all self-start md:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom YouTube Link</span>
        </button>
      </div>

      {/* Main Interactive Stage: Active Video Player & Smart Notes */}
      {activeLecture && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
          {/* Left / Top: Embedded YouTube Player Preview (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${activeLecture.youtubeId}?rel=0`}
                title={activeLecture.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-red-950/80 px-2 py-0.5 text-[10px] font-bold text-red-300 border border-red-800 font-mono">
                    {activeLecture.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    By {activeLecture.channel} • {activeLecture.duration}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  {activeLecture.title}
                </h2>
              </div>

              {/* Claim XP / Complete Button */}
              <div className="flex items-center gap-2 shrink-0">
                {activeLecture.completed ? (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-2 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>XP CLAIMED (+{activeLecture.xpReward} XP)</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      sound.playQuestComplete();
                      onCompleteLecture(activeLecture.id, activeLecture.xpReward);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>CLAIM +{activeLecture.xpReward} XP</span>
                  </button>
                )}
                <a
                  href={activeLecture.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:text-white transition-colors"
                  title="Open on YouTube"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Description & Topics Covered */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeLecture.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400">Key Concepts:</span>
              {activeLecture.topicsCovered.map((topic) => (
                <span
                  key={topic}
                  className="rounded-lg bg-slate-800 border border-slate-700 px-2 py-0.5 text-[11px] text-cyan-300 font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Smart Study Notes & Recall Scratchpad (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-200">
                    LECTURE SCRATCHPAD & ACTIVE RECALL
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyNotes}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                    title="Copy Notes"
                  >
                    {copiedNote ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={handleDownloadNotes}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                    title="Download Markdown Notes"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-2">
                Type summary notes, code snippets, or key formulas while watching. Notes automatically persist in your local study session.
              </p>

              <textarea
                value={notes[activeLecture.id] || ''}
                onChange={(e) =>
                  setNotes({ ...notes, [activeLecture.id]: e.target.value })
                }
                placeholder="Write your lecture takeaways, Big-O notes, edge cases, and mnemonic triggers here..."
                rows={9}
                className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>

            {/* Micro Quick-Action Footnote */}
            <div className="rounded-xl bg-cyan-950/20 border border-cyan-900/30 p-3 text-[11px] text-cyan-300 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>
                <strong>Study Tip:</strong> Summarize the core concept in your own words before marking the lecture as complete.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic, title, or channel..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lectures Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLectures.map((lec) => {
          const isSelected = activeLecture?.id === lec.id;
          return (
            <div
              key={lec.id}
              onClick={() => {
                sound.playClick();
                setActiveLecture(lec);
              }}
              className={`cursor-pointer rounded-2xl border p-4 transition-all group flex flex-col justify-between ${
                isSelected
                  ? 'border-red-500 bg-slate-900 shadow-lg shadow-red-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Thumbnail with overlay duration */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80">
                  <img
                    src={lec.thumbnail}
                    alt={lec.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white font-mono backdrop-blur-sm">
                      {lec.duration}
                    </span>
                    <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      {lec.category}
                    </span>
                  </div>

                  {/* Centered Play icon on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/40">
                      <Play className="h-6 w-6 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Title & Channel */}
                <h4 className="mt-3 font-extrabold text-slate-100 text-sm group-hover:text-red-400 transition-colors line-clamp-2">
                  {lec.title}
                </h4>
                <p className="mt-1 text-xs text-slate-400">{lec.channel}</p>
              </div>

              {/* Card Footer: XP & Completion Status */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400">+{lec.xpReward} XP</span>
                {lec.completed ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                  </span>
                ) : (
                  <span className="text-cyan-400 flex items-center gap-1 font-semibold text-[11px]">
                    Watch & Earn <Play className="h-3 w-3 fill-cyan-400" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Custom YouTube Link */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                <h3 className="text-base font-black text-white">
                  ADD CUSTOM YOUTUBE LECTURE
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ CLOSE
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste any YouTube video link (e.g., tutorial, MIT OCW lecture, conference talk) to embed it into your Nexus RPG study schedule and award XP upon completion.
            </p>

            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  YouTube URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Lecture Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Graph Algorithms Masterclass"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Subject Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-slate-300 focus:border-red-500 focus:outline-none"
                >
                  <option value="DSA">DSA & Algorithms</option>
                  <option value="SYSTEM DESIGN">System Design</option>
                  <option value="OPERATING SYSTEMS">Operating Systems</option>
                  <option value="AI & ML">AI & Machine Learning</option>
                  <option value="WEB DEV">Full-Stack Web Dev</option>
                  <option value="CAREER & FINANCE">Career & Finance</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-red-500/20 hover:brightness-110 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  <span>Import & Start Learning</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
