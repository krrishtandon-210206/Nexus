import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Fallback heuristics will be used.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. AI GAME MASTER: Plan optimization
app.post("/api/gemini/game-master", async (req: Request, res: Response) => {
  try {
    const { message, playerStats, availableTimeMinutes, targetCareer } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        planTitle: "AI Game Master Tactical Plan",
        reasoning: "Based on your available time and current career target (" + (targetCareer || "Software Engineer") + "), we prioritized addressing your DSA gap and tomorrow's assignment.",
        estimatedXp: 370,
        careerImpact: "HIGH (+3.5%)",
        energyCost: 35,
        quests: [
          {
            id: "qm-1",
            title: "DBMS Assignment Sprint",
            category: "ACADEMIC",
            time: 45,
            xp: 150,
            difficulty: "★★★☆☆",
            skillImpact: "Database Management +10, SQL +6",
            reasoning: "Urgent academic deadline due tomorrow. Secures 150 XP and protects academic health.",
          },
          {
            id: "qm-2",
            title: "Array & Two-Pointer Combat Challenge",
            category: "TECH SKILLS",
            time: 30,
            xp: 120,
            difficulty: "★★★★☆",
            skillImpact: "DSA +14, Problem Solving +8",
            reasoning: "Directly targets your lowest skill (DSA at 18%) for highest career readiness leap.",
          },
          {
            id: "qm-3",
            title: "Quick Rapid-Fire Quiz & Recovery",
            category: "PERSONAL DEVELOPMENT",
            time: 30,
            xp: 100,
            difficulty: "★★☆☆☆",
            skillImpact: "Consistency +5, Recall Speed +6",
            reasoning: "Consolidates memory and leaves 15 minutes for mental recovery.",
          },
        ],
      });
    }

    const prompt = `You are the NEXUS AI Game Master and strategic career/study coach for a student player.
Student Profile:
- Target Career: ${targetCareer || "Software Engineer"}
- Available Time: ${availableTimeMinutes || 120} minutes
- Current Level: ${playerStats?.level || 18}
- Lowest Skills: ${JSON.stringify(playerStats?.weakSkills || ["DSA: 18%", "Python: 32%"])}
- Academic Health: ${playerStats?.academicHealth || 78}%
- Energy: ${playerStats?.energy || 72}/100
- Student Request/Input: "${message || "I have limited time tonight, what should I do?"}"

Generate a personalized, RPG-themed Quest Plan for this session.
Rules:
1. Do NOT give generic advice. Generate 2 to 4 structured, realistic actionable quests fitting their time.
2. Target high-impact gaps (DSA, urgent assignments, career prep).
3. Include an energy balance or recovery if needed.
4. Output strict JSON with:
- planTitle (string)
- reasoning (string explaining WHY these were chosen)
- estimatedXp (number)
- careerImpact (string, e.g. "HIGH (+4.2%)")
- energyCost (number)
- quests: array of objects with { id, title, category, time, xp, difficulty, skillImpact, reasoning }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Game Master API Error:", error);
    res.status(500).json({ error: "Failed to generate plan from AI Game Master" });
  }
});

// 2. BOSS BATTLE GENERATOR
app.post("/api/gemini/boss-generator", async (req: Request, res: Response) => {
  try {
    const { challengeName, challengeType, daysRemaining, difficulty, playerSkill } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        bossName: challengeName ? `Titan of ${challengeName}` : "Dragon of Operating Systems",
        title: "Semester Final Boss",
        difficultyPercentage: difficulty || 82,
        totalHp: 1000,
        lore: "An ancient computational menace formed from convoluted deadlock states and thread race conditions.",
        weaknesses: ["Deadlock Prevention", "Process Scheduling Algorithms", "Virtual Memory Paging"],
        prepWeapons: [
          { name: "Concept Quest: CPU Scheduling", damage: 250, time: "25m", xp: 120, skill: "OS Internals +8" },
          { name: "Memory Management Past Papers", damage: 300, time: "35m", xp: 150, skill: "Problem Solving +10" },
          { name: "AI Rapid-Fire Battle", damage: 200, time: "15m", xp: 90, skill: "Recall Speed +7" },
          { name: "Mock Exam Simulation", damage: 250, time: "40m", xp: 140, skill: "Exam Readiness +12" },
        ],
        rewards: {
          xp: 500,
          skills: [{ skill: challengeName || "Operating Systems", boost: 12 }, { skill: "Problem Solving", boost: 8 }],
          badge: "Dragon Slayer",
        },
      });
    }

    const prompt = `Convert the following student challenge into an epic RPG Boss Battle.
Challenge: "${challengeName || "Operating Systems Final Exam"}"
Type: ${challengeType || "EXAM"}
Days Remaining: ${daysRemaining || 4}
Student current skill level: ${playerSkill || "Intermediate"}

