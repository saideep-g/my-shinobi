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

### 🛠️ Tech Stack & Features
*   **Framework**: React (Vite) + TypeScript
*   **Styling**: Tailwind CSS + CSS Variables (Deep Dark Mode support)
*   **State/Auth**: Firebase Auth + Context API (Clean Auth Hooks)
*   **Database**:
    *   **Local**: IDB (IndexedDB Wrapper)
    *   **Cloud**: Firebase Firestore (with Security Rules)

---

## 📂 Project Structure
The project follows a Domain-Driven Design (DDD) inspired structure:

```
src/
├── core/               # Foundational services (Auth, Database, Theme)
│   ├── auth/           # AuthContext, RoleGuard, ProtectedRoute
│   ├── database/       # Firebase init, IDB Adapter
│   └── theme/          # ThemeProvider, Design Tokens
├── features/           # Feature-specific logic (Curriculum, Admin)
│   └── curriculum/     # Bundle seeds (e.g., English Grade 7)
├── layouts/            # The "Shell" System
│   ├── registry.ts     # Layout definitions
│   ├── QuestLayout.tsx # Mobile-first shell
│   └── EraLayout.tsx   # Desktop-first shell
├── services/           # Business logic & API bridges
│   ├── db/             # Firestore helpers
│   └── curriculum/     # bundleService (The Optimization Engine)
└── types/              # Single Source of Truth (Schemas)
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

### 5. Run Local Server
```bash
npm run dev
```

---

## 🛡️ Key Patterns Implemented

### The "Clean Auth" Hook
We access user identity without prop drilling:
```typescript
const { user, profile, loading } = useAuth();
```

### The Bundle Master Optimization
Instead of:
> App -> Fetch Big 2MB Bundle (Every Login) ❌ 💸

We do:
> App -> Check Tiny 1KB Master Index ✅
> If Changed -> Fetch Bundle & Cache to IndexedDB 📥
> If Same -> Load from Device (0ms, $0) ⚡

### The Shell System
We wrap the app dynamically based on the student's `preferredLayout`:
```tsx
<StudentShellSelector>
   <Dashboard />
</StudentShellSelector>
```

---

## 🔜 Next Steps: Sprint 2
*   **Gamification Engine**: Implementing XP, Levels, and Streaks.
*   **Assessment System**: Building the Quiz Runner and Result Processing.
*   **Dashboard Features**: Connecting real data to the specialized shells.
