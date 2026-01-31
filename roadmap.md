# My-Shanobi: High-Level Roadmap
Sprint 1: Foundational Core (Phases 1-10)

Phase 1: Project Initialization & Directory Scaffolding (Modular Architecture).

Phase 2: Global Types & Domain Schemas (The "Source of Truth").

Phase 3: Design Tokens & Theme Engine (CSS Variables for Light/Dark support).

Phase 4: Persistence Layer: IndexedDB Adapter (Offline-First Foundation).

Phase 5: Persistence Layer: Firestore Connector (Cloud Bridge).

Phase 6: Auth Domain: Identity Service & Clean Auth Hooks.

Phase 7: Auth Domain: Role-Based Access Control (RBAC) & Route Guards.

Phase 8: Layout Registry: The "Shell" Pattern (Study Era vs. Quest Dashboard).

Phase 9: Curriculum Domain: Subject, Chapter, and Module Graph definitions.

Phase 10: Curriculum Domain: Atom Knowledge Graph & Dependency logic.

Sprint 2: Content & Question Infrastructure (Phases 11-20)

Phase 11: Ingestion Pipeline: The Fingerprint (SHA-256) Hashing Service.

Phase 12: Ingestion Pipeline: Duplicate Gatekeeper & Conflict Resolution logic.

Phase 13: Question Domain: The Versioned Registry (Semantic Versioning).

Phase 14: Question Domain: Base Template & Component Renderer.

Phase 15: Template Implementation: MCQ (v1) & Numeric Input (v1).

Phase 16: Template Implementation: Two-Tier Reasoning & Branching.

Phase 17: Template Implementation: Sorting, Matching, and Number Lines.

Phase 18: The "Lens" Engine: Data Transformers for Template Versioning.

Phase 19: Media Service: Handling SVGs, Images, and Subject Assets.

Phase 20: Content Seeding: English Subject (Tenses) Skeleton Setup.

Sprint 3: The Learning Engine (The Brain) (Phases 21-30)

Phase 21: Engine: Bayesian Math Library (Mastery Calculation Logic).

Phase 22: Engine: The Selection Orchestrator (Picking the "Best Next" ID).

Phase 23: Engine: Mastery State Management (Global vs. Local Sync).

Phase 24: Assessment Domain: The Session Machine (State: Idle -> Play -> Sync).

Phase 25: Assessment Strategy: The Diagnostic Flow.

Phase 26: Assessment Strategy: The Remedial/Reinforcement Flow.

Phase 27: Assessment Strategy: The Daily Mission/Quest Flow.

Phase 28: Sync Service: The "Write-Through" Buffer Manager.

Phase 29: Sync Service: Monthly Bucket Aggregator (Firestore Optimization).

Phase 30: Offline Recovery: Conflict Merging & Error Handling.

Sprint 4: Student Experience & Personalization (Phases 31-40)

Phase 31: Student UI: Navigation Shell & Role-Based Entry.

Phase 32: Student UI: The "Quest" Dashboard (Mobile-First Layout).

Phase 33: Student UI: The "Study Era" Dashboard (Standard Layout).

Phase 34: Game Mechanics: Power Points, XP, and Level Up logic.

Phase 35: Game Mechanics: Achievement Engine & Streak Tracker.

Phase 36: Personalization: "For Me" Recommendation Engine logic.

Phase 37: Subject Specific: English-specific UI components (Tense charts).

Phase 38: UI Components: The "Player" Shell (Timer, Progress, Feedback).

Phase 39: UI Components: Result Screens & Skill Level analysis.

Phase 40: Feedback Loop: Detailed Explanations & Misconception guidance.

Sprint 5: Admin Intelligence & DevOps (Phases 41-50)

Phase 41: Admin UI: The Content Workbench (Subject/Atom Management).

Phase 42: Admin UI: Question Editor with "Duplicate Check" feedback.

Phase 43: Intelligence: Coverage Radar (Gap Analysis Tool).

Phase 44: Intelligence: Student Voice Feed (Error Pattern Tracker).

Phase 45: Intelligence: Pedagogical Health Metrics (Template Diversity).

Phase 46: Testing: The "Warp" Service (Warp to End of Quiz / State Injection).

Phase 47: Testing: Unit Tests for Bayesian & Ingestion logic.

Phase 48: Testing: E2E Playwright Tests (The "Robot Student").

Phase 49: CI/CD: GitHub Actions for "Test-Before-Deploy" automation.

Phase 50: Migration: Final Data Porting from Blue Ninja to My-Shanobi.



src/
├── core/                # Shared foundational logic
│   ├── auth/            # Identity service & Role-Based Access
│   ├── database/        # Firestore & IndexedDB initialization
│   ├── engine/          # Bayesian Math & Selection logic (The Brain)
│   ├── intelligence/    # Analytics & Gap analysis logic
│   └── theme/           # Design Tokens & Theme switching logic
├── features/            # Independent business modules
│   ├── admin/           # Workbench, Uploaders, Intelligence UI
│   ├── assessment/      # Question Player & Session State Machine
│   ├── curriculum/      # Subject/Atom Knowledge Graphs
│   ├── progression/     # Power Points, Levels, and Streaks
│   └── questions/       # Versioned Template Registry & Components
├── layouts/             # Dashboard "Shells" (Quest vs Study Era)
├── services/            # Pure logic/Side-effects
│   ├── sync/            # Firestore Sync & Monthly Bucket Manager
│   └── validation/      # Hashing & Duplicate Gatekeeper
├── shared/              # Reusable UI Atoms (Buttons, Cards)
├── types/               # Global TypeScript interfaces
└── App.tsx              # Main Router Entry



### Context Architecture Placement

The following contexts should be implemented within their respective subfolders in `src/core/`:

| Context Name | Recommended Path | Primary Responsibility |
| :--- | :--- | :--- |
| **AuthContext** | `src/core/auth/AuthContext.tsx` | Manages [Firebase Auth](https://firebase.google.com) user session, sign-in/out, and high-level role access. |
| **ProgressionContext** | `src/core/progression/ProgressionContext.tsx` | Tracks long-term student data like `powerPoints`, `heroLevel`, and current streak. |
| **SessionContext** | `src/core/engine/SessionContext.tsx` | Manages the active quiz state, local answer buffering, and current question timers. |
| **SyncContext** | `src/core/database/SyncContext.tsx` | Monitors `isOnline` status and orchestrates background syncing between [IndexedDB](https://developer.mozilla.org) and [Firestore](https://firebase.google.com). |
| **ThemeContext** | `src/core/theme/ThemeContext.tsx` | Controls global visual state (Light vs. Dark mode) and current layout selection. |