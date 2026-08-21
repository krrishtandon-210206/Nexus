export type QuestCategory = 
  | 'ACADEMIC' 
  | 'TECH SKILLS' 
  | 'CAREER' 
  | 'PERSONAL DEVELOPMENT' 
  | 'FINANCIAL' 
  | 'CAMPUS' 
  | 'SOCIAL';

export interface QuestStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  xp: number;
  energyCost: number;
  timeMinutes: number;
  difficulty: string; // e.g. '★★★☆☆'
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  skillImpact: string;
  careerImpact: string;
  deadline?: string;
  aiReasoning: string;
  completed: boolean;
  active?: boolean;
  steps?: QuestStep[];
}

export interface PlayerStat {
  id: string;
  name: string;
  emoji: string;
  level: number;
  xp: number;
  maxXp: number;
  progressPercent: number;
  recentImprovement: string;
  recommendedQuest: string;
  category: string;
}

export interface BossWeapon {
  name: string;
  damage: number;
  time: string;
  xp: number;
  skill: string;
  used?: boolean;
}

export interface BossBattle {
  id: string;
  bossName: string;
  title: string;
  challengeType: 'EXAM' | 'DEADLINE' | 'CAREER' | 'HACKATHON' | 'ALGORITHM';
  difficultyPercentage: number;
  currentHp: number;
  maxHp: number;
  lore: string;
  weaknesses: string[];
  prepWeapons: BossWeapon[];
  rewards: {
    xp: number;
    skills: { skill: string; boost: number }[];
    badge: string;
  };
  defeated: boolean;
}

export interface SkillNode {
  id: string;
  name: string;
  category: 'TECHNICAL' | 'ACADEMIC' | 'COMMUNICATION' | 'CAREER' | 'FINANCIAL' | 'PRODUCTIVITY';
  levelPercent: number;
  xp: number;
  maxXp: number;
  unlocked: boolean;
  prerequisites: string[];
  recommendedQuest: string;
  tier: number;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: string;
  xpReward: number;
}

export interface SquadMember {
  name: string;
  role: string;
  avatar: string;
  xpContributed: number;
  status: string;
}

export interface Squad {
  name: string;
  mission: string;
  teamXp: number;
  targetXp: number;
  members: SquadMember[];
}

export interface FinancialBudget {
  monthlyBudget: number;
  spent: number;
  currency: string;
  categories: { name: string; amount: number; color: string }[];
  emergencyFundMonths: number;
  savingsGoal: number;
  currentSavings: number;
}

export interface PlayerProfile {
  name: string;
  degree: string;
  year: string;
  targetCareer: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  streakDaysList: boolean[]; // 7 days (Mon-Sun)
  careerReadiness: number;
  academicHealth: number;
  productivity: number;
  financialHealth: number;
  energy: number;
  maxEnergy: number;
  currentClass: string;
  nextEvolution: string;
  weakSkills: string[];
  upcomingChallenges: {
    title: string;
    timeline: string;
    type: string;
    urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
}

export interface FutureSelfTimelineItem {
  period: string;
  readiness: number;
  level: number;
  milestone: string;
}

export interface FutureSelfPath {
  title: string;
  emoji: string;
  summary: string;
  timeline: FutureSelfTimelineItem[];
}

export interface RapidFireQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  damage: number;
  xp: number;
}
