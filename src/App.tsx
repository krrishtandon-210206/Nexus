import React, { useState } from 'react';
import { 
  INITIAL_PLAYER, 
  INITIAL_STATS, 
  INITIAL_QUESTS, 
  INITIAL_BOSSES, 
  INITIAL_SKILL_NODES, 
  INITIAL_ACHIEVEMENTS,
  INITIAL_LECTURES,
  INITIAL_STUDY_ROOMS
} from './data/initialData';
import { 
  PlayerProfile, 
  PlayerStat, 
  Quest, 
  BossBattle, 
  SkillNode, 
  Achievement, 
  VideoLecture, 
  StudyRoom 
} from './types';
import { sound } from './utils/sound';
import confetti from 'canvas-confetti';

// Components
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { CommandCenter } from './components/CommandCenter';
import { AIGameMaster } from './components/AIGameMaster';
import { QuestBoard } from './components/QuestBoard';
import { BossBattles } from './components/BossBattles';
import { SkillTree } from './components/SkillTree';
import { CareerRadar } from './components/CareerRadar';
import { FutureSelf } from './components/FutureSelf';
import { CampusWorld } from './components/CampusWorld';
import { MoneyQuests } from './components/MoneyQuests';
import { TeamMode } from './components/TeamMode';
import { AchievementsHall } from './components/AchievementsHall';
import { RapidFireArena } from './components/RapidFireArena';
import { ActiveQuestModal } from './components/ActiveQuestModal';
import { JudgeDemoTour } from './components/JudgeDemoTour';
import { VideoLectures } from './components/VideoLectures';
import { GroupStudyRooms } from './components/GroupStudyRooms';

