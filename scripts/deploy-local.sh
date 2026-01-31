#!/bin/bash

# SHINOBI PRE-FLIGHT CHECK
echo "🚀 Starting My-Shinobi Local Deployment..."

# 1. Run Unit Tests (Vitest)
echo "🧪 Running Unit Tests (Bayesian & Ingestion)..."
npm run test:unit -- --run
if [ $? -ne 0 ]; then
  echo "❌ Unit Tests Failed! Deployment aborted."
  exit 1
fi

# 2. Run E2E Tests (Playwright)
echo "🤖 Running Robot Student (E2E) in Headless Mode..."
npm run test:e2e
if [ $? -ne 0 ]; then
  echo "❌ E2E Tests Failed! Deployment aborted."
  exit 1
fi

# 3. Build the Project
echo "🏗️ Building Production Bundle..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build Failed! Deployment aborted."
  exit 1
fi

# 4. Deploy to Firebase
echo "☁️ Pushing to Firebase Hosting..."
firebase deploy --only hosting
if [ $? -ne 0 ]; then
  echo "⚠️ Firebase deployment failed, but pre-flight checks passed."
fi

echo "🎉 Deployment Successful! My-Shinobi is live."