Output strict JSON with:
- bossName: string (e.g. "Dragon of Operating Systems", "Titan of System Design")
- title: string (e.g. "Final Semester Boss")
- difficultyPercentage: number (0-100)
- totalHp: number (e.g. 1000)
- lore: string (short 2-sentence RPG description)
- weaknesses: array of 3 strings (specific topics/sub-skills that weaken the boss)
- prepWeapons: array of 4 objects { name: string, damage: number, time: string, xp: number, skill: string }
- rewards: { xp: number, skills: array of { skill: string, boost: number }, badge: string }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Boss Generator API Error:", error);
    res.status(500).json({ error: "Failed to generate boss battle" });
  }
});

// 3. RAPID-FIRE COMBAT QUIZ
app.post("/api/gemini/rapid-fire", async (req: Request, res: Response) => {
  try {
    const { topic, difficulty, count } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        topic: topic || "Data Structures & Algorithms",
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
            question: "When detecting a cycle in a linked list in O(1) space, which technique is most optimal?",
            options: ["Hash Set memoization", "Floyd's Tortoise and Hare (Two Pointers)", "Dijkstra's Search", "Bubble Swap"],
            correctIndex: 1,
            explanation: "Floyd's algorithm uses fast and slow pointers requiring zero extra heap memory.",
            damage: 100,
            xp: 20,
          },
          {
            id: 4,
            question: "What is the worst-case time complexity of QuickSort when a naive pivot is chosen on a sorted array?",
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
      });
    }

    const prompt = `Generate ${count || 5} rapid-fire multiple choice combat questions for an RPG battle quiz.
Topic: "${topic || "Data Structures & Algorithms"}"
Difficulty: ${difficulty || "Medium"}

Output strict JSON with:
- topic: string
- questions: array of objects {
    id: number,
    question: string,
    options: array of 4 strings,
    correctIndex: number (0-3),
    explanation: string (concise 1-sentence explanation),
    damage: number (e.g. 100),
    xp: number (e.g. 20)
  }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Rapid Fire API Error:", error);
    res.status(500).json({ error: "Failed to generate rapid fire questions" });
  }
});

// 4. FUTURE SELF SIMULATOR
app.post("/api/gemini/future-self", async (req: Request, res: Response) => {
  try {
    const { playerStats, targetCareer } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        disclaimer: "Hypothetical AI-generated scenario projections based on learning trajectory patterns. Not a guaranteed outcome.",
        currentSnapshot: {
          careerReadiness: 47,
          level: 18,
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
      });
    }

    const prompt = `Generate a Future Self RPG projection simulation for a student.
Student Stats:
- Target Career: ${targetCareer || "Software Engineer"}
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
- disclaimer (string explicitly stating these are hypothetical AI scenarios, not guaranteed predictions)
- currentSnapshot: { careerReadiness, level, weeklyXp, topWeakness }
- paths: { keepGoing: { title, emoji, summary, timeline: [...] }, levelUp: { title, emoji, summary, timeline: [...] }, beastMode: { title, emoji, summary, timeline: [...] } }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Future Self API Error:", error);
    res.status(500).json({ error: "Failed to simulate future self" });
  }
});

// 5. RESUME & JOB DESCRIPTION TO QUEST CONVERTER
app.post("/api/gemini/resume-analyzer", async (req: Request, res: Response) => {
  try {
    const { resumeText, targetRole } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        targetRole: targetRole || "Software Engineer",
        careerReadinessScore: 52,
        strengths: ["Clean Python syntax familiarity", "Basic Git commit workflow", "Relational database queries (SQL 67%)"],
        gaps: ["No production cloud-deployed projects", "DSA coverage missing graph/tree algorithms", "Zero unit testing experience"],
        generatedQuests: [
          {
            id: "rq-1",
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
            id: "rq-2",
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
            id: "rq-3",
            title: "Draft STAR-Format Engineering Impact Resume Bullets",
            category: "CAREER",
            xp: 150,
            difficulty: "★★☆☆☆",
            time: "30 min",
            careerImpact: "MEDIUM (+3.0%)",
            description: "Rewrite generic project descriptions into quantifiable impact statements.",
            reasoning: "Recruiters look for numbers (e.g. 'reduced latency by 35%').",
          },
        ],
      });
    }

    const prompt = `Analyze this student's resume/profile text against their target role: "${targetRole || "Software Engineer"}".
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

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Resume Analyzer API Error:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

// 6. ANTI-XP FARMING AI DETECTOR
app.post("/api/gemini/anti-farming", (req: Request, res: Response) => {
  const { recentQuestsCompleted, currentXp, studentLevel } = req.body;
  // Check if user completed 3+ easy low-effort quests in a row
  const easyCount = Array.isArray(recentQuestsCompleted) 
    ? recentQuestsCompleted.filter((q: any) => q.difficulty === "★☆☆☆☆" || q.difficulty === "★★☆☆☆" || q.xp < 100).length
    : 0;

  if (easyCount >= 3) {
    return res.json({
      isFarming: true,
      alertMessage: "⚠️ XP FARMING DETECTED",
      explanation: "You've been completing easy missions repeatedly. While your XP is climbing, your core skills (DSA, System Design) are not growing at the required pace for level " + (studentLevel || 18) + ".",
      recommendedQuest: {
        id: "high-impact-1",
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