import { Sparkles, Trophy, Flame, ShieldAlert, Award, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [player, setPlayer] = useState<PlayerProfile>(INITIAL_PLAYER);
  const [stats, setStats] = useState<PlayerStat[]>(INITIAL_STATS);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [bosses, setBosses] = useState<BossBattle[]>(INITIAL_BOSSES);
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>(INITIAL_SKILL_NODES);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [lectures, setLectures] = useState<VideoLecture[]>(INITIAL_LECTURES);
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>(INITIAL_STUDY_ROOMS);

  // Modals & Tour States
  const [activeQuestModal, setActiveQuestModal] = useState<Quest | null>(null);
  const [rapidFireTopic, setRapidFireTopic] = useState<string | null>(null);
  const [showJudgeTour, setShowJudgeTour] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string; icon?: string } | null>(null);

  const showToast = (title: string, subtitle: string, icon = '✨') => {
    setToastMessage({ title, subtitle, icon });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset Data Handler
  const handleResetData = () => {
    setPlayer(INITIAL_PLAYER);
    setStats(INITIAL_STATS);
    setQuests(INITIAL_QUESTS);
    setBosses(INITIAL_BOSSES);
    setSkillNodes(INITIAL_SKILL_NODES);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setLectures(INITIAL_LECTURES);
    setStudyRooms(INITIAL_STUDY_ROOMS);
    showToast('🔄 Demo Data Restored', 'Reset character and missions to fresh hackathon state.');
  };

  // XP & Level Progression Engine
  const awardXp = (amount: number, reason: string) => {
    setPlayer((prev) => {
      const newXp = prev.xp + amount;
      const newTodayXp = prev.todayXp + amount;
      let newLevel = prev.level;
      let xpToNext = prev.xpToNextLevel;
      let newClass = prev.currentClass;
      let nextEvo = prev.nextEvolution;

      // Check level up threshold
      if (newXp >= xpToNext) {
        newLevel += 1;
        xpToNext = Math.round(xpToNext * 1.25);
        sound.playLevelUp();
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#06b6d4', '#6366f1', '#f59e0b', '#10b981'],
        });
        showToast(
          `🎉 LEVEL UP! REACHED LEVEL ${newLevel}!`,
          `XP Threshold Surpassed. Real effort yields real power.`
        );

        // Class evolution checks
        if (newLevel >= 20 && newClass === 'Skill Builder') {
          newClass = 'Project Builder';
          nextEvo = 'Interview Ready';
          showToast('🌟 CLASS EVOLUTION UNLOCKED!', 'Promoted to Project Builder!');
        }
      }

      return {
        ...prev,
        xp: newXp,
        todayXp: newTodayXp,
        level: newLevel,
        xpToNextLevel: xpToNext,
        currentClass: newClass,
        nextEvolution: nextEvo,
      };
    });
  };

  // Lecture Completion Handler
  const handleCompleteLecture = (lectureId: string, xpReward: number) => {
    setLectures((prev) =>
      prev.map((lec) => (lec.id === lectureId ? { ...lec, completed: true } : lec))
    );
    awardXp(xpReward, 'Completed YouTube Video Lecture');
    showToast(`📺 Lecture Mastered (+${xpReward} XP)`, 'Knowledge synthesized into RPG character power.');
  };

  const handleAddCustomLecture = (newLec: VideoLecture) => {
    setLectures((prev) => [newLec, ...prev]);
    showToast('📺 YouTube Lecture Added', newLec.title);
  };

  // Create Room Handler
  const handleCreateRoom = (newRoom: StudyRoom) => {
    setStudyRooms((prev) => [newRoom, ...prev]);
    showToast('🛡️ Group Study Room Created', newRoom.name);
  };

  // Quest Completion Handlers
  const handleCompleteQuest = (questId: string) => {
    const target = quests.find((q) => q.id === questId);
    if (!target || target.completed) return;

    sound.playQuestComplete();
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, completed: true } : q))
    );

    awardXp(target.xp, target.title);
    showToast(`⚔️ Quest Completed: +${target.xp} XP`, target.title);

    // Boost related stats
    setStats((prev) =>
      prev.map((st) => {
        if (st.name.toLowerCase().includes('technical') || st.name.toLowerCase().includes('knowledge')) {
          return { ...st, progressPercent: Math.min(100, st.progressPercent + 4) };
        }
        return st;
      })
    );
  };

  // Accept Quests from AI Game Master
  const handleAcceptPlan = (newQuests: Quest[]) => {
    setQuests((prev) => [...newQuests, ...prev]);
    awardXp(50, 'Strategic AI Plan Formulation');
    showToast('🧠 Game Master Plan Injected', `Added ${newQuests.length} tactical missions to Quest Board.`);
    setActiveTab('quests');
  };

  // Defeat Boss Handler
  const handleDefeatBoss = (
    bossId: string,
    xpReward: number,
    skills: { skill: string; boost: number }[]
  ) => {
    awardXp(xpReward, `Boss Defeated`);
    showToast('🏆 BOSS DEFEATED!', `Earned +${xpReward} XP & conquered semester milestone!`);

    // Unlock achievement
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === 'badge-2' ? { ...a, unlocked: true, unlockedAt: 'Today' } : a
      )
    );
  };

  // Restore Energy / Rest
  const handleRestoreEnergy = () => {
    sound.playQuestComplete();
    setPlayer((prev) => ({ ...prev, energy: Math.min(100, prev.energy + 28) }));
    showToast('⚡ Power Rest Logged', 'Restored +28 Stamina points. Strategic rest prevents burnout.');
  };

  // Rapid Fire Result
  const handleFinishQuiz = (score: number, total: number, earnedXp: number, weakArea: string) => {
    awardXp(earnedXp, 'Rapid-Fire Quiz Victory');
    showToast('⚡ Rapid-Fire Completed', `Score: ${score}/${total} (+${earnedXp} XP)`);

    // Add targeted quest for weak area
    const newTargetedQuest: Quest = {
      id: `targeted-weakness-${Date.now()}`,
      title: `Conquer ${weakArea} Mini-Boss Problem Set`,
      description: `Targeted remediation generated from rapid-fire performance in ${weakArea}.`,
      category: 'TECH SKILLS',
      xp: 120,
      energyCost: 15,
      timeMinutes: 30,
      difficulty: '★★★☆☆',
      difficultyLevel: 3,
      skillImpact: `${weakArea} Mastery +10`,
      careerImpact: '+3.0%',
      aiReasoning: 'Isolated as immediate weak point during rapid-fire battle.',
      completed: false,
    };
    setQuests((prev) => [newTargetedQuest, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-cyan-600/10 blur-[120px]"></div>
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]"></div>
        <div className="absolute bottom-10 left-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]"></div>
      </div>

      {/* Persistent Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4">
          <div className="rounded-2xl border border-cyan-500/50 bg-slate-900/95 px-5 py-3.5 shadow-2xl shadow-cyan-500/20 backdrop-blur-md flex items-center gap-3">
            <span className="text-2xl">{toastMessage.icon}</span>
            <div>
              <h5 className="font-extrabold text-white text-xs sm:text-sm">
                {toastMessage.title}
              </h5>
              <p className="text-[11px] text-slate-300">{toastMessage.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        player={player}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          sound.playClick();
          setActiveTab(tab);
        }}
        onRestoreEnergy={handleRestoreEnergy}
        onResetData={handleResetData}
        onStartJudgeDemo={() => {
          sound.playClick();
          setShowJudgeTour(true);
        }}
        todayXp={player.todayXp}
      />

      {/* Main Viewport Content Router */}
      <main className="relative z-10 pb-24">
        {activeTab === 'landing' && (
          <LandingHero
            onEnterApp={() => {
              sound.playClick();
              setActiveTab('command');
            }}
            onStartDemo={() => {
              sound.playClick();
              setActiveTab('command');
              setShowJudgeTour(true);
            }}
          />
        )}

        {activeTab === 'command' && (
          <CommandCenter
            player={player}
            stats={stats}
            quests={quests}
            todayXp={player.todayXp}
            onOpenQuest={(quest) => setActiveQuestModal(quest)}
            onCompleteQuest={handleCompleteQuest}
            onNavigateTab={(tab) => {
              sound.playClick();
              setActiveTab(tab);
            }}
            onRestoreEnergy={handleRestoreEnergy}
            onOpenGameMaster={() => setActiveTab('gamemaster')}
          />
        )}

        {activeTab === 'gamemaster' && (
          <AIGameMaster
            player={player}
            onAcceptPlan={handleAcceptPlan}
          />
        )}

        {activeTab === 'quests' && (
          <QuestBoard
            quests={quests}
            onOpenQuest={(quest) => setActiveQuestModal(quest)}
            onCompleteQuest={handleCompleteQuest}
            onOpenAiGameMaster={() => {
              sound.playClick();
              setActiveTab('gamemaster');
            }}
            onAddQuest={(newQ) => {
              setQuests((prev) => [newQ, ...prev]);
              showToast('⚔️ Custom Quest Created', newQ.title);
            }}
          />
        )}

        {activeTab === 'lectures' && (
          <VideoLectures
            lectures={lectures}
            onCompleteLecture={handleCompleteLecture}
            onAddCustomLecture={handleAddCustomLecture}
          />
        )}

        {activeTab === 'studyrooms' && (
          <GroupStudyRooms
            rooms={studyRooms}
            onAwardXp={(amount, reason) => {
              awardXp(amount, reason);
              showToast(`🛡️ Group Study XP (+${amount} XP)`, reason);
            }}
            onCreateRoom={handleCreateRoom}
          />
        )}

        {activeTab === 'bosses' && (
          <BossBattles
            bosses={bosses}
            onDefeatBoss={handleDefeatBoss}
            onStartRapidFire={(topic) => setRapidFireTopic(topic)}
            onGenerateCustomBoss={(name, type) => {
              showToast('🐉 Dynamic Boss Synthesized', name);
            }}
          />
        )}

        {activeTab === 'skilltree' && (
          <SkillTree
            skillNodes={skillNodes}
            onStartQuestFromSkill={(title) => {
              const matched = quests.find((q) => q.title.toLowerCase().includes(title.toLowerCase())) || {
                id: `skill-q-${Date.now()}`,
                title: title,
                description: 'Skill constellation directed mission.',
                category: 'TECH SKILLS' as any,
                xp: 140,
                energyCost: 15,
                timeMinutes: 35,
                difficulty: '★★★☆☆' as any,
                difficultyLevel: 3,
                skillImpact: 'Direct node mastery +12',
                careerImpact: '+4.0%',
                completed: false,
              };
              setActiveQuestModal(matched);
            }}
          />
        )}

        {activeTab === 'career' && (
          <CareerRadar
            player={player}
            onLaunchGapQuest={(gapQuest) => {
              setQuests((prev) => [gapQuest, ...prev]);
              setActiveQuestModal(gapQuest);
            }}
          />
        )}

        {activeTab === 'futureself' || activeTab === 'future' ? (
          <FutureSelf player={player} />
        ) : null}

        {activeTab === 'campus' && (
          <CampusWorld
            onAcceptCampusQuest={(q) => {
              setQuests((prev) => [q, ...prev]);
              showToast('🌍 Campus Quest Added', q.title);
              setActiveTab('quests');
            }}
          />
        )}

        {activeTab === 'money' && (
          <MoneyQuests
            onCompleteFinancialQuest={(xp, name) => {
              awardXp(xp, name);
              showToast(`💰 Financial Quest Logged (+${xp} XP)`, name);
            }}
          />
        )}

        {activeTab === 'squad' || activeTab === 'team' ? (
          <TeamMode
            onCompleteSquadQuest={(xp, title) => {
              awardXp(xp, title);
              showToast(`👥 Squad Deliverable Completed (+${xp} XP)`, title);
            }}
          />
        ) : null}

        {activeTab === 'achievements' && (
          <AchievementsHall achievements={achievements} />
        )}
      </main>

      {/* Active Quest Interactive Modal */}
      {activeQuestModal && (
        <ActiveQuestModal
          quest={activeQuestModal}
          onComplete={handleCompleteQuest}
          onClose={() => setActiveQuestModal(null)}
        />
      )}

      {/* Rapid Fire Quiz Arena Modal */}
      {rapidFireTopic && (
        <RapidFireArena
          initialTopic={rapidFireTopic}
          onFinishQuiz={handleFinishQuiz}
          onClose={() => setRapidFireTopic(null)}
        />
      )}

      {/* 3-Minute Judge Demo Tour Stepper */}
      {showJudgeTour && (
        <JudgeDemoTour
          onNavigateTab={(tab) => setActiveTab(tab)}
          onClose={() => setShowJudgeTour(false)}
        />
      )}
    </div>
  );
}

