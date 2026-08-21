# ⚔️ NEXUS RPG: Turn Your Student Life Into a Game

> **"Build the future you."**
> NEXUS RPG is a student productivity and progression system that turns coursework, skill development, exam preparation, and career goals into an interactive RPG experience.

🎮 **Live Demo:** https://nexus-rpg.ai.studio

---

## 🌟 Core Concept & Product Loop

NEXUS RPG treats student life like a progression-based game.

Instead of managing assignments, exams, skills, and career preparation across disconnected tools, students get a single system where real-world progress drives their character progression.

```text
ASSESS → PLAN → QUEST → COMPLETE → EARN XP → UNLOCK SKILLS → DEFEAT BOSSES → LEVEL UP
```

Every completed assignment, mastered concept, solved problem, study session, and interview preparation task contributes to the student's progression.

The goal isn't to make studying feel like a game for its own sake.

The goal is to make **long-term progress visible, structured, and motivating.**

---

# 🚀 Key Features & Systems

## 1. 🎯 Quest Planner & Tactical Recommendations

NEXUS converts a student's workload into actionable quests.

* Select how much time is available: **30m, 60m, 120m**
* Consider current energy and workload
* Prioritize tasks based on deadlines and importance
* Identify neglected skills
* Break large academic goals into smaller missions
* Assign XP based on difficulty and impact

For example:

> **You have 60 minutes + low energy + DSA exam approaching**

The system can prioritize:

```text
Quest 1 → Revise Binary Trees       +40 XP
Quest 2 → Solve 3 Tree Problems     +60 XP
Quest 3 → Review Mistakes           +30 XP
```

The recommendation engine primarily uses structured rules, deadlines, priorities, and skill data.

An optional AI layer can improve personalization when available.

---

## 2. 📺 Free Video Learning

Turn existing educational content into RPG quests.

NEXUS provides curated technical learning resources covering areas such as:

* Data Structures & Algorithms
* Operating Systems
* Database Management Systems
* Computer Networks
* System Design
* Full-Stack Development
* Cloud Development

Each learning resource can become a quest:

```text
WATCH → LEARN → COMPLETE → MARK MASTERED → EARN XP
```

Features include:

* Embedded YouTube player
* Key takeaways
* Timestamps
* Progress tracking
* Mastery tracking
* XP rewards

### Custom Video Import

Students can also paste a YouTube URL and convert the resource into a learning quest.

---

## 3. 🛡️ Group Study Rooms

Studying becomes more effective when there is accountability.

Students can create or join study groups such as:

* DSA Grinders
* OS Exam Survivors
* Web Development Guild
* Competitive Programming Squad

### Focus Sessions

Built-in Pomodoro sessions provide:

```text
25 MIN FOCUS
      ↓
5 MIN BREAK
      ↓
REPEAT
```

Members can see who is currently studying and complete sessions together.

Completing a group session can provide cooperative XP bonuses.

---

## 4. 🐉 Boss Battles

Large academic goals become RPG bosses.

Examples:

```text
🐉 Dragon of Data Structures
⚔️ Titan of Operating Systems
🧙 Guardian of Computer Networks
💀 Final Exam Boss
```

Each boss has an HP bar representing the amount of preparation still required.

Students damage the boss by completing preparation quests:

```text
Past Paper        → -15 HP
Concept Revision  → -10 HP
Practice Problems → -20 HP
Mock Test         → -30 HP
```

This creates a visual representation of exam preparation instead of treating the exam as one large task.

---

## 5. ⚔️ Rapid-Fire Quiz Arena

The Quiz Arena turns revision into short combat rounds.

Students answer timed questions across different subjects.

The system tracks:

* Accuracy
* Response time
* Weak topics
* Strong topics
* Repeated mistakes

Weak areas can automatically generate additional quests.

For example:

```text
DBMS Quiz
     ↓
Normalization: 40%
     ↓
Weak Area Detected
     ↓
Revision Quest Created
     ↓
Practice Questions
```

---

## 6. 🌳 Skill Tree

Academic and professional skills are represented as interconnected skill nodes.

Example:

```text
                 COMPUTER SCIENCE
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
         DSA            OS           DBMS
          │             │             │
      ┌───┴───┐       Memory       SQL
      ↓       ↓      Management      │
    Trees    Graphs                   ↓
                                  Indexing
```

Students unlock nodes by demonstrating progress rather than simply completing arbitrary tasks.

This makes progression more meaningful than a simple XP counter.

---

## 7. 🎯 Career Radar

NEXUS connects academic progression with career preparation.

Students can provide:

