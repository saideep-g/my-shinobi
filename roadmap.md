# My-Shinobi: Refined Technical Roadmap (2026)

### **Sprint 1: Foundational Core (The Bedrock)**
*Status: 100% Complete*

* **Phase 1:** Project Initialization & Modular Scaffolding (Vite + React + TS).
* **Phase 2:** Global Types & Domain Schemas (Subject/Atom/Log/Mastery).
* **Phase 3:** Design Tokens & **Theme Engine** (CSS Variables for Light/Dark support).
* **Phase 4:** Persistence: **IndexedDB Adapter** (Offline-First local storage core).
* **Phase 5:** Cloud: **Firestore Connector** (Real-time bridge and backup).
* **Phase 6:** Auth: **Firebase Identity Service** & Unified Auth Hooks.
* **Phase 7:** Security: Role-Based Access Control (**RBAC**) & Protected Routes.
* **Phase 8:** Layout: The **"Shell" Pattern** (Adaptive containers for Mobile/Web).
* **Phase 9:** Curriculum: **Bundle Master Index** logic (Firestore Read Optimization).
* **Phase 10:** Curriculum: **Atom Knowledge Graph** & Learning Dependency logic.

---

### **Sprint 2: Content & Infrastructure (The Factory)**
*Status: 100% Complete*

* **Phase 11:** Ingestion: **SHA-256 Hashing Service** (Content Fingerprinting).
* **Phase 12:** Ingestion: **Duplicate Gatekeeper** & Version Conflict Resolution.
* **Phase 13:** Registry: **Semantic Versioning** (1.0.0) for Content Bundles.
* **Phase 14:** Question Domain: **Base Template Wrapper** (Atomic Component Design).
* **Phase 15:** Templates: **MCQ & Numeric Input** (Foundation templates).
* **Phase 16:** Templates: **Two-Tier Reasoning** (Surface answer + Underlying "Why").
* **Phase 17:** Templates: **Sorting, Matching, & Number Lines** (Advanced Interaction).
* **Phase 18:** The **"Lens" Engine**: Data Transformers for legacy content adapter.
* **Phase 19:** Media Service: Asset handling for SVGs, Illustrations, and Subject icons.
* **Phase 20:** Content Seeding: **English (Tenses) Skeleton** data initialization.

---

### **Sprint 3: The Learning Engine (The Brain)**
*Status: 100% Complete*

* **Phase 21:** Engine: **Bayesian Knowledge Tracing (BKT)** Mathematical Library.
* **Phase 22:** Engine: **Selection Orchestrator** (BKT-based "Best-Next" question logic).
* **Phase 23:** Engine: **Mastery State Management** (Local IDB vs. Remote Firestore).
* **Phase 24:** Session: **The State Machine** (Idle -> Play -> Summary -> Sync).
* **Phase 25:** Strategy: **Diagnostic Flow** (Initial skill assessment/placement).
* **Phase 26:** Strategy: **Remedial Loop** (Automatic focus on weak knowledge atoms).
* **Phase 27:** Strategy: **Daily Mission Logic** (Habit-forming question targets).
* **Phase 28:** Sync: **"Write-Through" Buffer Manager** (Safe background cloud pushes).
* **Phase 29:** Sync: **Monthly Bucket Aggregator** (Optimized Firestore log writes).
* **Phase 30:** Recovery: **Atomic Transactions** for Bundle Publishing & Versioning.

---

### **Sprint 4: Student Experience & Personalization (The Quest)**
*Status: 100% Complete*

* **Phase 31:** UI: **Universal Navigation Shell** (Contextual Mobile Bottom-Nav).
* **Phase 32:** UI: **Path-to-Master Map** (Visual quest-style subject progress).
* **Phase 33:** UI: **Study Era Library** (Detailed hierarchical syllabus view).
* **Phase 34:** Game Mechanics: **XP, Power Points, & Hero Leveling** logic.
* **Phase 35:** Game Mechanics: **Badge Vault & Streak Engine** (Persistence & Flame icons).
* **Phase 36:** Sensory: **Sound FX & Haptic Feedback** (Audio/Tactile reward layer).
* **Phase 37:** Reporting: **"Parental Report"** (WhatsApp image sharing via Web Share API).
* **Phase 38:** Personalization: **Hero Profile** (Avatar persistence & Theme preferences).
* **Phase 39:** Feedback: **Mistake Review** (Remediation loop with teacher explanations).
* **Phase 40:** Polish: **Skeleton Loaders** & Global App Hydration Guard.

---

### **Sprint 5: Admin Intelligence & DevOps (The Mastery)**
*Status: 100% Complete*

