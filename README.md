# My-Shinobi: Advanced Gamified Learning Platform

My-Shinobi is a next-generation adaptive learning application designed to master English grammar through gamified "Quests" and professional "Study Eras." It features an offline-first architecture, role-based security, and a cost-optimized content delivery network.

---

## 🚀 Sprint 1: The Foundational Core (Completed)
This sprint established the bedrock of the application, focusing on scalability, security, and performance.

### 🏗️ Architecture Highlights
*   **Offline-First Persistence**: Uses **IndexedDB** for instant load times and **Firestore** for cloud synchronization.
*   **Optimized Content Delivery**: Implements a **"Bundle Master" pattern**. The app checks a tiny version document before fetching heavy content, reducing read costs by ~99% for daily users.
*   **Adaptive Shells**: The UI morphs based on user preference:
    *   **Mobile Quest**: A bottom-nav, game-like experience.
    *   **Study Era**: A desktop-optimized, sidebar-driven workspace.
*   **Strict Security**: **Role-Based Access Control (RBAC)** ensures rigorous separation between Student and Admin areas.

---

## ⚔️ Sprint 2: The Question & Ingestion Engines (Completed)
Sprint 2 transformed the foundation into a specialized learning machine, focusing on content delivery and interactive pedagogies.

### 🧠 Intelligence & Ingestion
*   **Hashing Defense**: Implemented a `hashingService` (SHA-256) to fingerprint questions, preventing redundant AI-generated content.
*   **Duplicate Gatekeeper**: A `gatekeeperService` enforces library integrity at the point of ingestion.
*   **The "Lens" Engine**: A data-transformation layer that migrates legacy question schemas to newer versions on-the-fly, preventing UI crashes during schema evolution.

### 🎭 Interaction Arsenal
Implemented a **Versioned Template Registry** supporting 7+ interaction types:
*   **Universal**: MCQ (v1) and Numeric Input (v1) with tolerance logic.
*   **Advanced**: Two-Tier Reasoning (Pedagogical analysis) and Adaptive Branching (Remedial loops).
*   **Tactile**: Sorting (Reordering), Matching (Pairing), and Number Lines (Spatial calibration).
*   **Performance**: All interaction templates are **Lazy-Loaded**, maintaining a lightweight initial bundle.

### 🔊 Media & English Infrastructure
*   **Media Service**: Centralized asset resolution for local and remote (CDN) storage.
*   **Audio Mastery**: Implemented a robust `AudioPlayer` and `useAudioPlayer` hook for English listening exercises.
*   **Themed Visuals**: `ThemedIcon` components ensure SVGs respond dynamically to light/dark mode.

---

## 📂 Project Structure
The project follows a Domain-Driven Design (DDD) inspired structure:

```
src/
├── core/               # Foundational services (Auth, Database, Theme)
├── features/           # Feature-specific logic
│   ├── admin/          # Bundle Management & Ingestion
│   ├── curriculum/     # Grade-based content skeletons (e.g., Grade 7 English)
│   └── questions/      # THE ENGINE (Registry, Renderer, Types, Transforms)
├── shared/             # Reusable UI components & hooks (Media, Layouts)
├── services/           # Business logic & Domain services (Validation, Sync)
└── types/              # Single Source of TruthSchemas)
```

---

## ⚡ Getting Started

### 1. Prerequisites
*   Node.js (v18+)
*   A Firebase Project (Auth & Firestore enabled)

### 2. Installation
```bash
git clone <repository-url>
cd my-shinobi
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ASSET_BASE_URL=
```

### 4. Firestore Security Rules
Ensure your Firestore rules are set to allow authenticated access:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{uid} { allow read, write: if request.auth.uid == uid; }
    match /subjects/{subjectId} { allow read: if true; }
    match /bundle_master/{bundleId} { allow read: if true; }
    match /bundles/{bundleId} { allow read: if true; }
  }
}
```

---

## 🛡️ Key Patterns Implemented

### The "Lens" Pattern
We solve schema drift by "lensing" data to the correct version before it hits the UI:
```typescript
const lensedData = lensEngine.applyLens(questionMetadata, rawData, 2);
```

### The Shell System
Adaptive UI based on the student's `preferredLayout`:
```tsx
<StudentShellSelector>
   <Dashboard />
