import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e);
      return null;
    }
  }
  return aiClient;
}

// Utility: Clean Markdown code blocks and parse JSON safely
function cleanAndParseJson<T>(rawText: string | undefined | null, fallback: T): T {
  if (!rawText || typeof rawText !== "string") return fallback;
  try {
    let clean = rawText.trim();
    // Strip markdown code fences if present anywhere (```json ... ``` or ``` ...)
    if (clean.includes("```")) {
      clean = clean.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1").trim();
      clean = clean.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
    }
    // Attempt standard JSON parse
    const parsed = JSON.parse(clean);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch (err) {
    // Attempt regex extraction of first JSON object or array
    try {
      const match = rawText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (match) {
        const extracted = JSON.parse(match[0]);
        return extracted && typeof extracted === "object" ? extracted : fallback;
      }
    } catch (innerErr) {
      console.warn("Could not parse JSON from model output, utilizing dynamic fallback");
    }
    return fallback;
  }
}

// Dynamic fallback generator for Game Master based on prompt and stats
function generateDynamicGameMasterPlan(
  message: string = "",
  availableTimeMinutes: number = 120,
  targetCareer: string = "Software Engineer",
  playerStats?: any
) {
  const msgLower = (message || "").toLowerCase();
  const time = Number(availableTimeMinutes) || 120;
  const isExam = msgLower.includes("exam") || msgLower.includes("test") || msgLower.includes("os") || msgLower.includes("operating");
  const isLowEnergy = msgLower.includes("energy") || msgLower.includes("tired") || msgLower.includes("burnout") || msgLower.includes("rest");
  const isInterview = msgLower.includes("interview") || msgLower.includes("job") || msgLower.includes("resume") || msgLower.includes("hiring");
  const isDsa = msgLower.includes("dsa") || msgLower.includes("algorithm") || msgLower.includes("leetcode") || msgLower.includes("tree");

  let planTitle = `Tactical Strategy: ${targetCareer} Acceleration`;
  let reasoning = `Optimized for a ${time}-minute session. Addressing your primary career gap while balancing stamina.`;
  let quests: any[] = [];
  let estimatedXp = 350;
  let careerImpact = "HIGH (+4.2%)";
  let energyCost = 30;

  if (isLowEnergy) {
    planTitle = "Low-Friction Stamina Recovery & High-Retention Session";
    reasoning = "Because your energy is low today, we replaced heavy algorithmic grinding with active-recall quizzes and video lecture synthesis to keep your streak alive without burnout.";
    estimatedXp = 220;
    careerImpact = "BALANCED (+2.5%)";
    energyCost = 15;
    quests = [
      {
        id: `gm-low-1-${Date.now()}`,
        title: "Video Lecture Deep Dive: DSA Core Concepts",
        category: "TECH SKILLS",
        time: Math.min(30, Math.floor(time * 0.4)),
        xp: 100,
        difficulty: "★★☆☆☆",
        skillImpact: "DSA Intuition +8",
        reasoning: "Passive-to-active video learning provides maximum retention with low cognitive fatigue.",
      },
      {
        id: `gm-low-2-${Date.now()}`,
        title: "5-Minute Rapid-Fire Combat Blitz",
        category: "PERSONAL DEVELOPMENT",
        time: 15,
        xp: 70,
        difficulty: "★★☆☆☆",
        skillImpact: "Recall Speed +6",
        reasoning: "Quick multi-choice sparring to lock in memory without draining stamina.",
      },
      {
        id: `gm-low-3-${Date.now()}`,
        title: "Mindful Reflection & Power Rest",
        category: "PERSONAL DEVELOPMENT",
        time: 15,
        xp: 50,
        difficulty: "★☆☆☆☆",
        skillImpact: "Energy Recovery +25",
        reasoning: "Strategic rest ensures tomorrow's cognitive performance is 100%.",
      },
    ];
  } else if (isExam) {
    planTitle = "Boss Raid: OS Final Exam Blitz Campaign";
    reasoning = "Targeted countdown battle against Operating Systems: focusing on high-weight exam topics (Deadlocks, Process Scheduling, and Virtual Memory).";
    estimatedXp = 420;
    careerImpact = "CRITICAL (+6.0%)";
    energyCost = 40;
    quests = [
      {
        id: `gm-exam-1-${Date.now()}`,
        title: "CPU Scheduling & Banker's Algorithm Problem Set",
        category: "ACADEMIC",
        time: Math.floor(time * 0.45),
        xp: 180,
        difficulty: "★★★★☆",
        skillImpact: "OS Internals +14, Problem Solving +10",
        reasoning: "Guaranteed 25+ points on final exam paper. High ROI per minute spent.",
      },
      {
        id: `gm-exam-2-${Date.now()}`,
        title: "Virtual Memory Paging & TLB Hit Rate Past Papers",
        category: "ACADEMIC",
        time: Math.floor(time * 0.35),
        xp: 140,
        difficulty: "★★★☆☆",
        skillImpact: "Memory Systems +12",
        reasoning: "Frequent exam pitfall. Mastering Page Replacement Algorithms eliminates marks leakage.",
      },
      {
        id: `gm-exam-3-${Date.now()}`,
        title: "Mock Exam Simulation: Rapid Concept Combat",
        category: "ACADEMIC",
        time: Math.max(20, Math.floor(time * 0.2)),
        xp: 100,
        difficulty: "★★★☆☆",
        skillImpact: "Exam Readiness +15",
        reasoning: "Timed mock conditions calibrate stress tolerance before test day.",
      },
    ];
  } else if (isInterview || isDsa) {
    planTitle = "Elite Technical Interview & DSA Mastery Sprint";
    reasoning = "Directly targeting the #1 hiring criteria for software engineering: algorithmic problem solving and system design foundations.";
    estimatedXp = 450;
    careerImpact = "PEAK (+7.5%)";
    energyCost = 45;
    quests = [
      {
        id: `gm-dsa-1-${Date.now()}`,
        title: "Sliding Window & Two-Pointer Algorithm Gauntlet",
        category: "TECH SKILLS",
        time: Math.floor(time * 0.5),
        xp: 200,
        difficulty: "★★★★☆",
        skillImpact: "DSA +18, Code Fluency +10",
        reasoning: "DSA is currently your largest career gap (18%). Mastering these patterns converts to immediate interview passes.",
      },
      {
        id: `gm-dsa-2-${Date.now()}`,
        title: "Binary Tree Depth-First Search (DFS/BFS) Drills",
        category: "TECH SKILLS",
        time: Math.floor(time * 0.3),
        xp: 150,
        difficulty: "★★★★☆",
        skillImpact: "Data Structures +12",
        reasoning: "Tree traversals appear in over 70% of tech screen interviews.",
      },
      {
        id: `gm-dsa-3-${Date.now()}`,
        title: "STAR Behavioral Story Polish & Resume Metric Sync",
        category: "CAREER",
        time: Math.max(20, Math.floor(time * 0.2)),
        xp: 100,
        difficulty: "★★☆☆☆",
        skillImpact: "Communication +10",
        reasoning: "Articulate your technical victories with quantifiable impact metrics.",
      },
    ];
  } else {
    // Standard balanced plan
    quests = [
      {
        id: `gm-std-1-${Date.now()}`,
        title: "DBMS Assignment: 3NF Normalization & B+ Trees",
        category: "ACADEMIC",
        time: Math.floor(time * 0.4),
        xp: 150,
        difficulty: "★★★☆☆",
        skillImpact: "Database Management +12, SQL +8",
        reasoning: "Urgent academic deadline due tomorrow. Secures 150 XP and protects Academic Health.",
      },
      {
        id: `gm-std-2-${Date.now()}`,
        title: "Array & Two-Pointer Combat Challenge",
        category: "TECH SKILLS",
        time: Math.floor(time * 0.35),
        xp: 130,
        difficulty: "★★★★☆",
        skillImpact: "DSA +14, Problem Solving +8",
        reasoning: "Directly targets your lowest skill (DSA at 18%) for highest career readiness leap.",
      },
      {
        id: `gm-std-3-${Date.now()}`,
        title: "Rapid-Fire Knowledge Duel & Recovery",
        category: "PERSONAL DEVELOPMENT",
        time: Math.max(15, Math.floor(time * 0.25)),
        xp: 90,
        difficulty: "★★☆☆☆",
        skillImpact: "Recall Speed +6, Consistency +5",
        reasoning: "Locks in today's knowledge and leaves a buffer for physical/mental recovery.",
      },
    ];
  }

  return {
    planTitle,
    reasoning,
    estimatedXp,
    careerImpact,
    energyCost,
    quests,
  };
}

// 1. AI GAME MASTER: Plan optimization & Quest Recommendation
app.post("/api/gemini/game-master", async (req: Request, res: Response) => {
  const { message, playerStats, availableTimeMinutes, targetCareer } = req.body;
  const time = Number(availableTimeMinutes) || 120;
  const role = targetCareer || "Software Engineer";
  const fallback = generateDynamicGameMasterPlan(message, time, role, playerStats);

  try {
    const ai = getAI();
    if (!ai) {
      return res.json(fallback);
    }

    const prompt = `You are the NEXUS AI Game Master and strategic career/study coach for a student player.
Student Profile:
- Target Career: ${role}
- Available Time: ${time} minutes
- Current Level: ${playerStats?.level || 18}
- Lowest Skills: ${JSON.stringify(playerStats?.weakSkills || ["DSA: 18%", "Python: 32%"])}
- Academic Health: ${playerStats?.academicHealth || 78}%
- Energy: ${playerStats?.energy || 72}/100
- Student Request/Input: "${message || "I have limited time tonight, what should I do?"}"

Generate a personalized, RPG-themed Quest Plan for this session.
Rules:
1. Generate 2 to 4 structured, realistic actionable quests fitting their time (${time}m).
2. Target high-impact gaps (DSA, urgent assignments, career prep).
3. Output strict JSON with:
- planTitle: string
- reasoning: string
- estimatedXp: number
- careerImpact: string (e.g. "HIGH (+4.2%)")
- energyCost: number
- quests: array of objects { id: string, title: string, category: string, time: number, xp: number, difficulty: string, skillImpact: string, reasoning: string }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = cleanAndParseJson(response.text, fallback);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Game Master API using fallback due to:", error?.message || error);
    return res.json(fallback);
  }
});

// Dynamic fallback generator for Boss Battles
function generateDynamicBossFallback(challengeName: string = "Operating Systems Final Exam", challengeType: string = "EXAM", difficulty?: number) {
  const name = challengeName.trim() || "Operating Systems Final Exam";
  const type = challengeType || "EXAM";
  const nameLower = name.toLowerCase();

  let bossTitle = "Semester Final Boss";
  let bossPrefix = "Titan";
  let lore = `An intimidating adversary manifesting from ${name}. Its formidable defenses test your conceptual depth and problem-solving execution under pressure.`;
  let weaknesses = ["Core Fundamentals", "Speed Problem Solving", "Mock Battle Practice"];
  let weapons = [
    { name: `Concept Sprint: ${name} Core`, damage: 250, time: "25m", xp: 120, skill: `${name} Mastery +8`, used: false },
    { name: `High-Yield Past Problem Gauntlet`, damage: 300, time: "35m", xp: 150, skill: "Problem Solving +10", used: false },
    { name: `AI Rapid-Fire Combat Duel`, damage: 200, time: "15m", xp: 90, skill: "Recall Speed +7", used: false },
    { name: `Timed Mock Exam Simulation`, damage: 250, time: "40m", xp: 140, skill: "Exam Readiness +12", used: false },
  ];

  if (type === "CAREER" || nameLower.includes("interview") || nameLower.includes("sde") || nameLower.includes("faang") || nameLower.includes("placement")) {
    bossTitle = "Tech Screen Final Boss";
    bossPrefix = "Colossus";
    lore = `A ruthless technical screening entity simulating top-tier tech interview loops. It evaluates algorithmic precision, complexity analysis, and edge case resilience.`;
    weaknesses = ["Algorithmic Optimization", "Time & Space Complexity Proofs", "STAR Behavioral Clarity"];
    weapons = [
      { name: "Live DSA Whiteboard Gauntlet", damage: 300, time: "45m", xp: 180, skill: "DSA +16", used: false },
      { name: "System Design Blueprint Drill", damage: 250, time: "35m", xp: 140, skill: "System Architecture +12", used: false },
      { name: "Behavioral STAR Narrative Polish", damage: 200, time: "20m", xp: 100, skill: "Communication +10", used: false },
      { name: "Mock Pressure Coding Duel", damage: 250, time: "30m", xp: 130, skill: "Execution Speed +14", used: false },
    ];
  } else if (type === "HACKATHON" || nameLower.includes("hackathon") || nameLower.includes("capstone") || nameLower.includes("project")) {
    bossTitle = "Hackathon Judging Demon";
    bossPrefix = "Demon";
    lore = `A critical panel of judges demanding innovative architecture, production readiness, and an unforgettable demo pitch.`;
    weaknesses = ["Fullstack Integration", "Live Demo Reliability", "Compelling Value Pitch"];
    weapons = [
      { name: "Core Feature Sprint & API Hardening", damage: 350, time: "60m", xp: 200, skill: "Fullstack +18", used: false },
      { name: "UI/UX Micro-Interactions & Polish", damage: 200, time: "30m", xp: 110, skill: "Frontend Craft +10", used: false },
      { name: "Pitch Deck & Impact Metrics Drill", damage: 250, time: "25m", xp: 130, skill: "Storytelling +12", used: false },
      { name: "Demo Stress-Test & Failover Check", damage: 200, time: "20m", xp: 110, skill: "DevOps +8", used: false },
    ];
  } else if (nameLower.includes("os") || nameLower.includes("operating")) {
    bossTitle = "Semester OS Final Boss";
    bossPrefix = "Dragon";
    lore = "An ancient computational menace formed from convoluted deadlock states, paging thrashing, and thread race conditions.";
    weaknesses = ["Deadlock Prevention (Banker's Algorithm)", "CPU Scheduling Preemption", "Virtual Memory Page Replacement"];
    weapons = [
      { name: "Deadlock & Semaphore Mastery Sprint", damage: 250, time: "30m", xp: 130, skill: "OS Concurrency +10", used: false },
      { name: "CPU Scheduling Past Exam Papers", damage: 300, time: "40m", xp: 160, skill: "Scheduling Analysis +14", used: false },
      { name: "Virtual Memory Paging Drill", damage: 200, time: "20m", xp: 100, skill: "Memory Systems +8", used: false },
      { name: "OS Final Mock Simulation", damage: 250, time: "40m", xp: 140, skill: "Exam Readiness +15", used: false },
    ];
  }

  return {
    bossName: `${bossPrefix} of ${name}`,
    title: bossTitle,
    difficultyPercentage: difficulty || 84,
    totalHp: 1000,
    lore,
    weaknesses,
    prepWeapons: weapons,
    rewards: {
      xp: 500,
      skills: [{ skill: name, boost: 14 }, { skill: "Problem Solving", boost: 8 }],
      badge: `${name} Conqueror`,
    },
  };
}

// 2. BOSS BATTLE GENERATOR
app.post("/api/gemini/boss-generator", async (req: Request, res: Response) => {
  const { challengeName, challengeType, daysRemaining, difficulty, playerSkill } = req.body;
  const name = challengeName || "Operating Systems Final Exam";
  const fallback = generateDynamicBossFallback(name, challengeType, difficulty);

  try {
    const ai = getAI();
    if (!ai) return res.json(fallback);

    const prompt = `Convert the following student challenge into an epic RPG Boss Battle.
Challenge: "${name}"
Type: ${challengeType || "EXAM"}
Days Remaining: ${daysRemaining || 4}
Student current skill level: ${playerSkill || "Intermediate"}

Output strict JSON with:
- bossName: string
- title: string
- difficultyPercentage: number (0-100)
- totalHp: number (e.g. 1000)
- lore: string
- weaknesses: array of 3 strings
- prepWeapons: array of 4 objects { name: string, damage: number, time: string, xp: number, skill: string }
- rewards: { xp: number, skills: array of { skill: string, boost: number }, badge: string }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = cleanAndParseJson(response.text, fallback);
    if (!parsed || !Array.isArray(parsed.prepWeapons) || parsed.prepWeapons.length === 0) {
      return res.json({
        ...fallback,
        ...parsed,
        prepWeapons: fallback.prepWeapons,
        bossName: parsed?.bossName || fallback.bossName,
      });
    }
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Boss generator using fallback due to:", error?.message || error);
    return res.json(fallback);
  }
});

// 3. RAPID-FIRE COMBAT QUIZ
app.post("/api/gemini/rapid-fire", async (req: Request, res: Response) => {
  const { topic, difficulty, count } = req.body;
  const currentTopic = topic || "Data Structures & Algorithms";

  const fallback = {
    topic: currentTopic,
    questions: [
      {
        id: 1,
        question: "What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIndex: 1,
        explanation: "In a balanced BST, tree height is log n, halving search space each step.",
        damage: 100,
        xp: 20,
      },
      {
        id: 2,
        question: "Which data structure follows the Last-In-First-Out (LIFO) principle and is used in function call stacks?",
        options: ["Queue", "Stack", "Priority Queue", "Linked List"],
        correctIndex: 1,
        explanation: "Stacks operate on LIFO, making them ideal for recursion and undo buffers.",
        damage: 100,
        xp: 20,
      },
      {
        id: 3,
        question: "When detecting a cycle in a linked list in O(1) auxiliary space, which technique is most optimal?",
        options: ["Hash Set memoization", "Floyd's Tortoise and Hare (Two Pointers)", "Dijkstra's Search", "Bubble Swap"],
        correctIndex: 1,
        explanation: "Floyd's algorithm uses fast and slow pointers requiring zero extra heap memory.",
        damage: 100,
        xp: 20,
      },
      {
        id: 4,
        question: "What is the worst-case time complexity of QuickSort when a naive pivot is chosen on an already sorted array?",
        options: ["O(n log n)", "O(log n)", "O(n^2)", "O(n)"],
        correctIndex: 2,
        explanation: "Without randomized or median-of-three pivots, naive QuickSort degrades to O(n^2).",
        damage: 100,
        xp: 20,
      },
      {
        id: 5,
        question: "Which data structure is primarily used to implement Breadth-First Search (BFS)?",
        options: ["Stack", "Queue", "Max Heap", "Binary Tree"],
        correctIndex: 1,
        explanation: "BFS explores nodes level-by-level using a FIFO Queue.",
        damage: 100,
        xp: 20,
      },
    ],
  };

  try {
    const ai = getAI();
    if (!ai) return res.json(fallback);

    const prompt = `Generate ${count || 5} rapid-fire multiple choice combat questions for an RPG battle quiz.
Topic: "${currentTopic}"
Difficulty: ${difficulty || "Medium"}

Output strict JSON with:
- topic: string
- questions: array of objects {
    id: number,
    question: string,
    options: array of 4 strings,
    correctIndex: number (0-3),
    explanation: string,
    damage: number,
    xp: number
  }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = cleanAndParseJson(response.text, fallback);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Rapid Fire using fallback due to:", error?.message || error);
    return res.json(fallback);
  }
});

// 4. FUTURE SELF SIMULATOR
app.post("/api/gemini/future-self", async (req: Request, res: Response) => {
  const { playerStats, targetCareer } = req.body;
  const role = targetCareer || "Software Engineer";

  const fallback = {
    disclaimer: "Hypothetical AI-generated scenario projections based on learning trajectory patterns. Not a guaranteed outcome.",
    currentSnapshot: {
      careerReadiness: playerStats?.careerReadiness || 47,
      level: playerStats?.level || 18,
      weeklyXp: 1850,
      topWeakness: "DSA & System Design",
    },
    paths: {
      keepGoing: {
        title: "Keep Going (Baseline)",
        emoji: "😐",
        summary: "Continuing current ad-hoc study patterns without structured gap prioritization.",
        timeline: [
          { period: "Today", readiness: 47, level: 18, milestone: "Basic script knowledge, inconsistent leetcode." },
          { period: "7 Days", readiness: 48, level: 18, milestone: "DBMS assignment submitted, DSA gap remains 18%." },
          { period: "30 Days", readiness: 50, level: 19, milestone: "Passed OS exam with average marks, minimal portfolio additions." },
          { period: "90 Days", readiness: 53, level: 20, milestone: "Struggles with live coding interviews due to lack of mock pressure." },
          { period: "6 Months", readiness: 56, level: 22, milestone: "Explorer class. Applying broadly but facing resume screening hurdles." },
        ],
      },
      levelUp: {
        title: "Level Up (AI Recommended)",
        emoji: "🔥",
        summary: "Completing daily high-impact quests, targeting largest skill gaps, maintaining 6-day consistency with recovery.",
        timeline: [
          { period: "Today", readiness: 47, level: 18, milestone: "Initiates Array Boss battle & addresses 45m DBMS task." },
          { period: "7 Days", readiness: 55, level: 19, milestone: "DSA jumps from 18% to 34%. Completed 2 mini-boss battles." },
          { period: "30 Days", readiness: 68, level: 22, milestone: "Project Builder unlocked! Built fullstack AI expense tracker portfolio piece." },
          { period: "90 Days", readiness: 81, level: 28, milestone: "Interview Ready! Cleared 15 mock rounds with 88% DSA pass rate." },
          { period: "6 Months", readiness: 92, level: 35, milestone: "Industry Ready. Multiple internship offers & robust GitHub portfolio." },
        ],
      },
      beastMode: {
        title: "Beast Mode (Aggressive Focus)",
        emoji: "🚀",
        summary: "Maximum disciplined campaign: Hackathon victories, open-source PRs, and daily algorithm mastery.",
        timeline: [
          { period: "Today", readiness: 47, level: 18, milestone: "Completes 3 daily quests + DSA boss prep in 90m session." },
          { period: "7 Days", readiness: 61, level: 20, milestone: "Won campus hackathon with Team Phoenix. DSA surges to 45%." },
          { period: "30 Days", readiness: 76, level: 26, milestone: "Deploys 2 fullstack cloud apps. System design level 12 -> 45%." },
          { period: "90 Days", readiness: 89, level: 34, milestone: "Top 5% candidate in campus placement drives. 5+ technical referrals." },
          { period: "6 Months", readiness: 97, level: 42, milestone: "Fullstack Architect tier. Leading team projects & mentorship." },
        ],
      },
    },
  };

  try {
    const ai = getAI();
    if (!ai) return res.json(fallback);

    const prompt = `Generate a Future Self RPG projection simulation for a student.
Student Stats:
- Target Career: ${role}
- Current Level: ${playerStats?.level || 18}
- Current Career Readiness: ${playerStats?.careerReadiness || 47}%
- Weaknesses: ${JSON.stringify(playerStats?.weakSkills || ["DSA 18%", "System Design 12%"])}

Simulate 3 hypothetical paths:
1. "keepGoing" (😐 Continue current baseline behavior)
2. "levelUp" (🔥 Follow AI daily strategic quests & address weak spots)
3. "beastMode" (🚀 Aggressive but realistic improvement plan with hackathons & projects)

For each path, simulate 5 timeline steps: "Today", "7 Days", "30 Days", "90 Days", "6 Months".
Include readiness percentage, projected level, and milestone.
Output strict JSON with:
- disclaimer (string)
- currentSnapshot: { careerReadiness, level, weeklyXp, topWeakness }
- paths: { keepGoing: { title, emoji, summary, timeline: [...] }, levelUp: { title, emoji, summary, timeline: [...] }, beastMode: { title, emoji, summary, timeline: [...] } }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = cleanAndParseJson(response.text, fallback);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Future Self using fallback due to:", error?.message || error);
    return res.json(fallback);
  }
});

// 5. RESUME & JOB DESCRIPTION TO QUEST CONVERTER
app.post("/api/gemini/resume-analyzer", async (req: Request, res: Response) => {
  const { resumeText, targetRole } = req.body;
  const role = targetRole || "Software Engineer";

  const fallback = {
    targetRole: role,
    careerReadinessScore: 54,
    strengths: ["Clean Python syntax familiarity", "Basic Git commit workflow", "Relational database queries (SQL 67%)"],
    gaps: ["No production cloud-deployed projects", "DSA coverage missing graph/tree algorithms", "Zero unit testing experience"],
    generatedQuests: [
      {
        id: `rq-1-${Date.now()}`,
        title: "Build Cloud-Deployed Fullstack Microservice",
        category: "TECH SKILLS",
        xp: 400,
        difficulty: "★★★★☆",
        time: "2-3 hrs",
        careerImpact: "HIGH (+7.5%)",
        description: "Build and deploy a REST API with authentication and Dockerized backend.",
        reasoning: "Your resume lists skills but lacks a verifiable cloud-hosted project URL.",
      },
      {
        id: `rq-2-${Date.now()}`,
        title: "Master Binary Tree & Graph BFS/DFS Patterns",
        category: "TECH SKILLS",
        xp: 220,
        difficulty: "★★★★☆",
        time: "60 min",
        careerImpact: "HIGH (+5.0%)",
        description: "Solve 4 classic interview problems using traversal techniques.",
        reasoning: "Technical screening for this role heavily weights algorithmic problem solving.",
      },
      {
        id: `rq-3-${Date.now()}`,
        title: "Draft STAR-Format Engineering Impact Bullets",
        category: "CAREER",
        xp: 150,
        difficulty: "★★☆☆☆",
        time: "30 min",
        careerImpact: "MEDIUM (+3.0%)",
        description: "Rewrite generic project descriptions into quantifiable impact statements.",
        reasoning: "Recruiters look for numbers (e.g. 'reduced latency by 35%').",
      },
    ],
  };

  try {
    const ai = getAI();
    if (!ai) return res.json(fallback);

    const prompt = `Analyze this student's resume/profile text against their target role: "${role}".
Resume Text:
"""${resumeText || "3rd year CS student. Knowledge of Python, HTML, basic SQL. Completed academic assignments."}"""

Perform an in-depth Career Gap & Quest Generation analysis:
1. Estimate careerReadinessScore (0-100)
2. List 3 key strengths
3. List 3 critical skill/project gaps
4. Generate 3 high-impact RPG Quests with { id, title, category, xp, difficulty, time, careerImpact, description, reasoning }

Output strict JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = cleanAndParseJson(response.text, fallback);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Resume Analyzer using fallback due to:", error?.message || error);
    return res.json(fallback);
  }
});

// 6. ANTI-XP FARMING AI DETECTOR
app.post("/api/gemini/anti-farming", (req: Request, res: Response) => {
  const { recentQuestsCompleted, studentLevel } = req.body;
  const easyCount = Array.isArray(recentQuestsCompleted) 
    ? recentQuestsCompleted.filter((q: any) => q.difficulty === "★☆☆☆☆" || q.difficulty === "★★☆☆☆" || q.xp < 100).length
    : 0;

  if (easyCount >= 3) {
    return res.json({
      isFarming: true,
      alertMessage: "⚠️ XP FARMING DETECTED",
      explanation: `You've been completing easy missions repeatedly. While your XP is climbing, your core skills (DSA, System Design) are not growing at the required pace for level ${studentLevel || 18}.`,
      recommendedQuest: {
        id: `high-impact-${Date.now()}`,
        title: "Dynamic Programming Boss Challenge",
        difficulty: "★★★★☆",
        xp: 250,
        skillImpact: "DSA +16, Problem Solving +10",
        careerImpact: "+5.2%",
        reasoning: "High-impact quest with actual career skill multiplier instead of repetitive points.",
      },
    });
  }

  return res.json({
    isFarming: false,
    message: "Growth trajectory balanced! Keep tackling high-impact missions.",
  });
});

// Serve frontend in dev and prod
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`NEXUS RPG Server running in dev mode on http://0.0.0.0:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NEXUS RPG Server running in prod mode on http://0.0.0.0:${PORT}`);
  });
}

