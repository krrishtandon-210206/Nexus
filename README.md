# ⚔️ NEXUS RPG: Turn Your Student Life Into a Game

> **"Build the future you."**
> A hackathon-winning, production-grade AI-powered Student Life Operating System that converts real-world academic coursework, skill mastery, career preparation, and personal stamina into an immersive RPG progression framework.

🎮 **Live Demo:** [https://nexus-rpg.ai.studio](https://nexus-rpg.ai.studio)

---

## 🌟 Core Concept & Product Loop

NEXUS RPG replaces superficial gamification and disconnected chatbots with a unified, game-native interface where real student achievements fuel character evolution:

```
ASSESS → PLAN → QUEST → COMPLETE → EARN XP → UNLOCK SKILLS → DEFEAT BOSSES → LEVEL UP → CAREER READINESS
```

Every real assignment submitted, algorithm mastered, technical interview practiced, and free video lecture synthesized directly levels up your character, unlocks new nodes on the **Skill Tree**, and defeats looming semester **Boss Battles**.

---

## 🚀 Key Features & Systems

### 1. 🤖 AI Game Master & Tactical Recommender
* **Strategic Session Optimization**: Calculates your available time budget (e.g. 30m, 60m, 120m) and energy levels to recommend high-impact quests.
* **Contextual Gap Targeting**: Automatically detects your lowest-rated skills (e.g., Data Structures & Algorithms at 18%) and urgent deadlines, generating custom actionable missions with verified XP yields.
* **Resilient Model Integration**: Powered by Google Gemini 2.5/Flash with zero-latency contextual fallback heuristics to ensure continuous availability.

### 2. 📺 Free Video Lectures with Interactive Previews
* **Curated Tech & CS Curriculum**: Hand-picked, high-yield YouTube video lectures covering:
  - Data Structures & Algorithms (Binary Trees, Graphs, Sorting)
  - Operating Systems (Deadlocks, CPU Scheduling, Virtual Memory)
  - Database Management Systems (SQL Normalization, Indexing)
  - Fullstack Cloud Development & System Design
* **Embedded YouTube Video Player**: High-definition player with timestamps, key takeaway bullets, and instant "Mark as Mastered (+XP)" completion mechanics.
* **Custom Video Importer**: Paste any YouTube video URL or ID to generate a quest and add it to your curriculum.

### 3. 🛡️ Online Group Study Rooms & Co-Working Parties
* **Multiplayer Accountability**: Join or create custom study guilds (e.g., *DSA Grinders*, *OS Exam Survivors*, *Web3 Builders*).
* **Live Study Pomodoro Timer**: Synchronized 25m Focus / 5m Rest intervals with audio notifications.
* **Party Member Status & Audio Cues**: See peers actively studying in real-time, share tactical study notes, and earn cooperative XP bonuses upon timer completion.

### 4. 🐉 Boss Battles & Rapid-Fire Combat Arena
* **Academic Bosses**: Convert terrifying semester exams and final projects into colossal bosses (e.g. *Titan of Operating Systems*, *Dragon of Distributed Systems*).
* **Targeted Boss Prep Weapons**: Execute specific prep quests (Past Papers, Concept Drills) to chip away at the Boss HP.
* **Rapid-Fire Quiz Arena**: Fast-paced, timed multiple-choice combat duels that isolate weak areas and instantly generate remedial follow-up quests.

### 5. 🎯 Career Radar & Resume Quest Synthesizer
* **Gap Analysis**: Paste any resume or target job description to compute a Career Readiness Score (0–100%).
* **Actionable Quest Conversion**: Transforms missing skills and resume gaps into tangible RPG missions with estimated impact metrics.

### 6. 🔮 Future Self Simulator
* **Probabilistic Trajectory Forecasting**: Compares 3 hypothetical future outcomes (*Keep Going*, *Level Up*, *Beast Mode*) at 7-day, 30-day, 90-day, and 6-month horizons based on current study habits.

### 7. ⚖️ Anti-XP Farming Protection
* **Skill Multipliers**: Prevents students from inflating levels with low-effort tasks by detecting repetitive easy quests and redirecting energy toward high-yield algorithmic challenges.

---

## 🛠️ Architecture & Tech Stack

* **Frontend**: React 18+ with TypeScript, Tailwind CSS, Lucide Icons, and Motion animations.
* **Backend**: Express 4+ server running on Node.js / tsx.
* **AI Intelligence**: `@google/genai` TypeScript SDK interfacing with Gemini 2.5 models for dynamic Game Master plans, boss generation, quiz duels, and resume parsing.
* **Audio & Visual Effects**: Web Audio API synthesizer for retro 8-bit sound effects (level up, sword swings, boss hits, quest completions) and Canvas Confetti celebration particle systems.

---

## 💻 Getting Started & Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# 1. Clone the repository
git clone <repo-url>
cd nexus-rpg

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example to .env and add your Gemini API key (optional; intelligent fallbacks provided)
cp .env.example .env
```

### Running in Development
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### Building for Production
```bash
npm run build
npm run start
```

---

## ⚙️ Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for dynamic AI Game Master reasoning, boss generation, and resume analysis. | Optional (Heuristic fallback active when key is absent) |

---

## 🏆 Hackathon Judges' Quick Tour

Experience the live app at [https://nexus-rpg.ai.studio](https://nexus-rpg.ai.studio) or click the **"JUDGES QUICK TOUR"** button in the top navigation banner to test-drive all 8 core mechanics in one seamless interactive showcase:
1. **Command Center**: View Character Vitals, Energy Reserves, and Today's Agenda.
2. **AI Game Master**: Request an instant personalized quest strategy based on your time constraints.
3. **Quest Board**: Execute high-impact coursework tasks.
4. **Video Lectures**: Watch embedded YouTube CS tutorials and claim XP.
5. **Group Study Rooms**: Start a Pomodoro co-study sprint with your squad.
6. **Boss Battles**: Deal damage to semester final exams.
7. **Skill Tree**: Unlock hexagonal skill constellations.
8. **Career Radar**: Analyze resume readiness and simulate your Future Self.

---

*Built with ❤️ for students worldwide.*