* Their current skills
* Resume
* Target role
* Job description

The system identifies gaps and converts them into quests.

Example:

```text
TARGET ROLE
Software Engineering Intern

Missing Skills
├── Data Structures
├── SQL
├── REST APIs
└── System Design

         ↓

QUESTS

Solve 20 DSA problems       +100 XP
Build a REST API             +150 XP
Practice SQL queries         +80 XP
Study system design basics  +100 XP
```

The Career Radar provides a clearer picture of what the student should work on next.

---

## 8. 🔮 Future Self Simulator

The Future Self Simulator shows how consistent habits can affect long-term progression.

Students can compare different activity levels:

```text
KEEP GOING
Current study pattern

LEVEL UP
Consistent daily progress

BEAST MODE
High-intensity sustained progress
```

The simulator can show projected progress across:

* 7 days
* 30 days
* 90 days
* 6 months

The purpose is not to predict the future perfectly, but to make the consequences of consistency easier to visualize.

---

## 9. ⚖️ Anti-XP Farming

A progression system only works if XP represents meaningful progress.

NEXUS therefore prevents students from repeatedly farming easy tasks.

The system can consider:

* Task difficulty
* Skill relevance
* Repetition
* Completion frequency
* Learning impact

Repeated low-value tasks gradually provide diminishing rewards while higher-impact challenges receive greater XP.

This keeps progression focused on **actual improvement rather than grinding.**

---

# 🧠 How the Intelligence Works

NEXUS does not depend entirely on AI.

The core application works through structured systems:

```text
Student Data
     ↓
Deadlines + Skills + Energy + Priorities
     ↓
Rule-Based Quest Selection
     ↓
Quest Generation
     ↓
XP + Skill Progression
     ↓
Long-Term Tracking
```

AI can be used as an additional layer for tasks where natural-language reasoning is useful:

* Creating personalized study plans
* Generating quiz questions
* Interpreting resumes
* Suggesting learning resources
* Generating customized quests

This means the core product remains functional even without an AI API.

---

# 🛠️ Architecture & Tech Stack

### Frontend

* React 18+
* TypeScript
* Tailwind CSS
* Lucide Icons
* Motion animations

### Backend

* Node.js
* Express
* TypeScript / TSX

### Core Product Systems

* Quest management
* XP and leveling
* Skill tree
* Boss progression
* Pomodoro sessions
* Quiz engine
* Career scoring
* Progress tracking
* Recommendation rules

### Optional AI Layer

* Google Gemini
* `@google/genai`

AI is used where it adds value rather than being required for every feature.

### Audio & Visual Effects

* Web Audio API
* Canvas Confetti
* RPG-style sound effects
* Progress animations

---

# 💻 Getting Started

## Prerequisites

* Node.js 18+
* npm or yarn

## Installation

```bash
# Clone the repository
git clone <repo-url>

# Enter the project
cd nexus-rpg

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

The Gemini API key is optional.

## Running in Development

```bash
npm run dev
```

The server will start on:

```text
http://localhost:3000
```

## Building for Production

```bash
npm run build
npm run start
```

---

# ⚙️ Environment Variables

| Variable         | Description                                                                      | Required |
| ---------------- | -------------------------------------------------------------------------------- | -------- |
| `GEMINI_API_KEY` | Optional AI assistance for personalization, quiz generation, and resume analysis | No       |

NEXUS includes non-AI fallback logic for core functionality.

---

# 🏆 Hackathon Judges' Quick Tour

Experience the live app at:

**https://nexus-rpg.ai.studio**

Or use the **JUDGES QUICK TOUR** button to explore the main systems.

### 1. Command Center

View character stats, energy, quests, and today's objectives.

### 2. Quest Planner

Generate a focused study plan based on available time and priorities.

### 3. Quest Board

Complete academic and skill-development missions.

### 4. Video Learning

Learn from curated technical lectures and claim XP.

### 5. Study Rooms

Join a Pomodoro session with other students.

### 6. Boss Battles

Turn exams and major academic goals into visible progression targets.

### 7. Skill Tree

Track and unlock technical skills.

### 8. Career Radar

Identify career gaps and convert them into actionable quests.

---

# 🎮 Why NEXUS?

Most productivity tools answer:

> **"What do I need to do?"**

Most learning platforms answer:

> **"What should I learn?"**

NEXUS tries to answer:

> **"What should I do next, why does it matter, and how far have I progressed?"**

By combining productivity, learning, accountability, and career preparation into a single progression system, NEXUS turns student development into something that can be **seen, measured, and played.**

---

*Built with ❤️ for students worldwide.*
