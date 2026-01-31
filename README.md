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

## 🔜 Next Steps: Sprint 3
*   **Gamification Engine**: Implementing XP, Levels, and Streaks based on quiz performance.
*   **Intelligence Radar**: Building the mastery tracking system for curriculum atoms.
*   **Assessment System**: Finalizing the "Run Quest" experience with full result processing.
*   **Bayesian Mastery**: Integrating extra data from Two-Tier and Branching templates into the learning model.
