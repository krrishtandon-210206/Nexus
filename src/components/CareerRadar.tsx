import React, { useState } from 'react';
import { PlayerProfile, Quest } from '../types';
import { sound } from '../utils/sound';
import { 
  Target, 
  TrendingUp, 
  BrainCircuit, 
  Sparkles, 
  Swords, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  FileText,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface CareerRadarProps {
  player: PlayerProfile;
  onLaunchGapQuest: (quest: Quest) => void;
}

export const CareerRadar: React.FC<CareerRadarProps> = ({
  player,
  onLaunchGapQuest,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('Software Engineer');
  const [resumeText, setResumeText] = useState<string>('');
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);

  const careerLevels = [
    { level: 1, name: 'Explorer', desc: 'Syntax discovery & fundamental CS courses.' },
    { level: 10, name: 'Skill Builder', desc: 'Core DSA, assignments, and database queries.', current: true },
    { level: 20, name: 'Project Builder', desc: 'Fullstack cloud deployments & portfolio pieces.' },
    { level: 30, name: 'Interview Ready', desc: 'High mock pass rates & behavioral composure.' },
    { level: 40, name: 'Industry Ready', desc: 'Verified candidate for top internships & offers.' },
  ];

  const skillGaps = [
    { name: 'Data Structures & Algorithms', current: 18, target: 80, gap: 'HIGH' },
    { name: 'System Design & Architecture', current: 12, target: 70, gap: 'HIGH' },
    { name: 'Python Engineering', current: 32, target: 85, gap: 'MEDIUM' },
    { name: 'Git & Version Control', current: 55, target: 85, gap: 'LOW' },
    { name: 'Communication & STAR Stories', current: 61, target: 80, gap: 'LOW' },
    { name: 'SQL & Relational Databases', current: 67, target: 75, gap: 'LOW' },
  ];

  const handleAnalyzeResume = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsAnalyzingResume(true);

    try {
      const res = await fetch('/api/gemini/resume-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText || '3rd Year CS Student. Knowledge of Python, HTML, Basic SQL. Completed university DBMS coursework.',
          targetRole: selectedRole,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResumeAnalysis(data);
      }
    } catch (err) {
      console.error('Resume analyzer error:', err);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const handleLaunchArrayBossQuest = () => {
    sound.playClick();
    const gapQuest: Quest = {
      id: `gap-dsa-${Date.now()}`,
      title: 'Defeat the Array & Two-Pointer Boss Trial',
      description: 'Solve 2 targeted array sliding window challenges to conquer your 18% DSA gap.',
      category: 'TECH SKILLS',
      xp: 180,
      energyCost: 20,
      timeMinutes: 40,
      difficulty: '★★★★☆',
      difficultyLevel: 4,
      skillImpact: 'DSA +18, Problem Solving +8',
      careerImpact: '+5.0%',
      aiReasoning: 'DSA is your single largest career gap. Addressing this boosts overall Career Readiness directly.',
      completed: false,
    };
    onLaunchGapQuest(gapQuest);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              TARGET COMPETENCY • REAL-WORLD ALIGNMENT
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-cyan-400" />
            CAREER RADAR & RESUME CONVERTER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Identify exact skill discrepancies against real job market requirements and turn resume gaps into actionable RPG quests.
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold hidden sm:inline">Target Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => {
              sound.playClick();
              setSelectedRole(e.target.value);
            }}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-cyan-400 focus:border-cyan-500 focus:outline-none"
          >
            <option value="Software Engineer">💻 Software Engineer</option>
            <option value="AI / ML Engineer">🤖 AI / ML Engineer</option>
            <option value="Fullstack Developer">⚡ Fullstack Developer</option>
            <option value="Cloud Architect">☁️ Cloud Architect</option>
          </select>
        </div>
      </div>

      {/* Career Evolution Milestones Bar (Prompt #11) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            CAREER PROGRESSION EVOLUTION
          </h3>
          <span className="text-[11px] text-slate-400">
            *Career levels represent goal progress, not guaranteed employment.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {careerLevels.map((lvl) => (
            <div
              key={lvl.name}
              className={`rounded-xl border p-3.5 transition-all ${
                lvl.current
                  ? 'border-cyan-500 bg-cyan-950/40 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'border-slate-800 bg-slate-950/60'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">LEVEL {lvl.level}</span>
                {lvl.current && (
                  <span className="rounded bg-cyan-500 text-slate-950 px-1.5 py-0.2 text-[9px] font-black">
                    CURRENT
                  </span>
                )}
              </div>
              <h4 className="mt-1 font-black text-white text-sm">{lvl.name}</h4>
              <p className="mt-1 text-[11px] text-slate-400 leading-snug">{lvl.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gaps Breakdown & Gap Action Launcher (Prompt #18) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar / Gap Bars (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-extrabold text-white">
              SKILL READINESS DISCREPANCY MATRIX
            </h3>
            <span className="text-xs font-mono font-bold text-cyan-400">
              Overall: {player.careerReadiness}%
            </span>
          </div>

          <div className="space-y-3.5">
            {skillGaps.map((sk) => (
              <div key={sk.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{sk.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">{sk.current}% / {sk.target}%</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      sk.gap === 'HIGH' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {sk.gap} GAP
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      sk.current < 25
                        ? 'bg-rose-500'
                        : sk.current < 50
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                    }`}
                    style={{ width: `${sk.current}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Gap recommendation */}
          <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
            <div>
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                HIGHEST-IMPACT BOTTLENECK DETECTED
              </span>
              <p className="text-xs text-slate-300 mt-1">
                Your largest gap is <strong>DSA (18%)</strong>. Conquering this unlocks the Project Builder class.
              </p>
            </div>
            <button
              onClick={handleLaunchArrayBossQuest}
              className="shrink-0 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-md shadow-rose-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Swords className="h-4 w-4 fill-slate-950" />
              <span>LAUNCH DSA QUEST</span>
            </button>
          </div>
        </div>

        {/* Resume to Quest Converter (5 cols) (Prompt #19) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileText className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-extrabold text-white">
                RESUME → QUEST CONVERTER
              </h3>
              <p className="text-[11px] text-slate-400">
                Paste your resume text to extract portfolio gaps and generate high-yield missions.
              </p>
            </div>
          </div>

          <form onSubmit={handleAnalyzeResume} className="space-y-3">
            <textarea
              rows={4}
              placeholder="Paste your resume summary, project descriptions, or course coursework here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            ></textarea>

            <button
              type="submit"
              disabled={isAnalyzingResume}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-indigo-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isAnalyzingResume ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="h-4 w-4" />
              )}
              <span>ANALYZE RESUME & GENERATE QUESTS</span>
            </button>
          </form>

          {/* Analysis Output */}
          {resumeAnalysis && (
            <div className="rounded-xl border border-indigo-900/40 bg-slate-950 p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-slate-800">
                <span className="text-indigo-300">ANALYSIS COMPLETE</span>
                <span className="text-emerald-400 font-mono">Score: {resumeAnalysis.careerReadinessScore}%</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400">CRITICAL GAPS:</span>
                <ul className="mt-1 space-y-1 text-xs text-rose-300">
                  {resumeAnalysis.gaps?.map((g: string, i: number) => (
                    <li key={i} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400">GENERATED QUEST:</span>
                {resumeAnalysis.generatedQuests?.[0] && (
                  <div className="mt-1.5 rounded-lg bg-slate-900 border border-slate-800 p-2.5 flex items-center justify-between gap-2">
                    <div>
                      <h5 className="text-xs font-bold text-slate-100">
                        {resumeAnalysis.generatedQuests[0].title}
                      </h5>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        +{resumeAnalysis.generatedQuests[0].xp} XP • {resumeAnalysis.generatedQuests[0].careerImpact}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onLaunchGapQuest(resumeAnalysis.generatedQuests[0]);
                      }}
                      className="rounded-lg bg-cyan-500 text-slate-950 px-2.5 py-1 text-[11px] font-extrabold hover:bg-cyan-400 transition-colors shrink-0"
                    >
                      ACCEPT
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