</StudentShellSelector>
```

---

---

## 🧠 Sprint 3: The Intelligence & Progression Engine (Completed)
Sprint 3 delivered the "Brain" of My-Shinobi, connecting interactive content with deep pedagogical modeling and gamified motivation.

### 🔬 The Bayesian "Brain"
*   **BKT Engine**: Implemented **Bayesian Knowledge Tracing** to calculate mastery probabilities. Every answer given by the student (including guesses and slips) updates their global mastery map in real-time.
*   **Selection Orchestrator**: A "Traffic Controller" engine that selects the next optimal question based on prerequisite mastery ($> 0.85$), targeting weak points, and enforcing spaced repetition.
*   **Intelligence Radar**: A granular heat-map dashboard that translates complex Bayesian probabilities into "Signal Strength" indicators for every curriculum Atom.

### 🛡️ Reliability & Sync
*   **Write-Through Buffer**: Implemented a resilience layer in **IndexedDB**. Every student response, duration, and mastery shift is logged immediately to disk, surviving browser crashes or battery failure.
*   **Atomic Cloud Sync**: A background service that uses **Firestore Transactions** to push local activity logs, student stats, and mastery updates to the cloud in a single, all-or-nothing batch.

### 🎮 Progression & Gamification
*   **Hero Levels & XP**: A non-linear progression system that awards **Power Points (PP)**. Calculated using a square-root curve to ensure early levels feel fast and rewarding.
*   **Achievement Engine**: A central **Badge Registry** that monitors student state to unlock rewards like "Tense Master" or "7-Day Streak Warrior."
*   **Path to Master**: A game-like curriculum map that visualizes the student's journey, showing "Locked" prerequisites and "Golden" mastered nodes.

### 🛠️ The Admin Workbench
*   **Content Workbench**: A command center for managing the English Grade 7 bundle.
*   **Atomic Publisher**: An administrative tool that handles **Semantic Versioning** and pushes curriculum updates to production using concurrent transactions, ensuring zero-downtime updates for students.

---

## 🎖️ Sprint 4: The Student Experience & Personalization (Completed)
Sprint 4 focused on the "Human Layer"—transforming raw Bayesian data into a polished, encouraging, and highly personal student sanctuary.

### 👤 Identity & Sanctuary
*   **Hero Profile**: A dedicated personal dashboard where students can track their accumulated **Power Points (PP)**, Day Streaks, and Hero Rank.
*   **Avatar Selection**: Implemented an unlockable avatar system (using DiceBear). Some identities (like the "Dragon Spirit") are level-gated, providing long-term incentive.
*   **Honors Vault**: A high-contrast trophy cabinet that houses the student's earned badges, providing immediate visual confirmation of their hard work.

### 🧭 The Command Center
*   **Universal Navigation**: A glass-morphic navigation system featuring a sticky status header (Level/Avatar) and a mobile-optimized bottom navigation bar.
*   **App Controller**: A central view-orchestrator that enables seamless transitions between the high-speed **Quest Shell** and the deep-focus **Study Era Library**.
*   **Shell Switcher**: Integrated logic to toggle between "Gamified Path" and "Structured Syllabus" views without losing application state.

### 📚 Curriculum Drill-Down
*   **Study Era Library**: A desktop-friendly, hierarchical view of the Grade 7 English syllabus. It allows students to focus on specific modules (e.g., "Present Tense Mastery") outside of the random quest loop.
*   **Knowledge Signals**: Every atom in the library is equipped with a **Mastery Gauge**, visualizing the underlying Bayesian stability of that specific concept.
*   **Subject Overview**: Summary cards providing a high-level "Radar" view: Syllabus Completion %, Average Knowledge Signal (Global Stability), and Subject Rank.

### 🔄 Remediation & Sharing
*   **Mistake Review**: A "remastery" loop that automatically captures incorrect answers and presents them for immediate pedagogical correction and explanation before the session ends.
*   **Parental Reports**: Implemented "Proof of Progress" sharing. Using **`html2canvas`** and the **Web Share API**, students can generate a premium achievement card to send to parents via WhatsApp or Social Media.

### 🏎️ Performance & Polish
*   **Skeleton UI System**: Replaced generic loading spinners with pulse-animated placeholders, eliminating **Cumulative Layout Shift (CLS)** and improving perceived load speed.
*   **Loading Guard**: A deterministic hydration service that ensures Firebase Auth and the IndexedDB engine are fully ready before the first question is rendered.
*   **Radar Memoization**: Optimized the Intelligence Radar using `React.memo` and `useMemo` to maintain a 60fps experience even with comprehensive mastery maps.

---

## 📂 Project Structure
The project follows a Domain-Driven Design (DDD) inspired structure:

```
src/
├── core/               # Foundational services (Auth, Database, Bayesian Engine)
│   └── media/          # AudioPlayer, ShareService, Asset Resolvers
├── features/           # Feature-specific logic
│   ├── admin/          # Workbench & Bundle Publishing
│   ├── assessment/     # Session Machine, Mistake Review, Radar
│   ├── curriculum/     # Grade-based content skeletons & data
│   ├── progression/    # Profile, Avatars, Badges, Daily Missions
│   └── questions/      # THE ENGINE (Registry, Renderer, Lensing)
├── shared/             # Reusable UI (Skeleton, Layouts, UniversalNav)
├── services/           # Business logic (Sync, Validation, Mission logic)
└── types/              # Single Source of Truth (Schemas)
```

---

---

## 🏗️ Sprint 5: Admin Intelligence & DevOps (Completed)
Sprint 5 focused on bulletproofing the platform through advanced routing, automated testing, and administrative speed-controls.

### 🛣️ Production-Grade Routing
*   **Deep-Linking Architecture**: Migrated to **React Router v6**, providing every subject, quest, and profile with a unique, bookmarkable URL.
*   **Domain Separation**: Enforced rigorous logic separation between the **Student Domain** (`/quest`, `/library`) and the **Admin Domain** (`/admin`).
*   **State-URL Sync**: Linked the internal application state to the browser history, enabling perfect "Back/Forward" navigation without data loss.

### 🤖 Testing & Simulation Shield
*   **Bayesian Unit Tests**: Integrated **Vitest** to mathematically verify the BKT engine. We now "proof" that mastery math correctly identifies lucky guesses and silly slips.
*   **The Robot Student (E2E)**: Implemented **Playwright** simulations. An automated robot now "plays" the app, logging in and completing quests to verify that every component and database interaction works in sync.
*   **Pre-Flight Automation**: Created the `ship-it` orchestrator. A single command (`npm run ship-it`) that runs unit tests, E2E simulations, and builds the production bundle, ensuring zero-defect deployments.

### 🛠️ Admin "Speed Run" Controls
*   **System Guards**: A new administrative interface for real-time user constraint management.
*   **Developer Speed Run**: A toggle to truncate sessions (3 questions vs 20), allowing for 5-second verification of Bayesian updates and XP gains.
*   **Data Migration Utility**: A specialized script to bridge years of legacy progress from the "Blue Ninja" platform into the new high-fidelity Bayesian map.

---

## 🚀 Sprint 6: Vertical Content & Final Polish (Planned)
*   **Syllabus Expansion**: Fully populating the "Math Grade 7" and "Science Grade 7" bundles with AI-generated, human-verified questions.
*   **Advanced Remediation**: Implementing branching remedial videos for atoms where the knowledge signal remains low after 3 sessions.
*   **Performance 2.0**: Migrating from IndexedDB to a persistent Service Worker for true "Instant-On" capabilities.
