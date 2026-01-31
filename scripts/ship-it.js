import { execSync } from 'child_process';

/**
 * SHINOBI PRE-FLIGHT CHECK (Node.js version for Windows/cross-platform)
 * Orchestrates tests, build, and deployment.
 */

console.log("🚀 Starting My-Shinobi Local Deployment...");

function run(command, desc) {
    console.log(`\n🧪 Step: ${desc}...`);
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (err) {
        console.error(`\n❌ ${desc} Failed! Deployment aborted.`);
        process.exit(1);
    }
}

// 1. Run Unit Tests (Vitest)
run('npm run test:unit -- --run', 'Running Unit Tests (Bayesian & Ingestion)');

// 2. Run E2E Tests (Playwright)
run('npm run test:e2e', 'Running Robot Student (E2E) in Headless Mode');

// 3. Build the Project
run('npm run build', 'Building Production Bundle');

// 4. Deploy to Firebase (Safely handled if firebase CLI is missing)
try {
    console.log("\n☁️ Pushing to Firebase Hosting...");
    execSync('firebase deploy --only hosting', { stdio: 'inherit' });
    console.log("\n🎉 Deployment Successful! My-Shinobi is live.");
} catch (err) {
    console.warn("\n⚠️ Firebase deploy command failed or skipped. Ensure Firebase CLI is installed and logged in.");
    console.log("✅ Pre-flight checks passed otherwise. Bundle is ready in 'dist/'.");
}