* **Phase 41:** Admin UI: **The Content Workbench** (Subject & Atom CRUD Editor).
* **Phase 42:** Admin UI: **Bundle Publisher** (Versioning, Change-log, & Atomic Push).
* **Phase 43:** Intelligence: **Mastery Radar** (Bayesian Probability visualization).
* **Phase 44:** Admin Logic: **Speed-Run Toggle** (Session constraint override for Testing).
* **Phase 45:** Architecture: **React Router v6** (Multi-subject URL-based navigation).
* **Phase 46:** Safety: **Firestore Security Rules** (Auth-based Data Protection).
* **Phase 47:** Testing: **Unit Tests** for BKT Math & Ingestion Logic (Vitest).
* **Phase 48:** Testing: **E2E Playwright Tests** (Automated "Robot Student" journey).
* **Phase 49:** DevOps: **Local "Pre-Flight" Script** (Local Test-Before-Deploy pipeline).
* **Phase 50:** Migration: **Legacy Data Porting** (Blue Ninja -> My-Shinobi schema mapper).
---



src/
├── core/                        # Foundational "Always-On" logic
│   ├── auth/                    # Firebase Identity, RBAC, & LoadingGuard.tsx
│   ├── database/                # firebase.ts init & adapter.ts (IDB Wrapper)
│   ├── engine/                  # The Brain: bayesian.ts & SessionContext.tsx
│   ├── intelligence/            # MasteryMap.ts & IntelligenceContext.tsx
│   ├── media/                   # SensoryService.ts (Audio/Haptics) & shareService.ts
│   ├── theme/                   # ThemeContext.tsx & design-tokens.css
│   └── debug/                   # WarpService.ts (Speed-run & State Injection)
├── features/                    # Domain-driven business modules
│   ├── admin/                   # Content Management
│   │   ├── components/          # ContentWorkbench, BundleEditor, PublishModal
│   │   ├── services/            # publishService.ts, versioning.ts
│   │   └── data/                # UserManagement config
│   ├── assessment/              # The "Player" experience
│   │   ├── components/          # QuestSessionUI, QuestSummary, MistakeReview
│   │   └── hooks/               # useSession.ts, useRemediation.ts
│   ├── curriculum/              # Knowledge Graph
│   │   ├── data/                # grade-7-english.ts, grade-7-math.ts
│   │   └── hooks/               # useBundles.ts
│   ├── progression/             # Gamification & Identity
│   │   ├── components/          # DailyMissionCard, HeroProfile, PathToMaster
│   │   ├── hooks/               # useWeeklyStats.ts, useMission.ts
│   │   ├── context/             # MissionContext.tsx, ProgressionContext.tsx
│   │   └── data/                # avatars.ts, badges.ts
│   └── questions/               # Template Engine
│       ├── components/          # QuestionRenderer.tsx, MCQTemplate, NumericTemplate
│       └── registry/            # templateRegistry.ts, lensTransformers.ts
├── shared/                      # Global UI components & Shells
│   ├── components/              # ui/ (Button, Card, Skeleton, MasteryGauge)
│   ├── layouts/                 # UniversalNav.tsx (Switcher), BaseShell.tsx
│   └── hooks/                   # useFeedback.ts, useDebounce.ts
├── services/                    # Background logic & Data plumbing
│   ├── sync/                    # WriteThroughBuffer.ts, SyncService.ts
│   └── validation/              # hashing.ts, duplicateCheck.ts
├── types/                       # Global "Source of Truth" interfaces
│   ├── curriculum.d.ts          # Subject, Chapter, Atom, Bundle
│   ├── assessment.d.ts          # Session, Log, MasteryState
│   └── progression.d.ts         # StudentStats, Achievement, Mission
├── AppRouter.tsx                # React Router v6 mapping
├── main.tsx                     # Entry point with Providers (Auth, Theme, etc.)
└── index.css                    # Tailwind & Global styles
scripts/                         # DevOps & Maintenance
├── deploy-local.sh              # Pre-flight check & Firebase deploy script
└── migrate-data.ts              # Legacy data porting utility
e2e/                             # Playwright "Robot Student" tests
└── robot-student.spec.ts        # Full session E2E test



### Context Architecture Placement

The following contexts should be implemented within their respective subfolders in `src/core/`:

| Context Name | Recommended Path | Primary Responsibility |
| :--- | :--- | :--- |
| **AuthContext** | `src/core/auth/AuthContext.tsx` | Manages [Firebase Auth](https://firebase.google.com) user session, sign-in/out, and high-level role access. |
| **ProgressionContext** | `src/core/progression/ProgressionContext.tsx` | Tracks long-term student data like `powerPoints`, `heroLevel`, and current streak. |
| **SessionContext** | `src/core/engine/SessionContext.tsx` | Manages the active quiz state, local answer buffering, and current question timers. |
| **SyncContext** | `src/core/database/SyncContext.tsx` | Monitors `isOnline` status and orchestrates background syncing between [IndexedDB](https://developer.mozilla.org) and [Firestore](https://firebase.google.com). |
| **ThemeContext** | `src/core/theme/ThemeContext.tsx` | Controls global visual state (Light vs. Dark mode) and current layout selection. |